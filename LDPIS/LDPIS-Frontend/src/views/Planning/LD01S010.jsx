import React, { useEffect, useState, useRef } from "react"; // CRITICAL CHANGE: Import useRef
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
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
import IconButton from "@mui/material/IconButton";
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
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SaveIcon from "@mui/icons-material/Save";
import ReactSelect from "components/Select/ReactSelect";
import MDButton from "components/MDButton";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

export default function LD01S010() {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  // Renamed dlinkTable to coilTable and dlinkTableData to coilTableData
  const [coilTable, setCoilTable] = useState(null);
  const [coilTableData, setCoilTableData] = useState([]);
  console.log("Current coilTableData state:", coilTableData); // Add this line

  // Removed coilTable1 state as it's no longer used for a separate table on the main page
  // const [coilTable1, setCoilTable1] = useState(null);
  const [coilTable1Data, setCoilTable1Data] = useState([]);

  // CRITICAL CHANGE 1: Add a useRef for the coilTable1 div
  const coilTable1Ref = useRef(null);
  const coilTable1Instance = useRef(null);

  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);

  const [openRMDialog, setOpenRMDialog] = useState(false);
  const [selectedOrderRow, setSelectedOrderRow] = useState(null);

  // Renamed coilFilter2 to coilFilter
  const [coilFilter, setCoilFilter] = useState({
    batchId: "",
    parentBatch: "",
    motherBatch: "",
    odia: "",
    thick: "",
  });

  // NEW STATE FOR TAB MANAGEMENT
  const [tabValue, setTabValue] = useState(0); // 0 for "Order Details", 1 for "New Tab"

  // NEW STATE FOR THE SECOND TABLE (from getRMtab)
  const [coilTable2, setCoilTable2] = useState(null);
  const [coilTable2Data, setCoilTable2Data] = useState([]);
  const coilTable2Ref = useRef(null); // Ref for the new table's div

  const handlePlantChange = (value) => {
    // handleClearAll();
    setSelectedPlant(value);
  };

  // Handler for tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //page load
  useEffect(() => {
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      GetAuthorization().then((token) => {
        validateUser(token);
        // No linking-specific page load functions needed
        Promise.all([
          getGroupPlantId(token?.accessToken),
          // GetreportTyp(token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
    fetchData();
  }, []);

const handleCloseRMDialog = () => {
  if (coilTable1Instance.current) {
    coilTable1Instance.current.destroy();
    coilTable1Instance.current = null;
  }

  setOpenRMDialog(false);
  setCoilTable1Data([]);
};

  const openRMDetails = async (rowData) => {
    console.log("2. openRMDetails called with rowData:", rowData); // Existing log//
    setSelectedOrderRow(rowData);
    await getRMData(rowData);
  };

  const getGroupPlantId = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
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
            resolve();
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
            // Promise.all([GetreportTyp(items[0], accessToken)]).finally(() => {
            //   resolve();
            // });
          }
        })
        .catch((f) => {
          resolve();
        });
    });
  };

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
      var pageName = "LD01S010";

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
          console.log("authDetails.payload.LS_READ_WRITE_FLAG",authDetails.payload.LS_READ_WRITE_FLAG)
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

  useEffect(() => {
    if (!coilTableData?.length) {
      console.log("coilTableData is empty, Tabulator not initialized.");
      // Destroy existing table if it was initialized with data and now data is empty
      if (coilTable) {
        coilTable.destroy();
        setCoilTable(null);
      }
      return;
    }

    // Destroy existing Tabulator instance if it exists to prevent re-initialization issues
    const element = document.getElementById("coilTable");
    if (element && element.tabulator) {
      console.log("Destroying existing coilTable instance.");
      element.tabulator.destroy();
    }

    const table = new Tabulator("#coilTable", {
      data: coilTableData,
      columns: coilTableCol,
      height: 380,
      layout: "fitDataFill",
      selectable: 1,
      rowClick: (e, row) => {
        const rowData = row.getData();

        alertify.success("Clicked");

        console.log("1. Row clicked! Row Data:", rowData);

        openRMDetails(rowData);
      },
    });

    setCoilTable(table);

    return () => {
      if (table) {
        table?.destroy();
      }
    };
  }, [coilTableData]);

  useEffect(() => {
  if (!openRMDialog) return;

  const timer = setTimeout(() => {
    const element = coilTable1Ref.current;

    if (!element) {
      console.log("coilTable1 element not found");
      return;
    }

    if (!coilTable1Data || coilTable1Data.length === 0) {
      console.log("No RM data available");
      return;
    }

    // destroy previous instance
    if (coilTable1Instance.current) {
      coilTable1Instance.current.destroy();
      coilTable1Instance.current = null;
    }

    console.log("Initializing RM Detail Tabulator");

    coilTable1Instance.current = new Tabulator(element, {
      data: coilTable1Data,
      columns: coilTable1Col,
      height: 400,
      // layout: "fitColumns",
    });
  }, 200);

  return () => {
    clearTimeout(timer);
  };
}, [openRMDialog, coilTable1Data]);

  // NEW useEffect for coilTable2 (the new tab's table)
  useEffect(() => {
    const element = coilTable2Ref.current;

    // Only initialize if the tab is active (tabValue === 1), data exists, and the DOM element is available
    if (tabValue !== 1 || !coilTable2Data?.length || !element) {
      console.log(
        "coilTable2 UEE: Conditions not met for initialization.",
        {
          tabValue,
          dataLength: coilTable2Data?.length,
          elementExists: !!element,
        }
      );
      // Destroy existing table if it was initialized with data and now data is empty or tab is not active
      if (element && element.tabulator) {
        element.tabulator.destroy();
      }
      return;
    }

    console.log("coilTable2 UEE: Initializing Tabulator for coilTable2.");

    // Destroy existing Tabulator instance if it exists to prevent re-initialization issues
    if (element.tabulator) {
      console.log("coilTable2 UEE: Destroying existing Tabulator instance.");
      element.tabulator.destroy();
    }

    const table = new Tabulator(element, {
      data: coilTable2Data,
      columns: coilTable2Col, // Uses the column definition for the new tab's table
      height: 380,
      // layout: "fitDataFill",
    });

    setCoilTable2(table);

    return () => {
      console.log("coilTable2 UEE cleanup: Destroying Tabulator instance.");
      if (element && element.tabulator) {
        element.tabulator.destroy();
      }
    };
  }, [tabValue, coilTable2Data]); // Re-run when tabValue or coilTable2Data changes

  const fetchTableData = (type) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      // Only call getCoilData for the De-Linking (UpdateCoil) operation
      Promise.all([getCoilData(token?.accessToken, type)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getCoilData = (accessToken, type) => {
    setLoading(true);
    let varCoilId = [];

    // Only consider the De-Linking tab's selected rows
    if (type.includes("Update")) {
      if (!coilTable) {
        alertify.error("Please Click Get Batches");
        return;
      }
      var selectedRows = coilTable.getSelectedRows();
      if (selectedRows.length === 0) {
        alertify.error("Please select rows");
        return;
      }
      selectedRows.forEach(function (item) {
        varCoilId.push(item._row.data.BATCH1);
      });
    }

    return new Promise((resolve) => {
      var data = {
        plant: selectedPlant?.value || "", // Added plant filter
        coilId: coilFilter.batchId ?? "", // Use the new coilFilter
        delinkCoils: varCoilId,
        orderId: "", // Not relevant for De-Linking
        selectedBatch: "", // Not relevant for De-Linking
        selectedItem: "", // Not relevant for De-Linking
        selectedOrder: "", // Not relevant for De-Linking
        parentBatch: coilFilter.parentBatch ?? "",
        motherBatch: coilFilter.motherBatch ?? "",
        odia: coilFilter.odia ?? "",
        thick: coilFilter.thick ?? "",
        itemId: "", // Not relevant for De-Linking
        thkFrom: "", // Not relevant for De-Linking
        thkTo: "", // Not relevant for De-Linking
        odiaFrom: "", // Not relevant for De-Linking
        odiaTo: "", // Not relevant for De-Linking
        section: "", // Not relevant for De-Linking
        type: "DELINK", // Always "DELINK"
        param: type === "GetCoilDlink" ? "GetCoil" : type, // Simplified param logic
        matNo: "", // Not relevant for De-Linking
      };

      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LD01S010/getList";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          console.log(response);
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error("Error!");
            return;
          } else {
            console.log("response?.data: ", response?.data);
            if (response?.data?.length === 0) {
              alertify.error("No Data Found!");
              setCoilTableData([]); // Update the renamed state
              setLoading(false);
              return;
            } else {
              setCoilTableData(response.data); // Update the renamed state
              setLoading(false);
            }
          }
        })
        .finally(async (f) => {
          setLoading(false);
          // Clear only relevant states
          if (type.includes("Update")) {
            handleCoilTabDataClear(); // Call the renamed clear function
            // getCoilDataLinkDlink(true); // Refresh data -- This line was commented out in the original, keeping it commented.
          }
          resolve();
        });
    });
  };

  // Renamed batchTableColDlink to coilTableCol
  const coilTableCol = [
    {
      formatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    {
      title: "Order Id",
      field: "COS_ID_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "COS_NO_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // hozAlign: "centre",
    },
    {
      title: "TDC",
      field: "COS_NO_TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // hozAlign: "centre",
    },
    {
      title: "Ord Qty (TON)",
      field: "COS_ORD_QUANTITY",
      hozAlign: "right",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
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
      title: "Current BTR Qty (TON)",
      field: "COS_BTR",
      hozAlign: "right",
            bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
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
      title: "Proposed Linked RM(TON)",
      field: "COS_ORD_QTY_RESERVE",
      hozAlign: "right",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
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
      title: "Propossed BTR Qty (TON)",
      field: "PROPOSED_BTR",
      hozAlign: "right",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
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
      field: "COS_SEC1_MIN",
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
      title: "Odia",
      field: "COS_SEC1_MAX",
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
      title: "Length",
      field: "COS_LENGTH_MAX",
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
      title: "TDC",
      field: "COS_NO_TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // hozAlign: "centre",
    },
    {
      title: "Material No.",
      field: "COS_NO_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Last Refresh Date",
      field: "COS_CREATE_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  // 1.FRONTEND - Modify coilTable1Col
  const coilTable1Col = [
    {
      title: "RM Batch",
      field: "ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt (TON)",
      field: "QTY", // Assuming this is derived or another field, if not, adjust
      hozAlign: "right",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
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
      field: "RMF_SEC1",
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
      title: "Odia",
      field: "RMF_SEC2",
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
      title: "RM Odia Used",
      field: "SECTION2_USED",
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
      title: "TDC",
      field: "RMF_TDC_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No.",
      field: "MATERIAL_NUMBER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    // {
    //   title: "Qty (TON)",
    //   field: "QTY", // Changed to match alias in SQL
    //   hozAlign: "right",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return parseFloat(value).toFixed(3);
    //     }
    //     return value;
    //   },
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },

    {
      title: "Linked Order",
      field: "LINKED_ORDER_ID", // Changed to match alias in SQL
      headerFilter: "input",
            hozAlign: "right",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "Item",
      field: "LINKED_ITEM_NO", // Changed to match alias in SQL//
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
            hozAlign: "right",
    },

    {
      title: "Used Qty (TON)",
      field: "WEIGHT_USED_TOTAL",
      hozAlign: "right",
            bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
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
      title: "Last Refresh Date",
      field: "RMF_CREATE_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  // NEW: Column definitions for the new tab's table (getRMtab)
  const coilTable2Col = [
    {
      title: "Plant",
      field: "RMF_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch ID",
      field: "RMF_ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cast No",
      field: "RMF_CAST_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No",
      field: "RMF_NO_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod CD",
      field: "RMF_CD_PROD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "RMF_CD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Quality Actl Code", // Added
    //   field: "RMF_CD_QLTY_ACTL",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "QTY (TON)",
      field: "RMF_MS_PIECE_ACTL",
      hozAlign: "right",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
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
      title: "Thickness",
      field: "RMF_SEC1",
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
      title: "Width",
      field: "RMF_SEC2",
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
      title: "Length", // Added////
      field: "RMF_LENGTH",
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
      title: "TDC",
      field: "RMF_TDC_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Description", // Added
      field: "RMF_MATNR_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Age In Days", // Added
      field: "RMF_AGE_DAYS",
      headerFilter: "input",
      hozAlign: "right",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Creation Timestamp", // Added
    //   field: "RMF_TS_CREATION",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Gross Calculation", // Added
    //   field: "RMF_GROSS_CAL",
    //   hozAlign: "right",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return parseFloat(value).toFixed(3);
    //     }
    //     return value;
    //   },
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "Order ID 1", // Added
      field: "RMF_ID_ORDER_1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item No 1", // Added
      field: "RMF_NO_ITEM_1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order ID 2", // Added
      field: "RMF_ID_ORDER_2",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item No 2", // Added
      field: "RMF_NO_ITEM_2",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order ID 3", // Added
      field: "RMF_ID_ORDER_3",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item No 3", // Added
      field: "RMF_NO_ITEM_3",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order ID 4", // Added
      field: "RMF_ID_ORDER_4",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item No 4", // Added
      field: "RMF_NO_ITEM_4",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Weight Used Ord1", // Added
      field: "RMF_WT_USED_ORD1",
      hozAlign: "right",
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
      title: "Weight Used Ord2", // Added
      field: "RMF_WT_USED_ORD2",
      hozAlign: "right",
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
      title: "Weight Used Ord3", // Added
      field: "RMF_WT_USED_ORD3",
      hozAlign: "right",
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
      title: "Weight Used Ord4", // Added
      field: "RMF_WT_USED_ORD4",
      hozAlign: "right",
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
      title: "Total Weight Used", // Added
      field: "RMF_WT_USED_TOTAL",
      hozAlign: "right",
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
      title: "Section2 Used", // Added
      field: "RMF_SEC2_USED",
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
      title: "Slit No Ord1", // Added
      field: "RMF_NO_SLIT_ORD1",
      headerFilter: "input",
      hozAlign: "right",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Slit No Ord2", // Added
      field: "RMF_NO_SLIT_ORD2",
      headerFilter: "input",
      hozAlign: "right",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Slit No Ord3", // Added
      field: "RMF_NO_SLIT_ORD3",
      headerFilter: "input",
      hozAlign: "right",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Slit No Ord4", // Added
      field: "RMF_NO_SLIT_ORD4",
      headerFilter: "input",
      hozAlign: "right",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Last Refresh Date",
      field: "RMF_CREATE_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Create User", // Added
      field: "RMF_CREATE_USER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Updated On", // Added
      field: "RMF_UPDATED_ON",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Updated By", // Added
      field: "RMF_UPDATED_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const downloadTableExcel = () => {
    let tableToDownload = null;
    let dataToCheck = [];
    let fileNamePrefix = "";

    if (tabValue === 0) {
      tableToDownload = coilTable;
      dataToCheck = coilTableData;
      fileNamePrefix = "Order_Details";
    } else if (tabValue === 1) {
      tableToDownload = coilTable2;
      dataToCheck = coilTable2Data;
      fileNamePrefix = "RM_Details";
    } else {
      alertify.error("No active table to download.");
      return;
    }

    if (!tableToDownload || dataToCheck.length === 0) {
      alertify.error("No Data exists in the current table for Downloading");
      return;
    }

    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10); // YYYY-MM-DD
    const fileName = `${fileNamePrefix}_${formattedDate}.xlsx`;

    tableToDownload.download("xlsx", fileName, {
      sheetName: fileNamePrefix,
    });
  };

  const populateForecast = () => {
    console.log("populateForecast");
    setLoading(true);
    setCoilTableData([]);

    GetAuthorization().then((token) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      axiosAPI
        .post("api/LD01S010/populateForecast", {}, defaultOptions)
        .then((response) => {
          console.log(response);
          // console.log(response?.data?.success);
          if (response?.data?.success) {
            alertify.success(response.data.message);
            // CRITICAL CHANGE: Check if the message starts with 'Y'
            if (response.data.message && response.data.message.startsWith("Y")) {
              getCoilDataLinkDlink(); // Call getCoilDataLinkDlink if message starts with 'Y'
            }
          } else {
            alertify.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error(error);

          alertify.error("Error while populating forecast");
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const downloadRMTableExcel = () => {
  if (
    !coilTable1Instance.current ||
    !coilTable1Data ||
    coilTable1Data.length === 0
  ) {
    alertify.error("No RM Data available for download");
    return;
  }

  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10);

  const orderId = selectedOrderRow?.COS_ID_ORDER || "Order";
   const orderitem = selectedOrderRow?.COS_NO_ITEM || "Item";

  coilTable1Instance.current.download(
    "xlsx",
    `RM_Batch_Details_${orderId}/${orderitem}_${formattedDate}.xlsx`,
    {
      sheetName: "RM Batch Details",
    }
  );
};

  // Renamed handleDLinkTabDataClear to handleCoilTabDataClear
  const handleCoilTabDataClear = (e) => {
    setCoilFilter({
      batchId: "",
      parentBatch: "",
      motherBatch: "",
      odia: "",
      thick: "",
    });
    setCoilTable(null);
    setCoilTableData([]);
  };

  const parseBatchIds = (input) => {
    if (!input) return [];

    return input
      .split(/[\s,]+/) // split by space/comma/newline
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  };

  const getCoilDataLinkDlink = (clearFilter = false) => {
    let batchIdArray = parseBatchIds(coilFilter.batchId); // Use the new coilFilter

    var data = {
      plant: selectedPlant?.value || "", // Added plant filter
      coilIds: clearFilter ? [] : batchIdArray,
      parentBatch: coilFilter.parentBatch ?? "",
      motherBatch: coilFilter.motherBatch ?? "",
      odia: coilFilter.odia ?? "",
      thick: coilFilter.thick ?? "",
      type: "DELINK", // Always "DELINK"
      param: "GetCoil",
    };

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD01S010/getList";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          console.log(response);
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error("Error!");
            return;
          } else {
            console.log("response?.data: ", response?.data);
            if (response?.data?.length === 0) {
              alertify.error("No Data Found!");
              setCoilTableData([]); // Update the renamed state
              setLoading(false);
              return;
            } else {
              setCoilTableData(response.data); // Update the renamed state
              setLoading(false);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  // NEW: Function to fetch data for the new tab (getRMtab)
  const getCoilDataList11 = async () => {
    setLoading(true);
    setCoilTable2Data([]); // Clear previous data
    try {
      const token = await GetAuthorization();
      const data = {
        plant: selectedPlant?.value || "0780", // Example: use selected plant
        // Add any other filters or parameters required by getRMtab API
        // For now, assuming it might take similar plant parameter
      };
      console.log("Sending data to getRMtab API:", data);
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      const response = await axiosAPI.post(
        "api/LD01S010/getRMtab", // New API endpoint
        data,
        defaultOptions
      );
      console.log("getRMtab API response:", response);

      if (response?.data?.length > 0) {
        setCoilTable2Data(response.data);
        alertify.success("Data loaded successfully for New Tab!");
      } else {
        setCoilTable2Data([]);
        alertify.error("No Data Found");
      }
    } catch (error) {
      console.error("Error fetching data for New Tab:", error);
      alertify.error("Failed to fetch data for New Tab");
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch data for coilTable1 from api/LD01S010/getRM
  const getRMData = async (rowData) => {
    // console.log()
    setLoading(true);
    try {
      const token = await GetAuthorization();
      const data = {
        plant: selectedPlant?.value || "0780",
        orderId: rowData.COS_ID_ORDER,
        itemId: rowData.COS_NO_ITEM,
        // tdc: rowData.COS_NO_TDC,
      };
      console.log("Sending data to getRM API:", data); // Add this
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      console.log("3. Sending data to getRM API:", data); // Existing log
      const response = await axiosAPI.post(
        "api/LD01S010/getRM",
        data,
        defaultOptions
      );
      console.log("getRM API response:", response); // Add this

      if (response?.data?.length > 0) {
        setCoilTable1Data(response.data);
        setOpenRMDialog(true); // Dialog opens here
        console.log("RM Dialog should be open now."); // Add this
      } else {
        setCoilTable1Data([]);
        alertify.error("No RM Data Found");
        console.log("No RM Data Found, dialog not opened."); // Add this
      }
    } catch (error) {
      console.error("Error fetching RM details:", error); // Add this
      alertify.error("Failed to fetch RM details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Planning & Scheduling"
        page="RM Linking"
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
      {isRestricted === false && (
        <>
          <MDBox pt={6} pb={3} py={9.5}>
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
                          Filters
                        </MDTypography>
                      </Grid>
                      <Grid item xs={1}></Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={1}>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={2} style={{ zIndex: 3 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"red"}
                            noWrap
                          >
                            {" "}
                            Plant <span style={{ color: "red" }}>*</span>
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={plant}
                            value={selectedPlant}
                            onChange={handlePlantChange}
                          />
                        </Grid>

                        <Grid item xs={2}>
                          <MDButton
                            style={{ marginTop: "1.5rem",marginLeft: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={populateForecast}
                            disabled = {isReadWriteAccess}
                          >
                            Populate Forecast
                          </MDButton>
                        </Grid>

                        {/* Moved the "View" button to be specific to the active tab */}
                        {tabValue === 0 && (
                          <Grid item xs={2}>
                            <MDButton
                              style={{ marginTop: "1.5rem" }}
                              size="small"
                              color="info"
                              onClick={() => getCoilDataLinkDlink("")}
                            >
                              View Order Details
                            </MDButton>
                          </Grid>
                        )}
                        {tabValue === 1 && (
                          <Grid item xs={2}>
                            <MDButton
                              style={{ marginTop: "1.5rem" }}
                              size="small"
                              color="info"
                              onClick={getCoilDataList11}
                            >
                              View RM Details
                            </MDButton>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>

              {/* NEW: Tab Navigation */}
              <Grid item xs={12}>
                <AppBar position="static">
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                  >
                    <Tab label="Order Details" />
                    <Tab label="RM Details" /> {/* New Tab */}
                  </Tabs>
                </AppBar>
              </Grid>

              {/* Conditional rendering based on tabValue */}
              {tabValue === 0 && (
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
                        <Grid item xs={10}>
                          <MDTypography variant="h6" color="white">
                            Order Details
                          </MDTypography>
                        </Grid>
                         <Grid item xs={0.25}>
                        <Tooltip title="Rm View">
                          <IconButton
                            color="white"
                            onClick={() => {
                              if (!coilTable) {
                                alertify.error(
                                  "Please load Order Details first"
                                );
                                return;
                              }

                              const selectedRows = coilTable.getSelectedRows();

                              if (selectedRows.length === 0) {
                                alertify.error("Please select an Order");
                                return;
                              }

                              const rowData = selectedRows[0].getData();

                              setSelectedOrderRow(rowData);
                              getRMData(rowData);
                            }}
                          >
                            <ManageSearchIcon />
                          </IconButton>
                        </Tooltip>
                        </Grid>
 <Grid item xs={0.25}>
                                                <Tooltip title="Download">
                                                  <IconButton
                                                    color="white"
                                                    onClick={() => downloadTableExcel()}
                                                  >
                                                    <DownloadForOfflineIcon />
                                                  </IconButton>
                                                </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox px={3} py={1}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          {coilTableData?.length > 0 && ( // Use the new coilTableData
                            <>
                              <div id="coilTable" />
                              <p>Showing 1 to {coilTableData?.length} rows</p>
                            </>
                          )}
                          {coilTableData?.length === 0 && !loading && (
                            <MDTypography
                              variant="body2"
                              color="text"
                              sx={{ mt: 2, textAlign: "center" }}
                            >
                            </MDTypography>
                          )}
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
              )}

              {/* NEW: Content for the new tab */}
              {tabValue === 1 && (
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
                        <Grid item xs={10}>
                          <MDTypography variant="h6" color="white">
                            RM details
                          </MDTypography>
                        </Grid>
                        {/* Download button for RM Details tab */}
                        <Grid item xs={0.25}>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadTableExcel()}
                            >
                              <DownloadForOfflineIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox px={3} py={1}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          {coilTable2Data?.length > 0 && (
                            <>
                              <div ref={coilTable2Ref}></div>{" "}
                              {/* Attach ref here */}
                              <p>Showing 1 to {coilTable2Data?.length} rows</p>
                            </>
                          )}
                          {coilTable2Data?.length === 0 && !loading && (
                            <MDTypography
                              variant="body2"
                              color="text"
                              sx={{ mt: 2, textAlign: "center" }}
                            >
                            </MDTypography>
                          )}
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
              )}
            </Grid>
          </MDBox>
        </>
      )}
<Dialog
  open={openRMDialog}
  onClose={handleCloseRMDialog}
  maxWidth="xl"
  fullWidth
  keepMounted
>
        <BootstrapDialogTitle onClose={handleCloseRMDialog}></BootstrapDialogTitle>

        <MDBox p={2}>
          {selectedOrderRow && (
            <MDBox mb={3} px={2}> {/* Added mb for vertical spacing and px for horizontal alignment */}
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  {/* <MDTypography variant="body1" fontWeight="bold">Order: {selectedOrderRow?.COS_ID_ORDER}</MDTypography> */}
                  {/* <MDTypography variant="body1">{selectedOrderRow?.COS_ID_ORDER}</MDTypography> */}
                </Grid>

                <Grid item xs={4}>
                  {/* <MDTypography variant="body1" fontWeight="bold">Item: {selectedOrderRow?.COS_NO_ITEM}</MDTypography> */}
                  {/* <MDTypography variant="body1">{selectedOrderRow?.COS_NO_ITEM}</MDTypography> */}
                </Grid>

                <Grid item xs={1}>
                  {/* <MDTypography variant="body1" fontWeight="bold">TDC: {selectedOrderRow?.COS_NO_TDC}</MDTypography> */}
                  {/* <MDTypography variant="body1">{selectedOrderRow?.COS_NO_TDC}</MDTypography> */}
                </Grid>
              </Grid>
            </MDBox>
          )}

          {/* RM Batch Details header - CRITICAL FIX: Removed mt={-3} to prevent overlap */}
          <MDBox
            mx={2} // Keeps horizontal margin consistent with other MDBox headers
            mt={0} // Removed negative margin. Vertical spacing is now handled by mb on the element above.
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
  <Grid item xs={4}>
    <MDTypography variant="h6" color="white">
      RM Batch Details
    </MDTypography>
  </Grid>

  <Grid item xs={3}>
    <MDTypography
      variant="body1"
      color="white"
      fontWeight="bold"
    >
      Order: {selectedOrderRow?.COS_ID_ORDER} /{" "}
      {selectedOrderRow?.COS_NO_ITEM}
    </MDTypography>
  </Grid>

  {/* Download Button */}
  <Grid item xs={1}>
    <Tooltip title="Download">
      <IconButton
        color="white"
        onClick={downloadRMTableExcel}
      >
        <DownloadForOfflineIcon />
      </IconButton>
    </Tooltip>
  </Grid>
</Grid>
          </MDBox>

          {/* CRITICAL CHANGE 3: Attach the ref to the div */}
          <MDBox mt={2} px={2}> {/* Added mt for vertical spacing and px for horizontal alignment of the table */}
            <div
  id="coilTable1"
  ref={coilTable1Ref}
  style={{
    // minHeight: "400px",
    // width: "100%",
  }}
></div>
          </MDBox>

          {coilTable1Data?.length > 0 && (
            <MDTypography variant="body2" sx={{ mt: 1, px: 2 }}> {/* Used MDTypography for consistency and added spacing/padding */}
              Showing 1 to {coilTable1Data?.length} rows
            </MDTypography>
          )}
        </MDBox>

      </Dialog>
    </DashboardLayout>
  );
}
