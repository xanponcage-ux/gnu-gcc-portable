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
import MonthPicker from "components/DateTime/DatePicker";
import alertify from "alertifyjs";
import "../../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import FormLabel from "@mui/material/FormLabel";
import { GetAuthorization } from "../../../utils";
import routes from "routes";
import axiosAPI from "../../../axiosAPI";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import serverDetails from "../../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import "../../../tabulatorCss.scss";
import MDInput from "components/MDInput";
import { AppBar, Tab, Tabs } from "@mui/material";
import TabIcon from "@mui/icons-material/Tab";
import LDLTS005LD from "./LDLTS005LD";
import LDLTS005ID from "./LDLTS005ID";
import LDLTS005FD from "./LDLTS005FD";
import LDLTS005MD from "./LDLTS005MD";
import LDLTS005GD from "./LDLTS005GD";
import LDLTS005SD from "./LDLTS005SD";
import LDLTS005ED from "./LDLTS005ED";

import { fdHolDetData } from "./LDLTS005FD";
import { gdHolDetData } from "./LDLTS005GD";
import { idHolDetData } from "./LDLTS005ID";
import { mdHolDetData } from "./LDLTS005MD";
import { edHolDetData } from "./LDLTS005ED";
import { sdHolDetData } from "./LDLTS005SD";
import { ldHolDetData } from "./LDLTS005LD";

