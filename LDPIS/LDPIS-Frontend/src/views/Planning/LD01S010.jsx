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

  const handlePlantChange = (value) => {
    // handleClearAll();
    setSelectedPlant(value);
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
          getGroupPlantId(token.accessToken),
          // GetreportTyp(token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
    fetchData();
  }, []);

  const handleCloseRMDialog = () => {
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
      return;
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
      table.destroy();
    };
  }, [coilTableData]);

  useEffect(() => {
    // CRITICAL CHA//NGE 2: Use the ref instead of document.getElementById
    const element = coilTable1Ref.current;

    // Ensure dialog is open, data exists, and the DOM element is available
    if (!openRMDialog || !coilTable1Data?.length || !element) {
      console.log("coilTable1 UEE: Conditions not met for initialization.", { openRMDialog, dataLength: coilTable1Data?.length, elementExists: !!element });
      return;
    }

    console.log("coilTable1 UEE: Initializing Tabulator for coilTable1.");

    // Destroy existing Tabulator instance if it exists to prevent re-initialization issues
    if (element.tabulator) {
      console.log("coilTable1 UEE: Destroying existing Tabulator instance.");
      element.tabulator.destroy();
    }

    const table = new Tabulator(element, {
      data: coilTable1Data,
      columns: coilTable1Col, // Uses the column definition for the popup table
      height: 400,
      layout: "fitDataFill",
    });

    return () => {
      console.log("coilTable1 UEE cleanup: Destroying Tabulator instance.");
      if (element && element.tabulator) { // Ensure element exists before trying to destroy
        element.tabulator.destroy();
      }
    };
  }, [openRMDialog, coilTable1Data]);

  const fetchTableData = (type) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      // Only call getCoilData for the De-Linking (UpdateCoil) operation
      Promise.all([getCoilData(token.accessToken, type)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getCoilData = (accessToken, type) => {
    setLoading(true);
    let varCoilId = [];

    // Only consider the De-Linking tab\'s selected rows
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
      field: "COS_BTR",
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
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "Item",
      field: "LINKED_ITEM_NO", // Changed to match alias in SQL//
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Used Qty (TON)",
      field: "WEIGHT_USED_TOTAL",
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
      title: "Last Refresh Date",
      field: "RMF_CREATE_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const downloadTableExcel = () => {
    // Assuming 'coilTable' is the table to download
    if (coilTableData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "Pipe Decision" + ".xlsx";
    coilTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
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
          if (response.data.message && response.data.message.startsWith('Y')) {
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
          {/* This block previously rendered for tabValue == 1, now it's the only content */}
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
                      <Grid item xs={1}>
                        {/* <Tooltip title="Delink">
                          <IconButton
                            color="white"
                            onClick={() => fetchTableData("UpdateCoil")}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip> */}
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={1}>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        {/* <Grid item xs={3}>
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
                              width: "100%",
                              "& textarea": {
                                resize: "both",
                                overflow: "auto",
                              },
                            }}
                            placeholder="Paste batch IDs (comma, space or newline separated)"
                            value={coilFilter.batchId} // Use the new coilFilter
                            onChange={(e) => {
                              setCoilFilter({
                                // Use the new coilFilter
                                ...coilFilter,
                                batchId: e.target.value.toUpperCase(),
                              });
                              setCoilTable(null); // Use the new coilTable
                              setCoilTableData([]); // Use the new coilTableData
                            }}
                          />
                        </Grid> */}
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
                        {/* <Grid item xs={2.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            RM Batch Id
                          </MDTypography>
                          <MDInput
                            id="parentBatch"
                            value={coilFilter.parentBatch} // Use the new coilFilter
                            onChange={(e) => {
                              setCoilFilter({
                                // Use the new coilFilter
                                ...coilFilter,
                                parentBatch: e.target.value
                                  .toUpperCase()
                                  .slice(0, 10),
                              });
                              setCoilTable(null); // Use the new coilTable
                              setCoilTableData([]); // Use the new coilTableData
                            }}
                          />
                        </Grid> */}

                        <Grid item xs={2}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={populateForecast}
                          >
                            Populate Forecast
                          </MDButton>
                        </Grid>

                        <Grid item xs={2}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => getCoilDataLinkDlink("")}
                          >
                            View
                          </MDButton>
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
                      <Grid item xs={4}>
                        <MDTypography variant="h6" color="white">
                          Order Details
                        </MDTypography>
                      </Grid>
                      <Tooltip title="Rm View">
                        <IconButton
                          color="white"
                          onClick={() => {
                            if (!coilTable) {
                              alertify.error("Please load Order Details first");
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
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>

              {/* Removed the third Card for "RM Batch Details" from the main page */}
              {/* <Grid item xs={12}>
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
                      <Grid item xs={4}>
                        <MDTypography variant="h6" color="white">
                          RM Batch Details
                        </MDTypography>
                      </Grid>
                    </Grid>
                  </MDBox>
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        {coilTable1Data?.length > 0 && ( // Use the new coilTable1Data
                          <>
                            <div id="coilTable1" />
                            <p>Showing 1 to {coilTable1Data?.length} rows</p>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid> */}
            </Grid>
          </MDBox>
        </>
      )}
      <Dialog
        open={openRMDialog}
        onClose={handleCloseRMDialog}
        maxWidth="xl"
        fullWidth
      >
        <BootstrapDialogTitle onClose={handleCloseRMDialog}>

        </BootstrapDialogTitle>

        <MDBox p={2}>
          {selectedOrderRow && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={3}>
                <b>Order:</b> {selectedOrderRow?.COS_ID_ORDER}
              </Grid>

               <Grid item xs={2}>
                 <b>Item:</b> {selectedOrderRow?.COS_NO_ITEM}
               </Grid>

               <Grid item xs={2}>
                 <b>TDC:</b> {selectedOrderRow?.COS_NO_TDC}
               </Grid>
             </Grid>
          )}

          {/* Moved the RM Batch Details header into the Dialog */}
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
              <Grid item xs={4}>
                <MDTypography variant="h6" color="white">
                  RM Batch Details
                </MDTypography>
              </Grid>
            </Grid>
          </MDBox>

          {/* CRITICAL CHANGE 3: Attach //the ref to the div */}
          <div id="coilTable1" ref={coilTable1Ref}></div>

          {coilTable1Data?.length > 0 && (
            <p>Showing 1 to {coilTable1Data?.length} rows</p>
          )}
        </MDBox>
      </Dialog>
    </DashboardLayout>
  );
}
