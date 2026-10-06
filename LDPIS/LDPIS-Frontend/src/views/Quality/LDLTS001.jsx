import React, { useEffect, useState, useRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
import AsyncSelect from "react-select/async";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import MDAlert from "components/MDAlert";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import Tooltip from "@mui/material/Tooltip";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import { GetAuthorization } from "utils";
import * as XLSX from "xlsx"; // Import the XLSX library

export default function LDLTS001() {
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(false);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [selectedPlant, setSelectedPlant] = React.useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [heatlist, setheatList] = useState([]);
  const [heatNo, setHeatNo] = useState(null);
  const [RMList, setRMList] = useState([]);
  const [rmBatchId, setrmBatchId] = useState(null);
  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeno, setPipeNo] = useState(null);
  const [Action, setAction] = useState([]);
  const [selectedAction, setSelectedAction] = React.useState(null);
  const [inspector0, setInspector0] = useState("");
  const [salesOrdNo0, setSalesOrdNo0] = useState("");
  const [salesItemNo0, setSalesItemNo0] = useState("");
  const [reportType0, setReportType0] = useState("TP");
  const [inspector1, setInspector1] = useState("");
  const [salesOrdNo1, setSalesOrdNo1] = useState("");
  const [salesItemNo1, setSalesItemNo1] = useState("");
  const [reportType1, setReportType1] = useState("CP");
  const [inspector2, setInspector2] = useState("");
  const [salesOrdNo2, setSalesOrdNo2] = useState("");
  const [salesItemNo2, setSalesItemNo2] = useState("");
  const [reportType2, setReportType2] = useState("HT");
  const [inspector3, setInspector3] = useState("");
  const [salesOrdNo3, setSalesOrdNo3] = useState("");
  const [salesItemNo3, setSalesItemNo3] = useState("");
  const [reportType3, setReportType3] = useState("IP");
  const [inspector4, setInspector4] = useState("");
  const [salesOrdNo4, setSalesOrdNo4] = useState("");
  const [salesItemNo4, setSalesItemNo4] = useState("");
  const [reportType4, setReportType4] = useState("DWTT");
  const [selectedShiftDt0, setSelectedShiftDt0] = useState(null);
  const [selectedShiftDt1, setSelectedShiftDt1] = useState(null);
  const [selectedShiftDt2, setSelectedShiftDt2] = useState(null);
  const [selectedShiftDt3, setSelectedShiftDt3] = useState(null);
  const [selectedShiftDt4, setSelectedShiftDt4] = useState(null);

  const [selectedMechanicalData, setSelectedMechanicalData] = useState([]);
  const [selectedMechanicalTable, setSelectedMechanicalTable] = useState(null);
  const [selectedChemicalData, setSelectedChemicalData] = useState([]);
  const [selectedChemicalTable, setSelectedChemicalTable] = useState(null);
  const [selectedHardnessData, setSelectedHardnessData] = useState([]);
  const [selectedHardnessTable, setSelectedHardnessTable] = useState(null);
  const [selectedImpactData, setSelectedImpactData] = useState([]);
  const [selectedImpactTable, setSelectedImpactTable] = useState(null);
  const [selectedDWTTData, setSelectedDWTTData] = useState([]);
  const [selectedDWTTTable, setSelectedDWTTTable] = useState(null);
  const [plant, setPlant] = useState([
    { label: "-Select", value: "" },
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
  ]);
  const [selectedProcPathTable, setSelectedProcPathTable] = useState(null);
  const [tabType, setTabType] = useState("TP");

  // New state for uploaded Excel data and ref for file input
  const [uploadedExcelData, setUploadedExcelData] = useState([]);
  const excelFileInputRef = useRef(null);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        setTabType("TP");
        break;
      case 1:
        setTabType("CP");
        break;
      case 2:
        setTabType("HT");
        break;
      case 3:
        setTabType("IP");
        break;
      case 4:
        setTabType("DWTT");
        break;
      default:
        console.log("hello");
    }
    // Clear uploaded Excel data and reset file input on tab change
    setUploadedExcelData([]);
    if (excelFileInputRef.current) {
      excelFileInputRef.current.value = "";
    }
  };

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      Promise.all([
        getGroupPlantId(token.accessToken),
        getHeatList(token.accessToken),
        getRmList(token.accessToken, ""),
        getPipeNoList("", token.accessToken, ""),
      ]).finally(() => {
        setLoading(false);
      });
    });
  }

  // Page Load
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Cleanup function for Tabulator instances
    return () => {
      if (selectedMechanicalTable) selectedMechanicalTable.destroy();
      if (selectedChemicalTable) selectedChemicalTable.destroy();
      if (selectedHardnessTable) selectedHardnessTable.destroy();
      if (selectedImpactTable) selectedImpactTable.destroy();
      if (selectedDWTTTable) selectedDWTTTable.destroy();
    };
  }, []); // Run once on mount for cleanup

  useEffect(() => {
    if (tabValue === 0) {
      if (selectedMechanicalTable) selectedMechanicalTable.destroy();
      setSelectedMechanicalTable(
        new Tabulator("#MechanicalTable", {
          maxHeight: 400,
          layout: "fitDataFill",
          data: selectedMechanicalData,
          columns: mechanicalColumns,
        })
      );
    } else if (tabValue === 1) {
      if (selectedChemicalTable) selectedChemicalTable.destroy();
      setSelectedChemicalTable(
        new Tabulator("#ChemicalTable", {
          layout: "fitDataFill",
          data: selectedChemicalData,
          columns: chemicalColumns,
        })
      );
    } else if (tabValue === 2) {
      if (selectedHardnessTable) selectedHardnessTable.destroy();
      setSelectedHardnessTable(
        new Tabulator("#HardnessTable", {
          layout: "fitDataFill",
          data: selectedHardnessData,
          columns: HardnessColumns,
        })
      );
    } else if (tabValue === 3) {
      if (selectedImpactTable) selectedImpactTable.destroy();
      setSelectedImpactTable(
        new Tabulator("#ImpactTable", {
          layout: "fitDataFill",
          data: selectedImpactData,
          columns: ImpactColumns,
        })
      );
    } else if (tabValue === 4) {
      if (selectedDWTTTable) selectedDWTTTable.destroy();
      setSelectedDWTTTable(
        new Tabulator("#DWTTTable", {
          layout: "fitDataFill",
          data: selectedDWTTData,
          columns: DWTTColumns,
        })
      );
    }
  }, [
    tabValue,
    selectedMechanicalData,
    selectedChemicalData,
    selectedHardnessData,
    selectedImpactData,
    selectedDWTTData,
  ]);

  const validateUser = async (token) => {
    try {
      var plant = "";

      var userDetails = jwt.verify(
        token.refreshToken,
        serverDetails.REFRESH_KEY
      );

      plant = userDetails.payload.plant;
      serverDetails.PersonalNo = userDetails.payload.id;
      serverDetails.Plant = userDetails.payload.plant;
      serverDetails.Company = userDetails.payload.company;

      if (
        serverDetails.PersonalNo == null ||
        serverDetails.PersonalNo == undefined ||
        serverDetails.PersonalNo === ``
      ) {
        window.location.href = "#/signin";
      }

      var userId = serverDetails.PersonalNo;
      var pageName = "LDLTS001";

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

  //get Plant id
  const getGroupPlantId = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        adid: serverDetails.PersonalNo,
        //serverDetails.PersonalNo
      };
      var url = "api/common/getGroupPlant";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
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
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handleClearMain = (newToken = false) => {
    setSelectedPlant(null);
    setHeatNo(null);
    setrmBatchId(null);
    setPipeNo(null);
    setSelectedAction(null);
    setUploadedExcelData([]); // Clear uploaded Excel data
    if (excelFileInputRef.current) {
      excelFileInputRef.current.value = ""; // Clear file input
    }

    // Clear all tables
    setSelectedMechanicalData([]);
    setSelectedChemicalData([]);
    setSelectedHardnessData([]);
    setSelectedImpactData([]);
    setSelectedDWTTData([]);
  };

  const tcmCRcoilLoadOptions = (inputValue, callback) => {
    setrmBatchId("");
    setTimeout(async () => {
      callback([{ value: inputValue, label: inputValue }]);
    }, 1000);
  };

  const confirm = async (newToken = false, tableType) => {
    if (newToken) {
      const rsp = await GetAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    let tableDataStateSetter = null;
    let tableState = null;
    let currentTableData = [];
    let shiftDate = null;
    let inspector = null;

    switch (tableType) {
      case "TP":
        tableState = selectedMechanicalTable;
        tableDataStateSetter = setSelectedMechanicalData;
        inspector = inspector0;
        shiftDate = selectedShiftDt0;
        break;
      case "CP":
        tableState = selectedChemicalTable;
        tableDataStateSetter = setSelectedChemicalData;
        inspector = inspector0;
        shiftDate = selectedShiftDt0;
        break;
      case "HT":
        tableState = selectedHardnessTable;
        tableDataStateSetter = setSelectedHardnessData;
        inspector = inspector0;
        shiftDate = selectedShiftDt0;
        break;
      case "IP":
        tableState = selectedImpactTable;
        tableDataStateSetter = setSelectedImpactData;
        inspector = inspector0;
        shiftDate = selectedShiftDt0;
        break;
      case "DWTT":
        tableState = selectedDWTTTable;
        tableDataStateSetter = setSelectedDWTTData;
        inspector = inspector0;
        shiftDate = selectedShiftDt0;
        break;
      default:
        console.error("Invalid tableType provided.");
        setLoading(false);
        return;
    }

    if (!tableState) {
      alertify.error("No data table found to confirm.");
      setLoading(false);
      return;
    }

    const selectedRows = tableState.getSelectedRows();
    if (selectedRows.length === 0) {
      alertify.error("Please select rows to confirm.");
      setLoading(false);
      return;
    }

    selectedRows.forEach((item) => {
      currentTableData.push(item._row.data);
    });

    if (!inspector || inspector.length === 0) {
      alertify.error("Please enter Inspector Name");
      setLoading(false);
      return;
    }

    if (!shiftDate) {
      alertify.error("Please select Shift Date");
      setLoading(false);
      return;
    }

    setLoading(true);
    var data = {
      newTableData: currentTableData,
      reportType: tableType,
      inspector: inspector,
      shiftDate: shiftDate,
      action: selectedAction?.value,
      resultrm: currentTableData.map((item) => item?.FPT_TEST_PARA_RESULT),
    };

    const url = "api/LDLTS001/inserttestdetails";

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
          alertify.error(response?.error?.response.data?.message || "An error occurred.");
        } else {
          if (response?.data === "Y") {
            alertify.success("Test Result Inserted successfully");
            tableDataStateSetter([]); // Clear table data after successful insert
          } else {
            alertify.error("Insertion failed: " + response?.data);
          }
        }
      })
      .catch((error) => {
        alertify.error("Error during API call: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDataForTables = async (tableType) => {
    setLoading(true);
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      if (!selectedAction?.value) {
        alertify.error("Please select an Action (Create/Change)");
        setLoading(false);
        return;
      }

      if (!pipeno?.value && selectedAction.value === "CR" && uploadedExcelData.length === 0) {
        alertify.error("Please select a Pipe No. or upload an Excel file to create data.");
        setLoading(false);
        return;
      }

      let tableColumns = [];
      let tableDataStateSetter = null;

      switch (tableType) {
        case "TP":
          tableColumns = mechanicalColumns;
          tableDataStateSetter = setSelectedMechanicalData;
          break;
        case "CP":
          tableColumns = chemicalColumns;
          tableDataStateSetter = setSelectedChemicalData;
          break;
        case "HT":
          tableColumns = HardnessColumns;
          tableDataStateSetter = setSelectedHardnessData;
          break;
        case "IP":
          tableColumns = ImpactColumns;
          tableDataStateSetter = setSelectedImpactData;
          break;
        case "DWTT":
          tableColumns = DWTTColumns;
          tableDataStateSetter = setSelectedDWTTData;
          break;
        default:
          console.error("Invalid tableType provided.");
          setLoading(false);
          return;
      }

      let fetchedData = [];

      if (selectedAction.value === "CR") {
        const hasExcelData = uploadedExcelData && uploadedExcelData.length > 0;
        let pipeIdsFromForm = pipeno?.value ? [pipeno.value] : [];
        let pipeIdsFromExcel = hasExcelData ? [...new Set(uploadedExcelData.map(row => row["Pipe_No"]).filter(Boolean))] : [];

        // Determine the source of pipe IDs
        let pipeIdsToProcess = hasExcelData ? pipeIdsFromExcel : pipeIdsFromForm;

        if (pipeIdsToProcess.length === 0) {
            alertify.error("No Pipe IDs to process for 'Create' action.");
            setLoading(false);
            return;
        }

        const excelDataMap = hasExcelData ? uploadedExcelData.reduce((acc, row) => {
            if (row["Pipe_No"]) {
                const key = tableType === "TP" && row["Location"] ? `${row["Pipe_No"]}-${row["Location"]}` : row["Pipe_No"];
                if (!acc[key]) {
                  acc[key] = row;
                } else {
                  console.warn(`Duplicate (Pipe_No, Location) or Pipe_No found in Excel for key: ${key}. Keeping first occurrence.`);
                }
            }
            return acc;
        }, {}) : {};


        for (const currentPipeId of pipeIdsToProcess) {
            const url1 = "api/LDLTS001/getHeatData";
            const batchd = {
                pipeid: currentPipeId,
            };
            const resp = await axiosAPI.post(url1, batchd, defaultOptions);

            if (resp.status !== 200 || !resp.data || !resp.data[0] || !resp.data[0].LOM_NO_CAST) {
                console.warn(`No Heat No found for Pipe No: ${currentPipeId}. Skipping.`);
                alertify.warning(`No Heat No found for Pipe No: ${currentPipeId}.`);
                continue; // Skip to next pipe if no heat data
            }

            const cast_no = resp.data[0].LOM_NO_CAST;

            // Helper to get value preferring Excel over default
            const getCellValue = (excelRow, columnTitle, columnField, defaultValue) => {
                // Check Excel data by its display name first, then by its backend field name
                if (excelRow && excelRow[columnTitle] !== undefined) {
                    return excelRow[columnTitle];
                }
                if (excelRow && excelRow[columnField] !== undefined) {
                  return excelRow[columnField];
                }
                return defaultValue;
            };

            const createRow = (pipeNum, locationValue, currentExcelRow = null, calculateFunction = null) => {
                let newRow = {};
                tableColumns.forEach(column => {
                    const columnTitle = column.title;
                    const columnField = column.field;

                    if (columnField === "PLANT") {
                        newRow[columnField] = "0780";
                    } else if (columnField === "BATCH") {
                        newRow[columnField] = pipeNum;
                    } else if (columnField === "HEAT_NO") {
                        newRow[columnField] = cast_no;
                    } else if (columnField === "REPORT_TYPE") {
                        newRow[columnField] = tableType;
                    } else if (columnField === "FPT_CD_LOC" && tableType === "TP") { // Only set location for TP
                        newRow[columnField] = locationValue;
                    } else if (columnField === "FPT_TEST_PARA_REM") {
                        newRow[columnField] = getCellValue(currentExcelRow, "Broken Location", "FPT_TEST_PARA_REM", "-");
                    } else if (columnField === "FPT_TEST_PARA_RESULT") {
                        newRow[columnField] = getCellValue(currentExcelRow, "Result", "FPT_TEST_PARA_RESULT", "-");
                    } else if (columnField === "FTP_TEST_REMARK") {
                        newRow[columnField] = getCellValue(currentExcelRow, "Remark", "FTP_TEST_REMARK", "-");
                    } else if (column.editor === "number" || (column.formatter && column?.formatter?.toString()?.includes("toFixed"))) {
                        newRow[columnField] = getCellValue(currentExcelRow, columnTitle, columnField, 0); // Default to 0 for numeric fields
                    } else {
                        newRow[columnField] = getCellValue(currentExcelRow, columnTitle, columnField, "");
                    }
                });

                // Trigger calculation immediately after row creation if a function is provided
                if (calculateFunction) {
                    // For calculations, we might need a temporary cell-like object or pass the row directly
                    // Refactor calculate functions to accept just the row data
                    const tempRow = {
                      getData: () => newRow,
                      update: (updatedFields) => {
                        Object.assign(newRow, updatedFields);
                      }
                    };
                    calculateFunction(tempRow);
                }
                return newRow;
            };

            if (hasExcelData) {
                // Logic when Excel is uploaded
                if (tableType === "TP") {
                    const currentPipeExcelRows = uploadedExcelData.filter(row => row["Pipe_No"] === currentPipeId && row["Location"]);
                    const seenLocations = new Set();
                    currentPipeExcelRows.forEach(excelRow => {
                        const location = excelRow["Location"];
                        if (location && !seenLocations.has(location)) {
                            seenLocations.add(location);
                            const newRow = createRow(currentPipeId, location, excelRow, calculateMechanicalValues);
                            fetchedData.push(newRow);
                        } else if (location && seenLocations.has(location)) {
                            console.warn(`Duplicate (Pipe_No, Location) combination found in Excel for Pipe: ${currentPipeId}, Location: ${location}. Keeping the first occurrence.`);
                        } else {
                            alertify.warning(`Excel row for Pipe ${currentPipeId} (Mechanical Testing) is missing 'Location'. Skipping this row.`);
                        }
                    });
                } else {
                    const excelRow = excelDataMap[currentPipeId];
                    if (excelRow) {
                        let calculateFunc = null;
                        switch(tableType) {
                            case "CP": calculateFunc = calculateDynamicValues; break;
                            case "HT": calculateFunc = updateGRNValues; break;
                            case "IP": calculateFunc = calculateAverages; break;
                            case "DWTT": calculateFunc = calculateDWTTAverages; break;
                            default: break;
                        }
                        const newRow = createRow(currentPipeId, "", excelRow, calculateFunc);
                        fetchedData.push(newRow);
                    }
                }
            } else {
                // Fallback logic when no Excel is uploaded
                if (tableType === "TP") {
                    const fixedLocations = ["TBT", "TWT", "LBT"];
                    fixedLocations.forEach(loc => {
                        const newRow = createRow(currentPipeId, loc, null, calculateMechanicalValues);
                        fetchedData.push(newRow);
                    });
                } else {
                    let calculateFunc = null;
                    switch(tableType) {
                        case "CP": calculateFunc = calculateDynamicValues; break;
                        case "HT": calculateFunc = updateGRNValues; break;
                        case "IP": calculateFunc = calculateAverages; break;
                        case "DWTT": calculateFunc = calculateDWTTAverages; break;
                        default: break;
                    }
                    const newRow = createRow(currentPipeId, "", null, calculateFunc);
                    fetchedData.push(newRow);
                }
            }
        }

        if (fetchedData.length === 0) {
            alertify.error("No data could be generated for the selected Pipe IDs.");
            setLoading(false);
            return;
        }

      } else if (selectedAction.value === "CH" || selectedAction.value === "D") {
        if (!pipeno?.value) {
          alertify.error("Please select a Pipe No. for 'Change/Display' action.");
          setLoading(false);
          return;
        }
        const data = {
          BATCH_ID: pipeno?.value,
          REPORT_TYPE: tableType,
        };
        const url = "api/LDLTS001/getTestResults";
        const response = await axiosAPI.post(url, data, defaultOptions);

        if (response.status === 200 && response.data) {
          fetchedData = response.data;
          if (!fetchedData || fetchedData.length === 0) {
            alertify.error("No Data Found, Create for this batch first");
            fetchedData = [];
          } else {
            // Set inspector and shift date from the first row of fetched data
            if (fetchedData.length > 0) {
              setInspector0(fetchedData[0]?.FPT_INSPEC_NM || "");
              setSelectedShiftDt0(fetchedData[0]?.FPT_CRT_DT || null);
              // Extend to other inspectors/shift dates if needed for other tabs
            }
          }
          // After fetching existing data, also trigger calculations
          fetchedData.forEach(row => {
            const tempRow = {
              getData: () => row,
              update: (updatedFields) => {
                Object.assign(row, updatedFields);
              }
            };
            switch(tableType) {
                case "TP": calculateMechanicalValues(tempRow); break;
                case "CP": calculateDynamicValues(tempRow); break;
                case "HT": updateGRNValues(tempRow); break;
                case "IP": calculateAverages(tempRow); break;
                case "DWTT": calculateDWTTAverages(tempRow); break;
                default: break;
            }
          });
        } else {
          alertify.error("Failed to fetch data.");
        }
      } else {
        alertify.error("Invalid action selected.");
        setLoading(false);
        return;
      }

      tableDataStateSetter(fetchedData);
    } catch (error) {
      alertify.error("Error handling table data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // New: Refactored Mechanical Calculations into a reusable function
  function calculateMechanicalValues(rowObject) {
    const data = rowObject.getData();
    const widthB = parseFloat(data.WIDTH_B) || 0;
    const thickB = parseFloat(data.THICK_B) || 0;
    const mgl = parseFloat(data.MGL) || 0;
    const yl = parseFloat(data.YL) || 0;
    const utlB = parseFloat(data.UTL_B) || 0;
    const el = parseFloat(data.EL) || 0;
    const widthW = parseFloat(data.WIDTH_W) || 0;
    const thickW = parseFloat(data.THICK_W) || 0;
    const utlW = parseFloat(data.UTL_W) || 0;

    const areaB = widthB * thickB;
    const ysB = areaB ? (yl / areaB) * 1000 : 0;
    const utsB = areaB ? (utlB / areaB) * 1000 : 0;
    const ysUtsB = utsB ? ysB / utsB : 0;
    const fgl = mgl + el * (mgl / 100);

    const areaW = widthW * thickW;
    const utsW = areaW ? (utlW / areaW) * 1000 : 0;

    rowObject.update({
        AREA_B: areaB,
        YS_B: ysB,
        UTS_B: utsB,
        YS_UTS_B: ysUtsB,
        FGL: fgl,
        AREA_W: areaW,
        UTS_W: utsW,
    });
  }


  const mechanicalColumns = [
    { formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, frozen: true },
    { title: "Plant", field: "PLANT", headerFilter: "input", headerFilterPlaceholder: "search...", frozen: false },
    { title: "Batch", field: "BATCH", headerFilter: "input", headerFilterPlaceholder: "search...", frozen: true },
    { title: "Heat No", field: "HEAT_NO", headerFilter: "input", hozAlign: "center", headerFilterPlaceholder: "search...", frozen: false },
    { title: "Report Type", field: "REPORT_TYPE", headerFilter: "input", hozAlign: "center", headerFilterPlaceholder: "search...", frozen: false },
    {
      title: "Location", field: "FPT_CD_LOC", headerFilter: "input", hozAlign: "center", editable: true, headerFilterPlaceholder: "search...",
      formatter: function (cell) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#dac292";
        cell.getElement().style["color"] = "#000000";
        return value;
      },
      editor: "select", // Changed to select editor for defined locations
      editorParams: {
        values: ["TBT", "LBT", "TWT"], // Specific values for mechanical locations
      },
    },
    {
      title: "Width B", field: "WIDTH_B", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number",
      formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(2) : value; },
      cellEdited: (cell) => calculateMechanicalValues(cell.getRow()),
    },
    {
      title: "Thick B", field: "THICK_B", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number",
      formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(2) : value; },
      cellEdited: (cell) => calculateMechanicalValues(cell.getRow()),
    },
    {
      title: "MGL", field: "MGL", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number",
      formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; },
      cellEdited: (cell) => calculateMechanicalValues(cell.getRow()),
    },
    {
      title: "YL", field: "YL", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number",
      formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(2) : value; },
      cellEdited: (cell) => calculateMechanicalValues(cell.getRow()),
    },
    {
      title: "UTL B", field: "UTL_B", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number",
      formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(2) : value; },
      cellEdited: (cell) => calculateMechanicalValues(cell.getRow()),
    },
    {
      title: "EL", field: "EL", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number",
      formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(1) : value; },
      cellEdited: (cell) => calculateMechanicalValues(cell.getRow()),
    },
    {
      title: "Width W", field: "WIDTH_W", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number",
      formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(2) : value; },
      cellEdited: (cell) => calculateMechanicalValues(cell.getRow()),
    },
    {
      title: "Thick W", field: "THICK_W", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number",
      formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(2) : value; },
      cellEdited: (cell) => calculateMechanicalValues(cell.getRow()),
    },
    {
      title: "UTL W", field: "UTL_W", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number",
      formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(2) : value; },
      cellEdited: (cell) => calculateMechanicalValues(cell.getRow()),
    },
    {
      title: "Broken Location", field: "FPT_TEST_PARA_REM", headerFilter: "input", hozAlign: "center", headerFilterPlaceholder: "search...", frozen: false, editor: "input",
      formatter: function (cell) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#dac292";
        cell.getElement().style["color"] = "#000000"; return value;
      },
    },
    {
      title: "Result", field: "FPT_TEST_PARA_RESULT", headerFilter: "input", headerFilterPlaceholder: "search...", width: "10%", editor: "select", editorParams: { values: ["OK", "NOT OK"] },
      formatter: function (cell) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#dac292";
        cell.getElement().style["color"] = "#000000"; return value;
      },
    },
    {
      title: "Remark", field: "FTP_TEST_REMARK", headerFilter: "input", headerFilterPlaceholder: "search...", width: "10%", editor: "input",
      formatter: function (cell) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#dac292";
        cell.getElement().style["color"] = "#000000"; return value;
      },
    },
    { title: "AREA_B", field: "AREA_B", editable: false, formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; } },
    { title: "AREA_W", field: "AREA_W", editable: false, formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; } },
    { title: "YS_B", field: "YS_B", editable: false, formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; } },
    { title: "UTS_B", field: "UTS_B", editable: false, formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; } },
    { title: "UTS_W", field: "UTS_W", editable: false, formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; } },
    { title: "FGL", field: "FGL", editable: false, formatter: function (cell) { var value = Number(cell.getValue()); return (typeof value === "number" && !isNaN(value)) ? value?.toFixed(2) : value; } },
    { title: "YS_UTS_B", field: "YS_UTS_B", editable: false, formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(2) : value; } },
  ];

  function calculateDynamicValues(rowObject) {
    const data = rowObject.getData();

    const C = parseFloat(data.C) || 0;
    const SI = parseFloat(data.SI) || 0;
    const MN = parseFloat(data.MN) || 0;
    const CU = parseFloat(data.CU) || 0;
    const NI = parseFloat(data.NI) || 0;
    const CR = parseFloat(data.CR) || 0;
    const MO = parseFloat(data.MO) || 0;
    const V = parseFloat(data.V) || 0;
    const TI = parseFloat(data.TI) || 0;
    const NB = parseFloat(data.NB) || 0;
    const N = parseFloat(data.N) || 0;
    const B = parseFloat(data.B) || 0;
    const AL = parseFloat(data.AL) || 0;

    const alN = N !== 0 ? (AL / N) : 0;
    const cuNiCrMoV = CU + NI + CR + MO + V;
    const nbVTi = NB + V + TI;
    const nbV = NB + V;
    const cuNi = CU + NI;

    const ceiiw = C + (MN / 6) + ((CR + MO + V) / 5) + ((NI + CU) / 15);
    const cepcm = C + (SI / 30) + (MN / 20) + (CU / 20) + (NI / 60) + (CR / 20) + (MO / 15) + (V / 10) + (B * 5);

    rowObject.update({
      AL_N: alN.toFixed(4),
      CU_NI_CR_MO_V: cuNiCrMoV.toFixed(4),
      NB_V_TI: nbVTi.toFixed(4),
      NB_V: nbV.toFixed(4),
      CU_NI: cuNi.toFixed(4),
      CEIIW: ceiiw.toFixed(4),
      CEPCM: cepcm.toFixed(4),
    });
  }

  const chemicalColumns = [
    { formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, frozen: true },
    { title: "Plant", field: "PLANT", headerFilter: "input", headerFilterPlaceholder: "search...", frozen: false },
    { title: "Batch", field: "BATCH", headerFilter: "input", headerFilterPlaceholder: "search...", frozen: true },
    { title: "Heat No", field: "HEAT_NO", headerFilter: "input", hozAlign: "center", headerFilterPlaceholder: "search...", frozen: false },
    { title: "Report Type", field: "REPORT_TYPE", headerFilter: "input", hozAlign: "center", headerFilterPlaceholder: "search...", frozen: false },
    {
      title: "C", field: "C", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value); 
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "Mn", field: "MN", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "Si", field: "SI", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0);
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "S", field: "S", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "P", field: "P", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "Al", field: "AL", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "Al (Sol)", field: "AL_S", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "6%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          // calculateDynamicValues(cell.getRow()); // Al(Sol) does not directly affect other calcs.
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "Nb", field: "NB", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "V", field: "V", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "Ti", field: "TI", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "Cr", field: "CR", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "Mo", field: "MO", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "Cu", field: "CU", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "Ni", field: "NI", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "N", field: "N", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "B", field: "B", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          calculateDynamicValues(cell.getRow());
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "Ca", field: "CA", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", width: "5%",
      cellEdited: (cell) => { 
        const value = parseFloat(cell.getValue());
        if (!isNaN(value)) {
          cell.setValue(value);
          // calculateDynamicValues(cell.getRow()); // Ca does not directly affect other calcs.
        } else {
          cell.setValue(0); 
        }
      },
      formatter: function (cell) { 
        var value = parseFloat(cell.getValue());
        return isNaN(value) ? "" : value.toFixed(4);
      },
    },
    {
      title: "Result", field: "FPT_TEST_PARA_RESULT", headerFilter: "input", headerFilterPlaceholder: "search...", width: "10%", editor: "select", editorParams: { values: ["OK", "NOT OK"] },
      formatter: function (cell) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#dac292";
        cell.getElement().style["color"] = "#000000"; return value;
      },
    },
    {
      title: "Remark", field: "FTP_TEST_REMARK", headerFilter: "input", headerFilterPlaceholder: "search...", width: "10%", editor: "input",
      formatter: function (cell) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#dac292";
        cell.getElement().style["color"] = "#000000"; return value;
      },
    },
    { title: "Al/N", field: "AL_N", editable: false, formatter: function (cell) { var value = parseFloat(cell.getValue()); return isNaN(value) ? "" : value.toFixed(4); } },
    { title: "Cu+Ni+Cr+Mo+V", field: "CU_NI_CR_MO_V", editable: false, formatter: function (cell) { var value = parseFloat(cell.getValue()); return isNaN(value) ? "" : value.toFixed(4); } },
    { title: "Nb+V+Ti", field: "NB_V_TI", editable: false, formatter: function (cell) { var value = parseFloat(cell.getValue()); return isNaN(value) ? "" : value.toFixed(4); } },
    { title: "Nb+V", field: "NB_V", editable: false, formatter: function (cell) { var value = parseFloat(cell.getValue()); return isNaN(value) ? "" : value.toFixed(4); } },
    { title: "Cu+Ni", field: "CU_NI", editable: false, formatter: function (cell) { var value = parseFloat(cell.getValue()); return isNaN(value) ? "" : value.toFixed(4); } },
    { title: "CEIIW", field: "CEIIW", editable: false, formatter: function (cell) { var value = parseFloat(cell.getValue()); return isNaN(value) ? "" : value.toFixed(4); } },
    { title: "CEPCM", field: "CEPCM", editable: false, formatter: function (cell) { var value = parseFloat(cell.getValue()); return isNaN(value) ? "" : value.toFixed(4); } },
  ];

  function updateGRNValues(rowObject) {
    const data = rowObject.getData();

    const fieldsToCheck = [
      "BASE_L1", "BASE_L2", "BASE_L3", "BASE_L4", "BASE_L5", "BASE_L6", "BASE_L7", "BASE_L8", "BASE_L9",
      "HAZ_L10", "HAZ_L11", "HAZ_L12", "HAZ_L13", "HAZ_L14", "HAZ_L15",
      "WELD_16", "WELD_17", "WELD_18",
      "HAZ_R19", "HAZ_R20", "HAZ_R21", "HAZ_R22", "HAZ_R23", "HAZ_R24",
      "BASE_R25", "BASE_R26", "BASE_R27", "BASE_R28", "BASE_R29", "BASE_R30",
      "BASE_R31", "BASE_R32", "BASE_R33",
    ];

    const values = fieldsToCheck
      .map((field) => {
        const value = parseFloat(data[field]);
        return isNaN(value) ? null : value;
      })
      .filter((val) => val !== null);

    const minValue = values.length > 0 ? Math.min(...values) : 0;
    const maxValue = values.length > 0 ? Math.max(...values) : 0;

    rowObject.update({
      GRN_MIN: minValue,
      GRN_MAX: maxValue,
      GRN_VARIANCE: maxValue - minValue,
    });
  }

  const HardnessColumns = [
    { formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, frozen: true },
    { title: "Plant", field: "PLANT", headerFilter: "input", headerFilterPlaceholder: "search...", frozen: false },
    { title: "Batch", field: "BATCH", headerFilter: "input", headerFilterPlaceholder: "search...", frozen: true },
    { title: "Heat No", field: "HEAT_NO", headerFilter: "input", hozAlign: "center", headerFilterPlaceholder: "search...", frozen: false },
    { title: "Report Type", field: "REPORT_TYPE", headerFilter: "input", hozAlign: "center", headerFilterPlaceholder: "search...", frozen: false },
    { title: "Base L1", field: "BASE_L1", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base L2", field: "BASE_L2", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base L3", field: "BASE_L3", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base L4", field: "BASE_L4", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base L5", field: "BASE_L5", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base L6", field: "BASE_L6", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base L7", field: "BASE_L7", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base L8", field: "BASE_L8", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base L9", field: "BASE_L9", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "HAZ 10", field: "HAZ_L10", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "HAZ 11", field: "HAZ_L11", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "HAZ 12", field: "HAZ_L12", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "HAZ 13", field: "HAZ_L13", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "HAZ 14", field: "HAZ_L14", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "HAZ 15", field: "HAZ_L15", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "WELD 16", field: "WELD_16", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "WELD 17", field: "WELD_17", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "WELD 18", field: "WELD_18", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "HAZR 19", field: "HAZ_R19", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "HAZR 20", field: "HAZ_R20", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "HAZR 21", field: "HAZ_R21", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "HAZR 22", field: "HAZ_R22", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "HAZR 23", field: "HAZ_R23", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "HAZR 24", field: "HAZ_R24", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base R25", field: "BASE_R25", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "HZR R26", field: "BASE_R26", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base R27", field: "BASE_R27", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base R28", field: "BASE_R28", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base R29", field: "BASE_R29", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base R30", field: "BASE_R30", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base R31", field: "BASE_R31", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base R32", field: "BASE_R32", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "Base R33", field: "BASE_R33", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => updateGRNValues(cell.getRow()), },
    { title: "GRN Size", field: "GRN_SIZE", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(1) : value; } },
    { title: "GRN Min", field: "GRN_MIN", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", editable: false, formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; } },
    { title: "GRN Max", field: "GRN_MAX", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", editable: false, formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; } },
    {
      title: "Result", field: "FPT_TEST_PARA_RESULT", headerFilter: "input", headerFilterPlaceholder: "search...", width: "10%", editor: "select", editorParams: { values: ["OK", "NOT OK"] },
      formatter: function (cell) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#dac292";
        cell.getElement().style["color"] = "#000000"; return value;
      },
    },
    {
      title: "Remark", field: "FTP_TEST_REMARK", headerFilter: "input", headerFilterPlaceholder: "search...", width: "10%", editor: "input",
      formatter: function (cell) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#dac292";
        cell.getElement().style["color"] = "#000000"; return value;
      },
    },
    { title: "GRN_VARIANCE", field: "GRN_VARIANCE", editable: false, formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; } },
  ];

  function calculateAverages(rowObject) {
    const data = rowObject.getData();

    const getAvg = (fields) => {
      let sum = 0;
      let count = 0;
      fields.forEach(field => {
        const val = parseFloat(data[field]);
        if (typeof val === 'number' && !isNaN(val) && val !== 0) {
          sum += val;
          count++;
        }
      });
      return count > 0 ? sum / count : 0;
    };

    rowObject.update({
      BASE_AVG: getAvg(["BASE1", "BASE2", "BASE3"]).toFixed(0),
      WELD_AVG: getAvg(["WELD1", "WELD2", "WELD3"]).toFixed(0),
      HAZ_AVG: getAvg(["HAZ1", "HAZ2", "HAZ3"]).toFixed(0),
      SA_AVG: getAvg(["SA1", "SA2", "SA3"]).toFixed(0),
    });
  }

  const ImpactColumns = [
    { formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, frozen: true },
    { title: "Plant", field: "PLANT", headerFilter: "input", headerFilterPlaceholder: "search...", frozen: false },
    { title: "Batch", field: "BATCH", headerFilter: "input", headerFilterPlaceholder: "search...", frozen: true },
    { title: "Heat No", field: "HEAT_NO", headerFilter: "input", hozAlign: "center", headerFilterPlaceholder: "search...", frozen: false },
    { title: "Report Type", field: "REPORT_TYPE", headerFilter: "input", hozAlign: "center", headerFilterPlaceholder: "search...", frozen: false },
    { title: "Base1", field: "BASE1", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => calculateAverages(cell.getRow()), },
    { title: "Base2", field: "BASE2", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => calculateAverages(cell.getRow()), },
    { title: "Base3", field: "BASE3", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => calculateAverages(cell.getRow()), },
    { title: "Weld1", field: "WELD1", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => calculateAverages(cell.getRow()), },
    { title: "Weld2", field: "WELD2", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => calculateAverages(cell.getRow()), },
    { title: "Weld3", field: "WELD3", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => calculateAverages(cell.getRow()), },
    { title: "Haz1", field: "HAZ1", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => calculateAverages(cell.getRow()), },
    { title: "Haz2", field: "HAZ2", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => calculateAverages(cell.getRow()), },
    { title: "Haz3", field: "HAZ3", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => calculateAverages(cell.getRow()), },
    { title: "%SA1", field: "SA1", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => calculateAverages(cell.getRow()), },
    { title: "%SA2", field: "SA2", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => calculateAverages(cell.getRow()), },
    { title: "%SA3", field: "SA3", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, cellEdited: (cell) => calculateAverages(cell.getRow()), },
    {
      title: "Result", field: "FPT_TEST_PARA_RESULT", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "select", editorParams: { values: ["OK", "NOT OK"] },
      formatter: function (cell) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#dac292";
        cell.getElement().style["color"] = "#000000"; return value;
      },
    },
    {
      title: "Remark", field: "FTP_TEST_REMARK", headerFilter: "input", headerFilterPlaceholder: "search...", width: "10%", editor: "input",
      formatter: function (cell) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#dac292";
        cell.getElement().style["color"] = "#000000"; return value;
      },
    },
    { title: "Temperature", field: "TEMPERATURE", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", formatter: function (cell) { var value = cell.getValue(); return value ? value?.toFixed(0) : value; } },
    { title: "BASE_AVG", field: "BASE_AVG", editable: false, formatter: function (cell) { var value = cell.getValue(); var numericValue = parseFloat(value); if (!isNaN(numericValue)) {
         return numericValue.toFixed(0); 
       } else {
         return '';
       }} },
    { title: "WELD_AVG", field: "WELD_AVG", editable: false, formatter: function (cell) { var value = cell.getValue();var numericValue = parseFloat(value); if (!isNaN(numericValue)) {
         return numericValue.toFixed(0); 
       } else {
         return '';
       } } },
    { title: "HAZ_AVG", field: "HAZ_AVG", editable: false, formatter: function (cell) { var value = cell.getValue();var numericValue = parseFloat(value); if (!isNaN(numericValue)) {
         return numericValue.toFixed(0); 
       } else {
         return '';
       } } },
    { title: "SA_AVG", field: "SA_AVG", editable: false, formatter: function (cell) { var value = cell.getValue();var numericValue = parseFloat(value); if (!isNaN(numericValue)) {
         return numericValue.toFixed(0); 
       } else {
         return '';
       } } },
  ];

  function calculateDWTTAverages(rowObject) {
    try {
      const rowData = rowObject.getData();

      const THICK1 = parseFloat(rowData.THICK1) || 0;
      const LEN_A1 = parseFloat(rowData.LEN_A1) || 0;
      const LEN_B1 = parseFloat(rowData.LEN_B1) || 0;
      const THICK2 = parseFloat(rowData.THICK2) || 0;
      const LEN_A2 = parseFloat(rowData.LEN_A2) || 0;
      const LEN_B2 = parseFloat(rowData.LEN_B2) || 0;

      const INDV1 =
        (((71 - 2 * THICK1) * THICK1 - (3 / 4) * LEN_A1 * LEN_B1) /
          ((71 - 2 * THICK1) * THICK1)) *
        100;

      const INDV2 =
        (((71 - 2 * THICK2) * THICK2 - (3 / 4) * LEN_A2 * LEN_B2) /
          ((71 - 2 * THICK2) * THICK2)) *
        100;

      const AVGDWTT = (INDV1 + INDV2) / 2;

      rowObject.update({
        INDV1: isFinite(INDV1) ? INDV1 : 0,
        INDV2: isFinite(INDV2) ? INDV2 : 0,
        AVGDWTT: isFinite(AVGDWTT) ? AVGDWTT : 0,
      });
    } catch (error) {
      console.error("Error in calculateDWTTAverages:", error);
    }
  }

  const DWTTColumns = [
    { formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, frozen: true },
    { title: "Plant", field: "PLANT", headerFilter: "input", headerFilterPlaceholder: "search...", frozen: false },
    { title: "Batch", field: "BATCH", headerFilter: "input", headerFilterPlaceholder: "search...", frozen: true },
    { title: "Heat No", field: "HEAT_NO", headerFilter: "input", hozAlign: "center", headerFilterPlaceholder: "search...", frozen: false },
    { title: "Report Type", field: "REPORT_TYPE", headerFilter: "input", hozAlign: "center", headerFilterPlaceholder: "search...", frozen: false },
    { title: "Thick1", field: "THICK1", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", cellEdited: (cell) => calculateDWTTAverages(cell.getRow()), width: "5%", formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(2) : value; }, },
    { title: "Len A1", field: "LEN_A1", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", cellEdited: (cell) => calculateDWTTAverages(cell.getRow()), formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, },
    { title: "Len B1", field: "LEN_B1", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", cellEdited: (cell) => calculateDWTTAverages(cell.getRow()), formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, },
    { title: "Thick2", field: "THICK2", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", cellEdited: (cell) => calculateDWTTAverages(cell.getRow()), formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(2) : value; }, },
    { title: "Len A2", field: "LEN_A2", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", cellEdited: (cell) => calculateDWTTAverages(cell.getRow()), formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, },
    { title: "Len B2", field: "LEN_B2", headerFilter: "input", headerFilterPlaceholder: "search...", editor: "number", cellEdited: (cell) => calculateDWTTAverages(cell.getRow()), formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; }, },
    {
      title: "Result", field: "FPT_TEST_PARA_RESULT", headerFilter: "input", headerFilterPlaceholder: "search...", width: "10%", editor: "select", editorParams: { values: ["OK", "NOT OK"] },
      formatter: function (cell) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#dac292";
        cell.getElement().style["color"] = "#000000"; return value;
      },
    },
    {
      title: "Remark", field: "FTP_TEST_REMARK", headerFilter: "input", headerFilterPlaceholder: "search...", width: "10%", editor: "input",
      formatter: function (cell) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#dac292";
        cell.getElement().style["color"] = "#000000"; return value;
      },
    },
    { title: "Individual 1", field: "INDV1", editable: false, formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; } },
    { title: "Individual 2", field: "INDV2", editable: false, formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; } },
    { title: "Avg DWTT", field: "AVGDWTT", editable: false, formatter: function (cell) { var value = cell.getValue(); return value ? value.toFixed(0) : value; } },
  ];

  const getRmList = async (accessToken, status) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: status ? status : "",
      pipeno: pipeno ? pipeno : "",
    };
    var url = "api/LDLTS001/getRmList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
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

  const getHeatList = async (accessToken, status) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: status,
      pipeno: pipeno ? pipeno : "",
    };
    var url = "api/LDLTS001/getHeatList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_NO_CAST;
            obj.value = row.LOM_NO_CAST;
            items.push(obj);
          });
          setheatList(items);
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
      status: status,
      rmBatch: value.value ? value.value : "",
    };
    var url = "api/LDLTS001/getPipeNoList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = [];
          response.data.map((row) => {
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

  const handlePlantChange = (value) => {
    if (value) {
      setSelectedPlant(value);
    } else {
      setSelectedPlant([]);
    }
  };

  const handleHeatNoChange = (value) => {
    setHeatNo(value);
    setPipeNo(null);
    setPipeNoList([]);
    setrmBatchId(null);
    setRMList([]);

    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([getRmList(data.accessToken, value.value)]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const handleRMBatchChange = (value) => {
    setrmBatchId(value);
    setPipeNo(null);
    setPipeNoList([]);
    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([getPipeNoList("", data.accessToken, value.value)]).finally(
          () => {
            setLoading(false);
          }
        );
      });
    }
  };

  const handlePipeNoChange = (value) => {
    setPipeNo(value);
    setSelectedMechanicalData([]);
    setSelectedChemicalData([]);
    setSelectedHardnessData([]);
    setSelectedImpactData([]);
    setSelectedDWTTData([]);
    if (excelFileInputRef.current) {
        excelFileInputRef.current.value = ""; // Clear file input
    }
    setUploadedExcelData([]); // Clear uploaded Excel data

    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const handleActionChange = (value) => {
    setSelectedAction(value);
    setSelectedMechanicalData([]);
    setSelectedMechanicalTable(null);
    setSelectedChemicalData([]);
    setSelectedChemicalTable(null);
    setSelectedHardnessData([]);
    setSelectedHardnessTable(null);
    setSelectedImpactData([]);
    setSelectedImpactTable(null);
    setSelectedDWTTData([]);
    setSelectedDWTTTable(null);
    if (excelFileInputRef.current) {
        excelFileInputRef.current.value = ""; // Clear file input
    }
    setUploadedExcelData([]); // Clear uploaded Excel data
  };

  const ActionType = [
    { label: "Create", value: "CR" },
    { label: "Change/Display", value: "CH" },
  ];

  const downloadMechanicalTableData = () => {
    if (selectedMechanicalData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var fileName = "Mechanical_Properties" + ".xlsx";
    selectedMechanicalTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadChemicalTableData = () => {
    if (selectedChemicalData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var fileName = "Chemical_Properties" + ".xlsx";
    selectedChemicalTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadHardnessTableData = () => {
    if (selectedHardnessData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var fileName = "Hardness_Properties" + ".xlsx";
    selectedHardnessTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadImpactTableData = () => {
    if (selectedImpactData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var fileName = "Impact_Properties" + ".xlsx";
    selectedImpactTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadDWTTTableData = () => {
    if (selectedDWTTData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var fileName = "DWTT_Properties" + ".xlsx";
    selectedDWTTTable.download("xlsx", fileName, {
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
          const json = XLSX.utils.sheet_to_json(worksheet);

          if (json.length > 0) {
            setUploadedExcelData(json);
            alertify.success(`Successfully loaded ${json.length} rows from Excel.`);
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
    let templateHeaders = [];
    switch (tabType) {
        case "TP":
            templateHeaders = [
                "Pipe_No", "Location", "Width B", "Thick B", "MGL", "YL", "UTL B", "EL", "Width W", "Thick W", "UTL W",
                "Broken Location", "Result", "Remark"
            ];
            break;
        case "CP":
            templateHeaders = [
                "Pipe_No", "C", "Mn", "Si", "S", "P", "Al", "Al (Sol)", "Nb", "V", "Ti", "Cr", "Mo", "Cu", "Ni", "N", "B", "Ca",
                "Result", "Remark"
            ];
            break;
        case "HT":
            templateHeaders = [
                "Pipe_No", "Base L1", "Base L2", "Base L3", "Base L4", "Base L5", "Base L6", "Base L7", "Base L8", "Base L9",
                "HAZ 10", "HAZ 11", "HAZ 12", "HAZ 13", "HAZ 14", "HAZ 15",
                "WELD 16", "WELD 17", "WELD 18",
                "HAZR 19", "HAZR 20", "HAZR 21", "HAZR 22", "HAZR 23", "HAZR 24",
                "Base R25", "HZR R26", "Base R27", "Base R28", "Base R29", "Base R30",
                "Base R31", "Base R32", "Base R33", "GRN Size",
                "Result", "Remark"
            ];
            break;
        case "IP":
            templateHeaders = [
                "Pipe_No", "Base1", "Base2", "Base3", "Weld1", "Weld2", "Weld3", "Haz1", "Haz2", "Haz3",
                "%SA1", "%SA2", "%SA3", "Temperature",
                "Result", "Remark"
            ];
            break;
        case "DWTT":
            templateHeaders = [
                "Pipe_No", "Thick1", "Len A1", "Len B1", "Thick2", "Len A2", "Len B2",
                "Result", "Remark"
            ];
            break;
        default:
            alertify.error("Unknown tab type for template download.");
            return;
    }


    const ws = XLSX.utils.aoa_to_sheet([templateHeaders]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${tabType} Data Template`);
    XLSX.writeFile(wb, `${tabType}DataTemplate.xlsx`);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Quality"
        page="Pipe Mechanical/Physical Testing"
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
            <Grid container spacing={4}>
              <Grid item xs={24}>
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
                          Filters
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
                      <Grid item xs={1.5} style={{ zIndex: 5 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color="dark"
                          noWrap
                        >
                          Plant {" "}
                        </MDTypography>
                        <ReactSelect
                          id="plant"
                          options={plant}
                          onChange={handlePlantChange}
                          value={selectedPlant}
                        />
                      </Grid>

                      <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color="dark"
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
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 1000,
                            }),
                            control: (provided) => ({
                              ...provided,
                            }),
                          }}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color="dark"
                          noWrap
                        >
                          Pipe No *
                        </MDTypography>
                        <AsyncSelect
                          cacheOptions
                          loadOptions={tcmCRcoilLoadOptions}
                          defaultOptions={pipenoList}
                          onChange={handlePipeNoChange}
                          value={pipeno}
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 1000,
                            }),
                            control: (provided) => ({
                              ...provided,
                            }),
                          }}
                        />
                      </Grid>

                      <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color="dark"
                          noWrap
                        >
                          Action*
                        </MDTypography>
                        <ReactSelect
                          options={ActionType}
                          onChange={(e) => {
                            handleActionChange(e);
                          }}
                          value={selectedAction}
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 1000,
                            }),
                            control: (provided) => ({
                              ...provided,
                            }),
                          }}
                        />
                      </Grid>

                      <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color="dark"
                          noWrap
                        >
                          Inspector*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="inspector0"
                          value={inspector0}
                          onChange={(e) => setInspector0(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color="dark"
                          noWrap
                        >
                          {" "}
                          Shift Date*{" "}
                        </MDTypography>
                        <DatePicker
                          id="shiftDt0"
                          value={selectedShiftDt0}
                          onChange={(date) => setSelectedShiftDt0(date)}
                        />
                      </Grid>
                        {selectedAction?.value === "CR" && (
                            <>
                            <Grid item xs={1.5} style={{ zIndex: 5 }}>
                                <MDTypography
                                    fontWeight="regular"
                                    fontSize="small"
                                    textTransform="capitalize"
                                    variant="h6"
                                    color="dark"
                                    noWrap
                                >
                                    Upload Data (Excel)
                                </MDTypography>
                                <MDInput
                                    type="file"
                                    inputRef={excelFileInputRef}
                                    onChange={handleExcelUpload}
                                    onClick={handleClearFileInput}
                                    accept=".xlsx, .xls"
                                    sx={{ width: '100%', marginTop: '0.5rem' }}
                                    helperText={uploadedExcelData.length > 0 ? `${uploadedExcelData.length} items loaded.` : ""}
                                    FormHelperTextProps={{
                                        sx: {
                                            color: 'text.secondary',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1.5}>
                                <MDButton
                                    style={{ marginTop: "2rem" }}
                                    size="small"
                                    color="success"
                                    onClick={handleDownloadTemplate}
                                >
                                    Download Template
                                </MDButton>
                            </Grid>
                            </>
                        )}
                      <Grid item xs={1.5}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => handleDataForTables(tabType)}
                        >
                          Fill Data
                        </MDButton>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <AppBar position="static">
                  <Tabs
                    orientation="horizontal"
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab label="Mechanical Testing" />
                    <Tab label="Chemical Testing" />
                    <Tab label="Hardness Testing" />
                    <Tab label="Impact Testing" />
                    <Tab label="DWTT Testing" />
                  </Tabs>
                </AppBar>
              </Grid>

              <Grid item xs={12}>
                {tabValue == 0 && (
                  <>
                    <Card style={{ marginTop: "0.001rem" }}>
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
                              Mechanical Details
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Update">
                              <IconButton
                                color="white"
                                onClick={() => confirm(true, "TP")}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton
                                color="white"
                                onClick={() => downloadMechanicalTableData()}
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
                            <div id="MechanicalTable" />

                            <br />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              Showing 1 to {selectedMechanicalData.length} of{" "}
                              {selectedMechanicalData.length} entries
                            </p>

                            <Grid
                              container
                              alignItems="center"
                              spacing={1}
                              style={{ marginTop: "1rem" }}
                            >
                              <Grid item>
                                <MDBox
                                  sx={{
                                    backgroundColor: "#dac292",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "4px",
                                    textAlign: "center",
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  TEXT FIELD
                                </MDBox>
                              </Grid>
                              <Grid item></Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                )}

                {tabValue == 1 && (
                  <>
                    <Card style={{ marginTop: "0.001rem" }}>
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
                              Chemical Details
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Update">
                              <IconButton
                                color="white"
                                onClick={() => confirm(true, "CP")}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton
                                color="white"
                                onClick={() => downloadChemicalTableData()}
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
                            <div id="ChemicalTable" />

                            <br />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              Showing 1 to {selectedChemicalData.length} of{" "}
                              {selectedChemicalData.length} entries
                            </p>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                )}

                {tabValue == 2 && (
                  <>
                    <Card style={{ marginTop: "0.001rem" }}>
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
                              Hardness Details
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Update">
                              <IconButton
                                color="white"
                                onClick={() => confirm(true, "HT")}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton
                                color="white"
                                onClick={() => downloadHardnessTableData()}
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
                            <div id="HardnessTable" />

                            <br />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              Showing 1 to {selectedHardnessData.length} of{" "}
                              {selectedHardnessData.length} entries
                            </p>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                )}
                {tabValue == 3 && (
                  <>
                    <Card style={{ marginTop: "0.001rem" }}>
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
                              Impact Details
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Update">
                              <IconButton
                                color="white"
                                onClick={() => confirm(true, "IP")}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton
                                color="white"
                                onClick={() => downloadImpactTableData()}
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
                            <div id="ImpactTable" />

                            <br />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              Showing 1 to {selectedImpactData.length} of{" "}
                              {selectedImpactData.length} entries
                            </p>
                            <Grid
                              container
                              alignItems="center"
                              spacing={1}
                              style={{ marginTop: "1rem" }}
                            >
                              <Grid item>
                                <MDBox
                                  sx={{
                                    backgroundColor: "#dac292",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "4px",
                                    textAlign: "center",
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  TEXT FIELD
                                </MDBox>
                              </Grid>
                              <Grid item></Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                )}
                {tabValue == 4 && (
                  <>
                    <Card style={{ marginTop: "0.001rem" }}>
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
                              DWTT Details
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Update">
                              <IconButton
                                color="white"
                                onClick={() => confirm(true, "DWTT")}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton
                                color="white"
                                onClick={() => downloadDWTTTableData()}
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
                            <div id="DWTTTable" />

                            <br />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              Showing 1 to {selectedDWTTData.length} of{" "}
                              {selectedDWTTData.length} entries
                            </p>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
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