export default function LDLTS005() {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false); // New state for Save button

  const [plant, setPlant] = useState([]);
  const [holDetData, setHolDetData] = useState({});
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [expandData, setExpandData] = useState(true);
  const [crdate, setcrdate] = useState("");
  const [valueRadio, setValueRadio] = React.useState("1");
  const [filterData, setFilterData] = useState({
    saleOrd: null,
    item: null,
    delCond: null,
  });
  const [salesOrdId, setSalesOrdId] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [dateandshift, setdateandshift] = useState([]);
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [selecteddate, setselecteddate] = React.useState(null);
  const [commonTests, setCommonTests] = useState([]);
  const [commonTestsLoading, setCommonTestsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const ShiftType = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "N", value: "N" },
  ];

  const DateType = [
    { label: "17-May-2026", value: "A" },
    { label: "18-May-2026", value: "B" },
    { label: "19-May-2026", value: "C" },
    { label: "20-May-2026", value: "D" },
    { label: "21-May-2026", value: "E" },
  ];
  //page load
  useEffect(() => {
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      GetAuthorization().then((token) => {
        validateUser(token);
        //page load functions here
        getOrderId(token.accessToken, "1");
      });
    }
    fetchData();
  }, []);

  const validateUser = async (token) => {
    try {
      var plant = "";
      //if (serverDetails.PersonalNo === ``)
      {
        var userDetails = jwt.verify(
          token.refreshToken,
          serverDetails.REFRESH_KEY,
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
      var pageName = "LDLTS005";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken,
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
              "You are authorized to make changes from this page",
            );
          } else {
            setReadWriteAccess(true);
            alertify.error(
              "You are not authorized to make changes from this page",
            );
          }
        } else {
          alertify.error(
            "You are not authorized to make changes from this page",
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
            serverDetails.SCREEN_AUTH_KEY,
          );
          if (authDetails) {
            resolve(authDetails);
          } else {
            reject(null);
          }
        }
      });
    });

  const getOrderId = (accessToken, radioValue) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      let FLAG;
      if (radioValue == "1") FLAG = "L";
      else if (radioValue == "2") FLAG = "F";
      else FLAG = "Y";
      let data = {
        plant: "0780",
        // FLAG: FLAG   // COMMENTED to only take FLAG: 'Y'  THis might be changed later
        FLAG: "Y", /// MIght be changed later
      };
      var url = "api/LDLTS005/getOrderId";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error(
              "Error: " + response?.error?.response?.data?.toString(),
            );
            return;
          } else {
            var items = [];
            console.log(res?.data);
            res?.data?.map((row) => {
              var obj = {
                label: row.LOM_ID_BATCH,
                value: row.LOM_ID_BATCH,
                psno: row.PSNO, // Store PSNO
              };
              items.push(obj);
            });

            setSalesOrdId(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getItemNo = (accessToken, ordId) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        orderId: ordId,
      };
      var url = "api/LDLTS005/getItemNo";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error fetching Data");
            return;
          } else {
            console.log("res.data: ", res.data);
            var items = [];
            res?.data?.map((row) => {
              var obj = new Object();
              obj.label = row.ENC_NO_ITEM;
              obj.value = row.ENC_NO_ITEM;
              items.push(obj);
            });
            setItemData(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getdateandshift = (accessToken, BATCH_ID) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        BATCH_ID: BATCH_ID,
      };

      var url = "api/LDLTS005/getdateandshift";

      let itemsResult = [];

      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error fetching Data");
            return;
          } else {
            console.log("res.data: ", res.data);

            itemsResult = res?.data?.map((row) => ({
              label: row.DATE_FR, // Display DD-MON-YYYY
              value: row.DATE_FR, // Use DD-MON-YYYY for value
              shift: row.SHIFT, // Store shift for filtering
            })) || [];

            setdateandshift(itemsResult);

            if (itemsResult && itemsResult.length > 0) {
              const firstDate = {
                label: itemsResult[0].label,
                value: itemsResult[0].value,
              };

              setselecteddate(firstDate);
              setcrdate(firstDate);

              const firstShift = {
                label: itemsResult[0].shift,
                value: itemsResult[0].shift,
              };

              setSelectedShift(firstShift);
            } else {
              setselecteddate(null);
              setcrdate(null);
              setSelectedShift(null);
            }
          }
        })
        .finally(() => {
          resolve(itemsResult);
        });
    });
  };

  const fetchCommonTests = async (accessToken, batchId, prodDate, shift) => {
    setCommonTestsLoading(true);
    if (!batchId || !prodDate || !shift) {
      setCommonTests([]);
      setCommonTestsLoading(false);
      return;
    }
    try {
      const defaultOptions = {
        headers: { Authorization: "Bearer " + accessToken },
      };
      const data = {
        BATCH_ID: { value: batchId },
        PROD_DATE: prodDate,
        SHIFT: shift,
      };
      const url = "api/LDLTS005/getCommonTests";
      const res = await axiosAPI.post(url, data, defaultOptions);
      if (res.statusText !== "" && res.statusText !== "OK") {
        console.error("Error fetching common tests", res);
        setCommonTests([]);
      } else {
        setCommonTests(res.data || []);
      }
    } catch (error) {
      console.error("fetchCommonTests error", error);
      setCommonTests([]);
    } finally {
      setCommonTestsLoading(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      if (!filterData?.saleOrd?.value || !selecteddate?.value || !selectedShift?.value) {
        setCommonTests([]);
        return;
      }
      const token = await GetAuthorization();
      await fetchCommonTests(
        token.accessToken,
        filterData.saleOrd.value,
        selecteddate.value,
        selectedShift.value,
      );
    };
    run();
  }, [filterData?.saleOrd?.value, selecteddate?.value, selectedShift?.value]);

  // New function to call getcountcheck API and update button state
  const getcountcheckAPI = async (accessToken, batchId, psno, prodDate) => {
    // debugger
    // if (!batchId || !personalNo || !prodDate) {
    if (!batchId) {
      setIsSaveButtonDisabled(false); // Disable if essential data is missing
      // return;
    }
    try {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      const data = {
        orderId: batchId,
        PSNO: psno,
        selecteddate: prodDate,
      };
      const url = "api/LDLTS005/getcountcheck";
      const res = await axiosAPI.post(url, data, defaultOptions);

      if (res.statusText !== "" && res.statusText !== "OK") {
        alertify.error("Error fetching count check data");
        setIsSaveButtonDisabled(true);
      } else {
        const count = res.data?.[0]?.CNT;
        if (count > 0) {
          setIsSaveButtonDisabled(true); // Keep disabled if CNT > 0
        } else if (count < 1) {
          setIsSaveButtonDisabled(false); // Enable if CNT is 0 or less
        }
      }
    } catch (error) {
      console.error("Error checking save button status:", error);
      alertify.error("Error checking save button status.");
      setIsSaveButtonDisabled(true); // Disable on error
    }
  };

  // Effect to trigger checkSaveButtonStatus when Batch ID or Selected Date changes
  useEffect(() => {
    const triggerSaveButtonCheck = async () => {
      // Ensure all necessary data is available
      if (
        filterData?.saleOrd?.value 
        // &&
        // selecteddate?.value &&
        // filterData?.saleOrd?.psno
      ) {
        const token = await GetAuthorization();
        await getcountcheckAPI(
          token.accessToken,
          filterData?.saleOrd?.value,
          filterData?.saleOrd?.psno,
          selecteddate?.value,
        );
      } else {
        // If any required data is missing, disable the button
        // setIsSaveButtonDisabled(true);
      }
    };

    triggerSaveButtonCheck();
  }, [
    filterData?.saleOrd?.value,
    filterData?.saleOrd?.psno,
    selecteddate?.value,
  ]);

  const handleRadioChange = async (event) => {
    setValueRadio(event.target.value);
    // setPipeCreationTableData([]);

    if (event.target.value) {
      await GetAuthorization().then((token) => {
        getOrderId(token.accessToken, event.target.value);
      });
    }
    // selectedEndFacingTable([]);
  };

  // Function for making the API call
  const updateApi = async (newToken = false) => {
    if (newToken) {
      const rsp = await GetAuthorization();
    }
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    console.log(filterData);
    if (filterData === null || filterData === undefined) {
      alertify.error("Please select Batch ID");
      return;
    }

    if (selectedShift === null || selectedShift === undefined) {
      alertify.error("Please select Shift");
      return;
    }

    let activeTabHolDetData = null;

    switch (tabValue) {
      case 0:
        // Lab Test On Coated Pipe
        activeTabHolDetData = fdHolDetData;
        break;

      case 1:
        // Lab Test On 3LPE Coated Pipe
        activeTabHolDetData = gdHolDetData;
        break;

      case 2:
        // Cathodic Disbondment Test
        activeTabHolDetData = idHolDetData;
        break;

      case 3:
        // Adhesive Coated Pipe
        activeTabHolDetData = ldHolDetData;
        break;

      case 4:
        // Field Test-Trial Pipe Report
        activeTabHolDetData = mdHolDetData;
        break;

      case 5:
        // Epoxy & Impact Test
        activeTabHolDetData = sdHolDetData;
        break;

      case 6:
        // Peel & Repair Test
        activeTabHolDetData = edHolDetData;
        break;

      default:
        // Handle invalid tabValue gracefully
        console.error("Invalid tab value! Allowed values are between 0 and 6.");
        return; // Exit the function to prevent unintended behavior
    }
    console.log(activeTabHolDetData);
    setLoading(true);
    //
    console.log(crdate);
    const formatDate = (date) => {
      if (!date) return "";

      return new Date(date)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    };

    const formatDateTime = (dateTime) => {
      if (!dateTime) return "";

      const dt = new Date(dateTime);

      const date = dt
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");

      const time = dt.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      return `${date} ${time}`;
    };
    const formatDateTimeLocal = (value) => {
      if (!value) return "";

      const dt = new Date(value);

      if (isNaN(dt.getTime())) return "";

      return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    };

    const getTimePart = (value) => {
      if (!value) return "";
      return value.substring(11, 16);
    };

    let selectedRowsData = { ...activeTabHolDetData };

    switch (tabValue) {
      // MODAL-LDLTS005FD
      case 0:
        selectedRowsData = {
          ...activeTabHolDetData,

          LCP_SDATE_24H1: formatDateTimeLocal(
            activeTabHolDetData?.LCP_SDATE_24H1,
          ),
          LCP_STIME_24H1: getTimePart(activeTabHolDetData?.LCP_SDATE_24H1),

          LCP_EDATE_24H1: formatDateTimeLocal(
            activeTabHolDetData?.LCP_EDATE_24H1,
          ),
          LCP_ETIME_24H1: getTimePart(activeTabHolDetData?.LCP_EDATE_24H1),
        };
        break;

      // MODAL-LDLTS005 (3LPE)
      case 1:
        selectedRowsData = {
          ...activeTabHolDetData,

          LP3_SDATE_CATH: formatDateTimeLocal(
            activeTabHolDetData?.LP3_SDATE_CATH,
          ),
          LP3_STIME_CATH: getTimePart(activeTabHolDetData?.LP3_SDATE_CATH),

          LP3_EDATE_CATH: formatDateTimeLocal(
            activeTabHolDetData?.LP3_EDATE_CATH,
          ),
          LP3_ETIME_CATH: getTimePart(activeTabHolDetData?.LP3_EDATE_CATH),

          LP3_SDATE_INDT: formatDateTimeLocal(
            activeTabHolDetData?.LP3_SDATE_INDT,
          ),
          LP3_STIME_INDT: getTimePart(activeTabHolDetData?.LP3_SDATE_INDT),

          LP3_EDATE_INDT: formatDateTimeLocal(
            activeTabHolDetData?.LP3_EDATE_INDT,
          ),
          LP3_ETIME_INDT: getTimePart(activeTabHolDetData?.LP3_EDATE_INDT),
        };
        break;

      // MODAL-LDLTS005ID
      case 2:
        selectedRowsData = {
          ...activeTabHolDetData,

          CDT_SDATE_CATH1: formatDateTimeLocal(
            activeTabHolDetData?.CDT_SDATE_CATH1,
          ),
          CDT_STIME_CATH1: getTimePart(activeTabHolDetData?.CDT_SDATE_CATH1),

          CDT_EDATE_CATH1: formatDateTimeLocal(
            activeTabHolDetData?.CDT_EDATE_CATH1,
          ),
          CDT_ETIME_CATH1: getTimePart(activeTabHolDetData?.CDT_EDATE_CATH1),
        };
        break;

      // MODAL-LDLTS005LD
      case 3:
        selectedRowsData = {
          ...activeTabHolDetData,

          ACP_SDATE_48H2: formatDateTimeLocal(
            activeTabHolDetData?.ACP_SDATE_48H2,
          ),
          ACP_STIME_48H2: getTimePart(activeTabHolDetData?.ACP_SDATE_48H2),

          ACP_EDATE_48H2: formatDateTimeLocal(
            activeTabHolDetData?.ACP_EDATE_48H2,
          ),
          ACP_ETIME_48H2: getTimePart(activeTabHolDetData?.ACP_EDATE_48H2),
        };
        break;

      default:
        break;
    }

    const data = {
      selectedRowsData,
      BATCH_ID: filterData?.saleOrd,
      SHIFT: selectedShift?.value,
      DATE_IN: crdate.label,
    };

    // const data = {
    //   // selectedRowsData: formattedData, // Pass the selected tab's data here
    // selectedRowsData: {
    //   ...activeTabHolDetData,
    //   LCP_SDATE_24H1: formatDateTimeLocal(activeTabHolDetData?.LCP_SDATE_24H1),
    //   LCP_EDATE_24H1: formatDateTimeLocal(activeTabHolDetData?.LCP_EDATE_24H1),
    // },
    //   BATCH_ID:filterData?.saleOrd,\
    //   SHIFT:selectedShift?.value, //HIII
    //   DATE_IN: crdate.label
    //   // SHIFTDATE: crdate
    //   // ? crdate
    //   //     .toLocaleDateString("en-GB", {
    //   //       day: "2-digit",
    //   //       month: "short",
    //   //       year: "numeric",
    //   //     })\
    //   //     .replace(/ /g, "-")
    //   //     .replace("Sept", "Sep")
    //   // : "",
    // };
    console.log(data);
    const url = "api/LDLTS005/insertTempData";

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        console.log(response);
        if (response.statusText !== "" && response.statusText !== "OK") {
          alertify.error(
            "Error: " + response?.error?.response?.data?.toString(),
          );
        } else {
          const res = response.data[0];
          if (res === "N") {
            alertify.error("Row Insertion Failed");
          } else if (response?.data?.msg) {
            alertify.error(response?.data?.msg);
          } else {
            alertify.success("Row Inserted Successfully !!!");
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleShiftChange = async (value) => {
    setSelectedShift(value);
    // If Sale Order and Date are selected, fetch common tests immediately
    if (filterData?.saleOrd?.value && selecteddate?.value && value && value.value) {
      const token = await GetAuthorization();
      await fetchCommonTests(token.accessToken, filterData.saleOrd.value, selecteddate.value, value.value);
    }
  };

  const handleDateChange = async (value) => {
    setselecteddate(value);
    setcrdate(value);

    // Determine shifts available for the selected date
    const shiftsForDate = dateandshift.filter((d) => d.value === value?.value);

    // If only one shift exists for that date, auto-select and fetch tests
    if (shiftsForDate && shiftsForDate.length === 1) {
      const firstShift = { label: shiftsForDate[0].shift, value: shiftsForDate[0].shift };
      setSelectedShift(firstShift);
      if (filterData?.saleOrd?.value) {
        const token = await GetAuthorization();
        await fetchCommonTests(token.accessToken, filterData.saleOrd.value, value.value, firstShift.value);
      }
      return;
    }

    // Otherwise clear selected shift to force user selection
    setSelectedShift(null);

    // If user already had a shift selected that matches the new date, keep it and fetch
    if (filterData?.saleOrd?.value && selectedShift && shiftsForDate.some(s => s.shift === selectedShift.value)) {
      const token = await GetAuthorization();
      await fetchCommonTests(token.accessToken, filterData.saleOrd.value, value.value, selectedShift.value);
    }
  };

  const handlesalesOrdChange = async (e) => {
    // Update state with sale order and reset item
    setFilterData((prevState) => ({
      ...prevState,
      saleOrd: e,
      item: null, // Reset item when saleOrd is changed
    }));

    if (e) {
      const token = await GetAuthorization();
      // Fetch item list
      await getItemNo(token.accessToken, e.value);

      // Fetch date & shift and use the returned items to fetch common tests immediately
      const items = await getdateandshift(token.accessToken, e.value);

      if (items && items.length > 0) {
        const prodDate = items[0].value;
        const shiftVal = items[0].shift;
        await fetchCommonTests(token.accessToken, e.value, prodDate, shiftVal);
      } else {
        setCommonTests([]);
      }
    } else {
      // If e is null, reset both saleOrd and item to null
      handleClearAll(); // Clear all related filters and disable button
    }
  };

  const handleItemChange = (e) => {
    setFilterData((prevState) => ({
      ...prevState,
      item: e,
    }));
    if (e === null) {
      handleClearAll();
      return;
    }
  };

  const handleDelCondChange = (e) => {
    setFilterData({ ...delCond, delCond: e.target.value.toUpperCase() });
  };

  const handleClearAll = () => {
    // setSelectedPlant([]);
    setFilterData({
      saleOrd: null,
      item: null,
      delCond: null,
    });
    setSalesOrdId([]);
    setItemData([]);
    setdateandshift([]);
    setSelectedShift(null);
    setselecteddate(null);
    setcrdate(""); // Clear crdate as well
    setIsSaveButtonDisabled(false); // Disable the save button
    // Any other state clearing
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Quality"
        page="Lab Test(External)"
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
                          Filter
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleClearAll()} // Removed `true` as it's not used
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  {/* {expandData && ( */}
                  <MDBox px={3} py={1}>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={2.75}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Batch Id
                              </MDTypography>
                            </Grid>
                            <Grid item xs={8}>
                              <ReactSelect
                                id="saleOrd"
                                options={salesOrdId}
                                onChange={handlesalesOrdChange}
                                value={filterData?.saleOrd}
                                style={{ marginLeft: "8px" }}
                                // Add this prop to render the dropdown menu directly into the document body.
                                // This helps prevent z-index and overflow issues with parent containers.
                                menuPortalTarget={document.body}
                                // Optionally, you can also apply a high z-index to the menu portal itself
                                // if other elements on the page also use high z-indices.
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        {/* <Grid item xs={12} md={2}>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Date<span style={{ color: "red" }}>*</span>
                            </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                            <MonthPicker
                              name="crdate"
                              value={crdate}
                              onChange={(date) => setcrdate(date)}
                            />
                          </Grid>
                        </Grid>
                      </Grid> */}
                        <Grid item xs={12} md={2.5}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={2.5} style={{ zIndex: 5 }}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                noWrap
                              >
                                Date<span style={{ color: "red" }}>*</span>
                              </MDTypography>
                            </Grid>
                            <Grid item xs={9.5} style={{ zIndex: 5 }}>
                              <ReactSelect
                                options={dateandshift
                                  .filter(
                                    (d, i, self) =>
                                      self.findIndex(
                                        (t) => t.value === d.value,
                                      ) === i,
                                  ) // Filter unique dates
                                  .map((d) => ({
                                    label: d.label,
                                    value: d.value, // obj.date = row.DATE_FR
                                  }))}
                                onChange={handleDateChange}
                                value={selecteddate}
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={1.75}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={4} style={{ zIndex: 5 }}>
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
                            </Grid>
                            <Grid item xs={8} style={{ zIndex: 5 }}>
                              <ReactSelect
                                options={dateandshift
                                  .filter(
                                    (d) => d.value === selecteddate?.value,
                                  )
                                  .map((d) => ({
                                    label: d.shift,
                                    value: d.shift, // obj.value = row.SHIFT
                                  }))}
                                onChange={handleShiftChange}
                                value={selectedShift}
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={5}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={4}>
                              <MDButton
                                // style={{ marginTop: "1.5rem" }}
                                size="small"
                                color="info"
                                onClick={() => updateApi(false)} // Call API
                                style={{
                                  marginTop: "-2rem",
                                  fontSize: "0.9rem",
                                  marginLeft: "2rem",
                                }}
                                disabled={isSaveButtonDisabled} // Apply the disabled state here
                              >
                                Save
                              </MDButton>
                            </Grid>
                            <Grid item xs={8}>
                              <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label-Test-Method">
                                  Test Method
                                </FormLabel>
                                <RadioGroup
                                  row
                                  aria-labelledby="demo-row-radio-buttons-group-label-Test-Method"
                                  name="row-radio-buttons-group-Test-Method"
                                  value={valueRadio}
                                  disabled={true} // Corrected prop: disable the entire group
                                  onChange={handleRadioChange}
                                  noWrap
                                >
                                  <FormControlLabel
                                    value="1" // Changed to string to match event.target.value
                                    control={<Radio />}
                                    label="LAB Test"
                                  />
                                  <FormControlLabel
                                    value="2" // Changed to string
                                    control={<Radio />}
                                    label="Field Test"
                                  />
                                  <FormControlLabel
                                    value="3" // Changed to string
                                    control={<Radio />}
                                    label="Both"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                        {/* Common tests table - vertical list (code + name) */}
<Grid item xs={12} md={12}>
  <div style={{ overflowX: "auto", marginTop: "0px" }}> 
    {commonTestsLoading && (
      <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "6px" }}>
        Loading tests...
      </div>
    )}
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "420px",
        fontSize: "0.85rem",
      }}
    >
      <tbody>
        {commonTests && commonTests.length > 0 ? (
          commonTests.map((row, idx) => (
            <tr key={idx} style={{ verticalAlign: "middle", lineHeight: 1.2 }}>
              {/* First Column: Shortened to minimum content width */}
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "6px 12px",
                  whiteSpace: "nowrap",
                  verticalAlign: "middle",
                  fontWeight: 600,
                  width: "1%", // Forces the column to shrink to its content
                  backgroundColor: "#f5f5f5", // Optional: slight background to distinguish label
                }}
              >
                {row.ELF_TEST_CODE}
              </td>
              {/* Second Column: Takes remaining space */}
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "6px 8px",
                  verticalAlign: "middle",
                  wordBreak: "break-word",
                }}
              >
                {(row.ELF_TEST_NAME || "").split("/").map((part, i, arr) => {
                  const t = (part || "").trim();
                  const isRed = t.startsWith("$");
                  const text = isRed ? t.slice(1) : t;
                  return (
                    <span
                      key={i}
                      style={{ color: isRed ? "red" : "inherit", marginRight: 6 }}
                    >
                      {text}
                      {i < arr.length - 1 ? " /" : ""}
                    </span>
                  );
                })}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2} style={{ padding: "6px 8px" }}>
              No tests
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</Grid>

                      </Grid>
                    </Grid>
                  </MDBox>
                  {/* )} */}
                </Card>
              </Grid>
            </Grid>
            <Grid margin={1.5}></Grid>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab label="Coated Pipe" disabled={valueRadio === "2"} />
                    <Tab
                      label="3LPE Coated Pipe"
                      disabled={valueRadio === "2"}
                    />
                    <Tab
                      label="Cathodic Disbondment Test"
                      disabled={valueRadio === "2"}
                    />
                    <Tab
                      label="Adhesive Coated Pipe"
                      disabled={valueRadio === "2"}
                    />
                    <Tab
                      label="Field Test-Trial Pipe Report"
                      disabled={valueRadio === "1"}
                    />
                    <Tab
                      label="Epoxy & Impact Test"
                      disabled={valueRadio === "1"}
                    />
                    <Tab
                      label="Peel & Repair Test"
                      disabled={valueRadio === "1"}
                    />
                    {/* <Tab label="Coating Process Sheet" disabled={valueRadio === "1"} /> */}
                  </Tabs>
                </AppBar>
              </Grid>

              {(valueRadio === "3" || valueRadio === "1") && (
                <>
                  {tabValue <= 3 && (
                    <>
                      {tabValue === 0 && (
                        <LDLTS005FD
                          ordId={filterData?.saleOrd?.value ?? ""}
                          itemNo={filterData?.item?.value ?? ""}
                        />
                      )}
                      {tabValue === 1 && (
                        <LDLTS005GD
                          ordId={filterData?.saleOrd?.value ?? ""}
                          itemNo={filterData?.item?.value ?? ""}
                        />
                      )}
                      {tabValue === 2 && (
                        <LDLTS005ID
                          ordId={filterData?.saleOrd?.value ?? ""}
                          itemNo={filterData?.item?.value ?? ""}
                        />
                      )}
                      {tabValue === 3 && (
                        <LDLTS005LD
                          ordId={filterData?.saleOrd?.value ?? ""}
                          itemNo={filterData?.item?.value ?? ""}
                        />
                      )}
                    </>
                  )}
                </>
              )}

              {(valueRadio === "3" || valueRadio === "2") && (
                <>
                  {tabValue >= 4 && (
                    <>
                      {tabValue === 4 && (
                        <LDLTS005MD
                          ordId={filterData?.saleOrd?.value ?? ""}
                          itemNo={filterData?.item?.value ?? ""}
                        />
                      )}
                      {tabValue === 5 && (
                        <LDLTS005SD
                          ordId={filterData?.saleOrd?.value ?? ""}
                          itemNo={filterData?.item?.value ?? ""}
                        />
                      )}
                      {tabValue === 6 && (
                        <LDLTS005ED
                          ordId={filterData?.saleOrd?.value ?? ""}
                          itemNo={filterData?.item?.value ?? ""}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
