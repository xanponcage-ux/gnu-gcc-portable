import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ReactSelect from "components/Select/ReactSelect";
import MDButton from "components/MDButton";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { GetAuthorization } from "../../utils";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import "../../tabulatorCss.scss";
import MDInput from "components/MDInput";
import CloseIcon from "@mui/icons-material/Close";
import { Today } from "@mui/icons-material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import MergeIcon from "@mui/icons-material/Merge";
import SendAndArchiveIcon from "@mui/icons-material/SendAndArchive";

export default function LD01S005() {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [batchTable, setBatchTable] = useState(null);
  const [orderTable, setOrderTable] = useState(null);
  const [batchTableData, setBatchTableData] = useState([]);
  const [orderTableData, setOrderTableData] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [mBatch, setMBatch] = useState("");
  const [thick, setThick] = useState("");
  const [odia, setOdia] = useState("");
  const [matNo, setMatNo] = useState([]);
  const [selectedMatNo, setSelectedMatNo] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);

    setBatchTableData([]);
    setOrderTableData([]);
    setDlinkTableData([]);
    setCoilFilter({
      batchId: "",
      parentBatch: "",
      motherBatch: "",
      odia: "",
      thick: "",
    });
    setCoilFilter2({
      batchId: "",
      parentBatch: "",
      motherBatch: "",
      odia: "",
      thick: "",
    });
  };
  const [coilFilter, setCoilFilter] = useState({
    batchId: "",
    parentBatch: "",
    motherBatch: "",
    odia: "",
    thick: "",
  });
  const [coilFilter2, setCoilFilter2] = useState({
    batchId: "",
    parentBatch: "",
    motherBatch: "",
    odia: "",
    thick: "",
  });
  const [orderFilter, setOrderFilter] = useState({
    orderId: "",
    itemId: "",
    thkFrom: "",
    thkTo: "",
    odiaFrom: "",
    odiaTo: "",
    section: {
      value: "",
      label: "",
    },
  });
  const [selectedBatchVal, setSelectedBatchVal] = useState("");
  const [selectedOrderVal, setSelectedOrderVal] = useState("");
  const [selectedItemVal, setSelectedItemVal] = useState("");
  const [open, setOpen] = useState(false);
  const [dlinkTable, setDlinkTable] = useState(null);
  const [dlinkTableData, setDlinkTableData] = useState([]);

  //page load
  useEffect(() => {
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      GetAuthorization().then((token) => {
        validateUser(token);
        //page load functions here
        getGroupPlantId(token.accessToken);
        getMatNoList("", "");
      });
    }
    fetchData();
  }, []);

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };

  const validateUser = async (token) => {
    try {
      var plant = "";
      //if (serverDetails.PersonalNo === ``)
      {
        var userDetails = jwt.verify(
          token.refreshToken,
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
      var pageName = "LD01S005";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
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
        // }
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
    }

    if (serverDetails.devMode == true) {
      setRestricted(false);
      setAdmin(true);
    }
  };

  const getScreenAuth = (plantCd, userId, pageName, accessToken) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
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

  const getGroupPlantId = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      let data = {
        adid: serverDetails.PersonalNo,
      };
      var url = "api/common/getGroupPlant";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            setLoading(false);
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[0];
              obj.value = row[1];
              items.push(obj);
            });
            setPlant(items);

            setSelectedPlant(items[0]);

            Promise.all([
              getProcess(items[0], token.accessToken),
              getStatus(items[0], token.accessToken),
              getHoldRsn(token.accessToken),
              getScrapMatNo(items[0], token.accessToken),
            ]).finally(() => {
              setLoading(false);
            });
          }
        })
        .catch((f) => {
          setLoading(false);
        });
    });
  };

  //use Effect to render display data
  useEffect(() => {
    if (batchTableData && batchTableData.length > 0) {
      // setBatchTable(
      let varData = new Tabulator("#batchTable", {
        data: batchTableData,
        // columns: [
        //   {
        //     ...(tabValue == 1 && {
        //       formatter: "rowSelection",
        //       titleFormatter: "rowSelection",
        //       hozAlign: "center",
        //       headerSort: false,
        //       frozen: true,
        //     }),
        //   },
        //   ...batchTableCol,
        // ],
        columns: batchTableCol,
        height: 380,
        layout: "fitDataFill",
      });
      varData?.on("rowSelected", function (row) {
        setOrderTableData([,]);
      });
      varData?.on("rowDeselected", function (row) {
        setOrderTableData([,]);
      });
      setBatchTable(varData);
      // );
    }
  }, [batchTableData, selectedBatchVal]);

  useEffect(() => {
    if (dlinkTableData && dlinkTableData.length > 0) {
      let varData = new Tabulator("#dlinkTable", {
        data: dlinkTableData,
        columns: batchTableColDlink,
        height: 380,
        layout: "fitDataFill",
      });
      setDlinkTable(varData);
    }
  }, [dlinkTableData]);

  useEffect(() => {
    setSelectedItemVal("");
    setSelectedOrderVal("");
    setSelectedBatchVal("");
    setOrderTableData([]);
    setBatchTableData([]);
  }, [tabValue]);

  useEffect(() => {
    if (orderTableData && orderTableData.length > 0) {
      setOrderTable(
        new Tabulator("#orderTable", {
          data: orderTableData,
          columns: orderTableCol,
          height: 380,
          layout: "fitDataFill",
        })
      );
    }
  }, [orderTableData, selectedOrderVal]);

  useEffect(() => {
    if (
      //selectedBatchVal?.length > 0 &&
      selectedOrderVal?.length > 0
    ) {
      setOpen(true);
    }
  }, [selectedBatchVal, selectedOrderVal]);

  const fetchTableData = (type) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getCoilData(token.accessToken, type)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getCoilData = (accessToken, type) => {
    setLoading(true);
    // debugger
    // let selectedRows1 = batchTable?.getSelectedRows();
    // if ((selectedRows1 === undefined || selectedRows1?.length === 0 ) && tabValue == 1) {
    //   alertify.error("Please select Rows");
    //   return;
    // }
    let varCoilId = [];
    // if (tabValue == 1 && type.includes("Update")) {
    if (type.includes("Update") && tabValue === 0) {
      if (!batchTable) {
        alertify.error("Please Click Get Batches");
        return;
      }
      var selectedRows = batchTable.getSelectedRows();
      if (tabValue == 1 && selectedRows.length == 0) {
        alertify.error("Please select rows");
        return;
      }
      selectedRows.forEach(function (item) {
        varCoilId.push(item._row.data.BATCH1);
      });
    }
    if (type.includes("Update") && tabValue === 1) {
      if (!dlinkTable) {
        alertify.error("Please Click Get Batches");
        return;
      }
      var selectedRows = dlinkTable.getSelectedRows();
      if (tabValue == 1 && selectedRows.length == 0) {
        alertify.error("Please select rows");
        return;
      }
      selectedRows.forEach(function (item) {
        varCoilId.push(item._row.data.BATCH1);
      });
    }
    return new Promise((resolve) => {
      var data = {
        plant: "",
        coilId: coilFilter.batchId ?? "",
        delinkCoils: varCoilId,
        orderId: orderFilter.orderId ?? "",
        selectedBatch: selectedBatchVal ?? "",
        selectedItem: selectedItemVal ?? "",
        selectedOrder: selectedOrderVal ?? "",
        parentBatch: coilFilter.parentBatch ?? "",
        motherBatch: coilFilter.motherBatch ?? "",
        odia: coilFilter.odia ?? "",
        thick: coilFilter.thick ?? "",
        itemId: orderFilter.itemId ?? "",
        thkFrom: orderFilter.thkFrom ?? "",
        thkTo: orderFilter.thkTo ?? "",
        odiaFrom: orderFilter.odiaFrom ?? "",
        odiaTo: orderFilter.odiaTo ?? "",
        section: orderFilter.section?.value ?? "",
        type: tabValue == 0 ? "LINK" : tabValue == 1 ? "DELINK" : "",
        param: type === "GetCoilDlink" ? "GetCoil" : type,
        matNo: selectedMatNo?.value ?? "",
      };
      // if (!data.plant) {
      //   alertify.error("Please select Plant ID");
      //   resolve();
      //   return;
      // }
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LD01S005/getList";
      setOpen(false);
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          console.log(response);
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error("Error!");
            return;
          } else {
            if (response?.data?.length == 0) {
              alertify.error("No Data Found!");
              // if (type == "GetCoil") {
              //   setBatchTableData([,]);
              //   setLoading(false);
              // }
              // if (type == "GetCoilDlink") {
              //   setDlinkTableData([,]);
              //   setLoading(false);
              // }
              if (type == "GetOrder") {
                setOrderTableData([,]);
                setLoading(false);
              }
              return;
            } else {
              // if (type == "GetCoil") {
              //   setBatchTableData(response.data);
              //   setLoading(false);
              // }
              // if (type == "GetCoilDlink") {
              //   setDlinkTableData(response.data);
              //   setLoading(false);
              // }
              if (type == "GetOrder") {
                setOrderTableData(response.data);
                setLoading(false);
              }
              if (type.includes("Update")) {
                if (
                  response?.data?.toString().includes("N-") ||
                  response?.data?.toString().includes("errCoil")
                ) {
                  alertify.error(response?.data?.toString());
                } else {
                  alertify.success(
                    response?.data?.toString()?.length > 0
                      ? response?.data?.toString()
                      : "Success!"
                  );
                  setOrderTable(null);
                  setOrderTableData([,]);
                }
              }
            }
          }
        })
        .finally(async (f) => {
          setLoading(false);
          setSelectedOrderVal("");
          setSelectedItemVal("");
          setSelectedBatchVal("");
          if (type.includes("Update") && tabValue === 0) {
            handleLinkTabDataClear();
            getCoilDataLinkDlink(true);
            // fetchTableData("GetCoil");
          }
          if (type.includes("Update") && tabValue === 1) {
            handleDLinkTabDataClear();
            getCoilDataLinkDlink(true);
            // fetchTableData("GetCoilDlink");
          }
          resolve();
        });
    });
  };

  const saveData = async () => {
    console.log("Inside Save Data");
    var selectedRows = table.getSelectedRows();

    var selectedData = [];
    selectedRows.forEach(function (item) {
      selectedData.push({
        BATCH_ID: item._row.data.BATCH_ID,
      });
    });

    //no row selected alert
    if (selectedData.length == 0) {
      alertify.error("No rows selected from Display Table");
      return;
    }
    var data = {
      selectedData: selectedData,
      plantCd: "0780",
    };
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD01S005/saveData";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error!");
            return;
          } else {
            if (res?.data?.substr(0, 1) === "Y") {
              alertify.success(res?.data);
              fetchTableData();
              setLoading(false);
            } else {
              alertify.error(res?.data);
              setLoading(false);
            }
          }
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  const orderTableCol = [
    {
      title: "Order",
      field: "ORD",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value == selectedOrderVal) {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        if (value) {
          return value;
        }
        return value;
      },
      cellClick: function (e, cell) {
        setSelectedOrderVal(cell.getRow().getData().ORD);
        setSelectedItemVal(cell.getRow().getData().ITEM);
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ord Qnty",
      field: "ORD_QNTY",
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
      title: "BTP",
      field: "BTP",
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
      title: "Ord Desc",
      field: "ORD_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mark Cust Name",
      field: "MARK_CUST_NM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thick Min",
      field: "THK_MIN",
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
      title: "Thick Max",
      field: "THK_MAX",
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
      title: "ODIA Min",
      field: "ODIA_MIN",
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
      title: "ODIA Max",
      field: "ODIA_MAX",
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
      title: "Length Min",
      field: "LENGTH_MIN",
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
      title: "Length Max",
      field: "LENGTH_MAX",
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
      title: "Ord Crt Dt",
      field: "ORD_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material",
      field: "FG_MAT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Desc",
      field: "FG_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mark Cust Cd",
      field: "MARK_CUST_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "IP",
      field: "IP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Spec",
      field: "SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Sur Finish",
      field: "SUR_FINISH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "End Finish",
      field: "END_FINISH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Geometry",
      field: "GEOMETRY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "FIN CONDITION",
    //   field: "FIN_CONDITION",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "Section Type",
      field: "SECTION_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const batchTableCol = [
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
      field: "BATCH1",
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   if (value == selectedBatchVal) {
      //     cell.getElement().style["background-color"] = "#DA8EE7";
      //     cell.getElement().style["color"] = "#FFFFFF";
      //   }
      //   if (value) {
      //     return value;
      //   }
      //   return value;
      // },
      // cellClick: function (e, cell) {
      //   setSelectedBatchVal(cell.getRow().getData().BATCH1);
      // },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
      title: "Thik",
      field: "THK",
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
      title: "Length",
      field: "LENGTH1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cast No",
      field: "CAST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "Grade",
      field: "GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Planned Proc",
      field: "PLANNED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Passed Proc",
      field: "PASSED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Current Proc",
      field: "CURR_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Proc",
      field: "NEXT_PROC",
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
      title: "Order",
      field: "ORD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mill No",
      field: "MILL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "Bare Sample Tag",
      field: "SAMPLE_TAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Tagged Batch",
      field: "TAGGED_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch Crt Dt",
      field: "BATCH_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No.",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const batchTableColDlink = [
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
      field: "BATCH1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
      title: "Thik",
      field: "THK",
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
      title: "Length",
      field: "LENGTH1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cast No",
      field: "CAST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },

    {
      title: "Grade",
      field: "GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Planned Proc",
      field: "PLANNED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Passed Proc",
      field: "PASSED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Current Proc",
      field: "CURR_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Proc",
      field: "NEXT_PROC",
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
      title: "Order",
      field: "ORD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mill No",
      field: "MILL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "Bare Sample Tag",
      field: "SAMPLE_TAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Tagged Batch",
      field: "TAGGED_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch Crt Dt",
      field: "BATCH_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No.",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const downloadTableExcel = () => {
    if (tableData.length == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "Pipe Decision" + ".xlsx";
    table.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const getMatNoList = async (firstMatNo, type) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      let data = {
        matNo: firstMatNo ?? "",
        type: type ?? "",
        plant: selectedPlant?.value ?? "",
      };
      var url = "api/LD01S005/getMatNoList";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            setLoading(false);
          } else {
            console.log(res?.data);
            var items = [];
            res.data.map((row) => {
              var obj = new Object();
              obj.label = row.MAT_NO;
              obj.value = row.MAT_NO;
              items.push(obj);
            });
            setMatNo(items);
          }
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((f) => {
          setLoading(false);
        });
    });
  };

  const getFittingOrder = async (matNo) => {
    console.log("Inside Get Fitting Order.");
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var data = {
        plant: "",
        orderId: orderFilter.orderId ?? "",
        odia: coilFilter.odia ?? "",
        thick: coilFilter.thick ?? "",
        itemId: orderFilter.itemId ?? "",
        thkFrom: orderFilter.thkFrom ?? "",
        thkTo: orderFilter.thkTo ?? "",
        odiaFrom: orderFilter.odiaFrom ?? "",
        odiaTo: orderFilter.odiaTo ?? "",
        section: orderFilter.section?.value ?? "",
        matNo: matNo ?? "",
      };
      var url = "api/LD01S005/getFittingOrder";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            setLoading(false);
            return;
          } else {
            console.log("res.data: ", res.data);
            if (res?.data?.length === 0) {
              alertify.error("No Data Found!");
              return;
            }
            setOrderTableData(res.data);
          }
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((f) => {
          setLoading(false);
        });
    });
  };

  const handleFittingOrdBtn = async () => {
    setOrderTableData([,]);
    let selectedRows = batchTable?.getSelectedRows();
    if (selectedRows === undefined || selectedRows?.length === 0) {
      alertify.error("Please select Rows");
      return;
    }
    let firstMatNo = selectedRows[0]?._row?.data?.MAT_NO;

    for (let i = 1; i < selectedRows.length; i++) {
      const currentMaterial = selectedRows[i]?._row?.data?.MAT_NO;
      if (currentMaterial === undefined || currentMaterial !== firstMatNo) {
        alertify.error("Selected rows must have same material no.");
        return;
      }
    }

    handleMatNoChange("");
    getMatNoList(firstMatNo, "FITORD");
    getFittingOrder(firstMatNo);
  };

  const handleMatNoChange = (e) => {
    console.log(e);
    setSelectedMatNo(e);
    setOrderTableData([,]);
  };

  const handleLinkTabDataClear = (e) => {
    setCoilFilter({
      batchId: "",
      parentBatch: "",
      motherBatch: "",
      odia: "",
      thick: "",
    });
    setBatchTable(null);
    setBatchTableData([]);
  };

  const handleDLinkTabDataClear = (e) => {
    setCoilFilter2({
      batchId: "",
      parentBatch: "",
      motherBatch: "",
      odia: "",
      thick: "",
    });
    setDlinkTable(null);
    setDlinkTableData([]);
  };

  const parseBatchIds = (input) => {
    if (!input) return [];

    return input
      .split(/[\s,]+/) // split by space/comma/newline
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  };

  const getCoilDataLinkDlink = (clearFilter = false) => {
    console.log("tabValue: ", tabValue);
    let batchIdArray;
    if (tabValue === 0) {
      batchIdArray = parseBatchIds(coilFilter.batchId);
    } else {
      batchIdArray = parseBatchIds(coilFilter2.batchId);
    }
    console.log("batchIdArray: ", batchIdArray);
    var data = {
      coilIds: clearFilter ? [] : batchIdArray,
      parentBatch: coilFilter.parentBatch ?? "",
      motherBatch: coilFilter.motherBatch ?? "",
      odia: coilFilter.odia ?? "",
      thick: coilFilter.thick ?? "",
      type: tabValue == 0 ? "LINK" : tabValue == 1 ? "DELINK" : "",
      param: "GetCoil",
    };

    // return new Promise((resolve) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD01S005/getList";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          console.log(response);
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error("Error!");
            return;
          } else {
            console.log("response?.data: ", response?.data);
            if (response?.data?.length == 0) {
              alertify.error("No Data Found!");
              if (tabValue === 0) {
                setBatchTableData([,]);
                setLoading(false);
              } else {
                setDlinkTableData([,]);
                setLoading(false);
              }

              return;
            } else {
              if (tabValue === 0) {
                setBatchTableData(response.data);
                setLoading(false);
              } else {
                setDlinkTableData(response.data);
                setLoading(false);
              }
            }
          }
        })
        .finally((f) => {
          setLoading(false);
          // resolve();
        });
    });
    // });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Planning & Scheduling"
        page="FG Linking/De-Linking"
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
          <MDBox pt={6} pb={3} py={7}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab label="Linking" icon={<Today />} />
                    <Tab label="De-Linking" icon={<Today />} />
                    {/* <Tab label="Schedule Display/Rejection" icon={<Today />} /> */}
                  </Tabs>
                </AppBar>
              </Grid>
            </Grid>
          </MDBox>
          {tabValue == 0 && (
            <MDBox pt={6} pb={3} py={1}>
              <Grid container spacing={4}>
                <Grid item xs={tabValue == 0 ? 6 : 12}>
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-3}
                      py={0.25}
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
                            Batch Filters
                          </MDTypography>
                        </Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Get Batches">
                            <IconButton
                              color="white"
                              onClick={() => getCoilDataLinkDlink("")}

                              // onClick={() => fetchTableData("GetCoil")}
                              // onClick={() => getBatchData()}
                            >
                              <ManageSearchIcon />
                            </IconButton>
                          </Tooltip>
                          {/* {tabValue === 1 && (
                            <Tooltip title="Delink">
                              <IconButton
                                color="white"
                                onClick={() => fetchTableData("UpdateCoil")}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                          )} */}
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={1}>
                      <Grid item xs={12}>
                        <Grid container spacing={1}>
                          {/* <Grid item xs={2.5} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Plant <span style={{ color: "red" }}>*</span>
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={plant}
                            value={selectedPlant}
                            onChange={handlePlantChange}
                          />
                        </Grid> */}
                          <Grid item xs={3}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Batch Ids (Multi)
                            </MDTypography>

                            <MDInput
                              id="batchId"
                              multiline
                              // rows={2}
                              minRows={3}
                              maxRows={10}
                              placeholder="Paste batch IDs (comma, space or newline separated)"
                              value={coilFilter.batchId}
                              sx={{
                                width: "100%",
                                "& textarea": {
                                  resize: "both",
                                  overflow: "auto",
                                },
                              }}
                              onChange={(e) => {
                                setCoilFilter({
                                  ...coilFilter,
                                  batchId: e.target.value.toUpperCase(),
                                });
                                setBatchTable(null);
                                setBatchTableData([]);
                              }}
                            />
                          </Grid>

                          {/* <Grid item xs={2.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Batch Id
                            </MDTypography>
                            <MDInput
                              id="batchId"
                              value={coilFilter.batchId}
                              onChange={(e) => {
                                setCoilFilter({
                                  ...coilFilter,
                                  batchId: e.target.value
                                    .toUpperCase()
                                    .slice(0, 10),
                                });
                                setBatchTable(null);
                                setBatchTableData([]);
                              }}
                            />
                          </Grid> */}
                          <Grid item xs={2.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Parent Batch Id
                            </MDTypography>
                            <MDInput
                              id="parentBatch"
                              value={coilFilter.parentBatch}
                              onChange={(e) => {
                                setCoilFilter({
                                  ...coilFilter,
                                  parentBatch: e.target.value
                                    .toUpperCase()
                                    .slice(0, 10),
                                });
                                setBatchTable(null);
                                setBatchTableData([]);
                              }}
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
                              Mother Batch Id
                            </MDTypography>
                            <MDInput
                              id="motherBatch"
                              value={coilFilter.motherBatch}
                              onChange={(e) => {
                                setCoilFilter({
                                  ...coilFilter,
                                  motherBatch: e.target.value
                                    .toUpperCase()
                                    .slice(0, 10),
                                });
                                setBatchTable(null);
                                setBatchTableData([]);
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
                              Odia
                            </MDTypography>
                            <MDInput
                              id="odia"
                              value={coilFilter.odia}
                              onChange={(e) => {
                                setCoilFilter({
                                  ...coilFilter,
                                  odia: e.target.value
                                    .toUpperCase()
                                    .slice(0, 10),
                                });
                                setBatchTable(null);
                                setBatchTableData([]);
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
                              Thik
                            </MDTypography>
                            <MDInput
                              id="thick"
                              value={coilFilter.thick}
                              onChange={(e) => {
                                setCoilFilter({
                                  ...coilFilter,
                                  thick: e.target.value
                                    .toUpperCase()
                                    .slice(0, 10),
                                });
                                setBatchTable(null);
                                setBatchTableData([]);
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
                {/* Order Grid link tab */}
                {tabValue == 0 && (
                  <Grid item xs={6}>
                    <Card>
                      <MDBox
                        mx={2}
                        mt={-3}
                        py={0.25}
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
                          <Grid item xs={2} py={0.9}>
                            <MDTypography variant="h6" color="white">
                              Order Filters
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </MDBox>

                      <MDBox px={3} py={1}>
                        <Grid item xs={12}>
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
                                Order Id
                              </MDTypography>
                              <MDInput
                                id="orderId"
                                value={orderFilter.orderId}
                                onChange={(e) => {
                                  setOrderFilter({
                                    ...orderFilter,
                                    orderId: e.target.value.toUpperCase(),
                                  });
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
                                Item
                              </MDTypography>
                              <MDInput
                                id="item"
                                value={orderFilter.itemId}
                                onChange={(e) => {
                                  setOrderFilter({
                                    ...orderFilter,
                                    itemId: e.target.value.toUpperCase(),
                                  });
                                }}
                              />
                            </Grid>
                            <Grid item xs={5.2}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                noWrap
                              >
                                Material No
                              </MDTypography>
                              <ReactSelect
                                id="Section"
                                options={matNo}
                                value={selectedMatNo}
                                onChange={(e) => {
                                  handleMatNoChange(e);
                                }}
                              />
                              {/* <MDInput
                                id="matNo"
                                value={matNo}
                                onChange={(e) => {
                                  setMatNo(e.target.value.toUpperCase());
                                }}
                              /> */}
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
                                Thk Min
                              </MDTypography>
                              <MDInput
                                id="thk_min"
                                value={orderFilter.thkFrom}
                                onChange={(e) => {
                                  setOrderFilter({
                                    ...orderFilter,
                                    thkFrom: e.target.value.toUpperCase(),
                                  });
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
                                Thk Max
                              </MDTypography>
                              <MDInput
                                id="thk_to"
                                value={orderFilter.thkTo}
                                onChange={(e) => {
                                  setOrderFilter({
                                    ...orderFilter,
                                    thkTo: e.target.value.toUpperCase(),
                                  });
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
                                Odia Min
                              </MDTypography>
                              <MDInput
                                id="odia_min"
                                value={orderFilter.odiaFrom}
                                onChange={(e) => {
                                  setOrderFilter({
                                    ...orderFilter,
                                    odiaFrom: e.target.value.toUpperCase(),
                                  });
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
                                Odia Max
                              </MDTypography>
                              <MDInput
                                id="odia_max"
                                value={orderFilter.odiaTo}
                                onChange={(e) => {
                                  setOrderFilter({
                                    ...orderFilter,
                                    odiaTo: e.target.value.toUpperCase(),
                                  });
                                }}
                              />
                            </Grid> */}
                            <Grid item xs={3} style={{ zIndex: 5 }}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                noWrap
                              >
                                Section
                              </MDTypography>
                              <ReactSelect
                                id="Section"
                                options={[
                                  {
                                    value: "O",
                                    label: "Round",
                                  },
                                  {
                                    value: "S,R",
                                    label: "Section",
                                  },
                                ]}
                                value={orderFilter.section}
                                onChange={(e) => {
                                  console.log(e);
                                  setOrderFilter({
                                    ...orderFilter,
                                    section: e,
                                  });
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </Grid>
                )}

                <Grid item xs={6}>
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-3}
                      py={0.25}
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
                            Batch Details
                          </MDTypography>
                        </Grid>
                        {/* {tabValue === 0 && ( */}
                        <Grid item xs={2}>
                          <Tooltip title="Get Fitting Ord">
                            <IconButton
                              color="white"
                              onClick={() => {
                                handleFittingOrdBtn();
                              }}
                            >
                              <SendAndArchiveIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        {/* )} */}
                      </Grid>
                    </MDBox>
                    <MDBox px={3} py={1}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          {batchTableData?.length > 0 && (
                            <>
                              <div id="batchTable" />
                              <p>Showing 1 to {batchTableData?.length} rows</p>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
                {tabValue == 0 && (
                  <Grid item xs={6}>
                    <Card>
                      <MDBox
                        mx={2}
                        mt={-3}
                        py={0.25}
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
                          <Grid item xs={2} py={0.9}>
                            <MDTypography variant="h6" color="white">
                              Order Details
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            {/* <Tooltip title="Pass">
                          <IconButton
                            color="white"
                            disabled={isReadWriteAccess}
                            onClick={() => saveData(true)}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip> */}
                            {/* <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadTableExcel()}
                          >
                            <DownloadForOfflineIcon />
                          </IconButton>
                        </Tooltip> */}
                          </Grid>
                        </Grid>
                      </MDBox>
                      <MDBox px={3} py={1}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            {orderTableData?.length > 0 && (
                              <div id="orderTable" />
                            )}
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </Grid>
                )}
              </Grid>
              <BootstrapDialog
                onClose={() => {
                  setOpen(false);
                  setSelectedOrderVal("");
                  setSelectedItemVal("");
                  setSelectedBatchVal("");
                }}
                aria-labelledby="customized-dialog-title"
                open={open}
              >
                <BootstrapDialogTitle
                  id="customized-dialog-title"
                  onClose={() => {
                    setOpen(false);
                    setSelectedOrderVal("");
                    setSelectedItemVal("");
                    setSelectedBatchVal("");
                  }}
                ></BootstrapDialogTitle>
                <DialogContent>
                  <p style={{ padding: "10px 40px" }}>
                    Do you want link order: {selectedOrderVal}/{selectedItemVal}{" "}
                    {/* from batch: {selectedBatchVal} */}?
                  </p>
                </DialogContent>
                <DialogActions>
                  <Button
                    autoFocus
                    onClick={() => fetchTableData("UpdateCoil")}
                  >
                    link
                  </Button>
                  <Button
                    autoFocus
                    onClick={() => {
                      setOpen(false);
                      setSelectedOrderVal("");
                      setSelectedItemVal("");
                      setSelectedBatchVal("");
                    }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </BootstrapDialog>
            </MDBox>
          )}

          {tabValue == 1 && (
            <MDBox pt={6} pb={3} py={1}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-3}
                      py={0.25}
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
                            Batch Filters
                          </MDTypography>
                        </Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Get Batches">
                            <IconButton
                              color="white"
                              onClick={() => getCoilDataLinkDlink("")}
                              // onClick={() => fetchTableData("GetCoilDlink")}
                            >
                              <ManageSearchIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delink">
                            <IconButton
                              color="white"
                              onClick={() => fetchTableData("UpdateCoil")}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={1}>
                      <Grid item xs={12}>
                        <Grid container spacing={1}>
                          <Grid item xs={3}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Batch Ids (Multi)
                            </MDTypography>
                            <MDInput
                              id="batchId"
                              multiline
                              minRows={3}
                              maxRows={10}
                              sx={{
                                width: "100%", // full width of container
                                "& textarea": {
                                  resize: "both", // ✅ BOTH directions enabled
                                  overflow: "auto",
                                },
                              }}
                              placeholder="Paste batch IDs (comma, space or newline separated)"
                              value={coilFilter2.batchId}
                              onChange={(e) => {
                                setCoilFilter2({
                                  ...coilFilter2,
                                  batchId: e.target.value.toUpperCase(),
                                });
                                setDlinkTable(null);
                                setDlinkTableData([]);
                              }}
                            />
                          </Grid>
                          {/* <Grid item xs={2.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Batch Id
                            </MDTypography>
                            <MDInput
                              id="batchId"
                              value={coilFilter2.batchId}
                              onChange={(e) => {
                                setCoilFilter2({
                                  ...coilFilter2,
                                  batchId: e.target.value
                                    .toUpperCase()
                                    .slice(0, 10),
                                });
                                setDlinkTable(null);
                                setDlinkTableData([]);
                              }}
                            />
                          </Grid> */}
                          <Grid item xs={2.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Parent Batch Id
                            </MDTypography>
                            <MDInput
                              id="parentBatch"
                              value={coilFilter2.parentBatch}
                              onChange={(e) => {
                                setCoilFilter2({
                                  ...coilFilter2,
                                  parentBatch: e.target.value
                                    .toUpperCase()
                                    .slice(0, 10),
                                });
                                setDlinkTable(null);
                                setDlinkTableData([]);
                              }}
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
                              Mother Batch Id
                            </MDTypography>
                            <MDInput
                              id="motherBatch"
                              value={coilFilter2.motherBatch}
                              onChange={(e) => {
                                setCoilFilter2({
                                  ...coilFilter2,
                                  motherBatch: e.target.value
                                    .toUpperCase()
                                    .slice(0, 10),
                                });
                                setDlinkTable(null);
                                setDlinkTableData([]);
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
                              Odia
                            </MDTypography>
                            <MDInput
                              id="odia"
                              value={coilFilter2.odia}
                              onChange={(e) => {
                                setCoilFilter2({
                                  ...coilFilter2,
                                  odia: e.target.value
                                    .toUpperCase()
                                    .slice(0, 10),
                                });
                                setDlinkTable(null);
                                setDlinkTableData([]);
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
                              Thick
                            </MDTypography>
                            <MDInput
                              id="thick"
                              value={coilFilter2.thick}
                              onChange={(e) => {
                                setCoilFilter2({
                                  ...coilFilter2,
                                  thick: e.target.value
                                    .toUpperCase()
                                    .slice(0, 10),
                                });
                                setDlinkTable(null);
                                setDlinkTableData([]);
                              }}
                            />
                          </Grid>
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
                            Batch Details
                          </MDTypography>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox px={3} py={1}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          {dlinkTableData?.length > 0 && (
                            <>
                              <div id="dlinkTable" />
                              <p>Showing 1 to {dlinkTableData?.length} rows</p>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
              </Grid>
            </MDBox>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
