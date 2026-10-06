import React, { useEffect, useState, useRef, forwardRef } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
// import Typography from '@mui/material/Typography';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ReactSelect from "components/Select/ReactSelect";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import alertify from "alertifyjs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { DateTime } from "luxon";
window.DateTime = DateTime;
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import Today from "@mui/icons-material/Today";
import MultipleSelect from "components/Select/MultiSelect";
import { GetAuthorization } from "../../utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function LDSM001() {
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [bUnit, setBunit] = React.useState([]);
  const [selectStatus, setSelectStatus] = React.useState([]);
  const [chemError, setChemError] = useState(true);
  const [getCustomerTable, setCustomerTable] = React.useState([]);
  const [getDeviationFromBOMTable, setDeviationFromBOMTable] = React.useState(
    []
  );
  const [getOrderTable, setOrderTable] = React.useState([]);
  const [selectedCustomerTable, setSelectedCustomerTable] = useState(null);
  const [selectedDeviationTable, setSelectedDeviationTable] = useState(null);
  const [selectedOrderTable, setSelectedOrderTable] = useState(null);
  const [SelectedChemMatchingTable, setSelectedChemMatchingTable] =
    useState(null);

  const [ordDtFrm, setOrdDtFrm] = useState(null);
  const [ordDtTo, setOrdDtTo] = useState(null);

  var customerTable = React.createRef();
  //   var selectedOrderFromList;
  //   var selectedItemFromList;
  const [selectedOrderFromList, setSelectedOrderFromList] = useState([]);
  const [selectedItemFromList, setSelectedItemFromList] = useState([]);
  const [allValues, setAllValues] = useState({
    orderId: "",
    item: "",
    thickFrom: "",
    thickTo: "",
    grade: "",
    length: "",
  });

  const [thickValue, setThickValue] = useState({
    from: [],
    to: [],
  });
  const [lengthValue, setLengthValue] = useState({
    from: [],
  });
  const [odiaValue, setOdiaValue] = useState({
    from: [],
  });
  const [idiaValue, setIdiaValue] = useState({
    from: [],
  });
  const [dOdiaValue, setDOdiaValue] = useState({
    from: [],
  });
  const [dIdiaValue, setDIdiaValue] = useState({
    from: [],
  });
  const [thickData, setThickData] = useState([]);
  const [odiaData, setOdiaData] = useState([]);
  const [dOdiaData, setDOdiaData] = useState([]);
  const [lengthData, setLengthData] = useState([]);
  const [idiaData, setIdiaData] = useState([]);
  const [dIdiaData, setDIdiaData] = useState([]);
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState([]);

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const [allValuesDeAllot, setAllValuesDeAllot] = useState({
    orderId: "",
    item: "",
    orderType: "",
    odia: "",
    idia: "",
  });
  const [deAllotData, setDeAllotData] = useState([]);
  const [deAllotDataTable, setDeAllotDataTable] = useState(null);
  const [chemSelectionBom, setChemSelectionBom] = useState([]);
  const [chemSelectionNBom, setChemSelectionNBom] = useState([]);
  const [chemData, setChemData] = useState([]);
  const [chemBlock, setChemBlock] = useState(false);

  const handleChangeDeAllot = (e) => {
    setAllValuesDeAllot({
      ...allValuesDeAllot,
      [e.target.name]: e.target.value,
    });
  };

  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const [invoiceNoCount, setInvoiceNoCount] = useState({});

  const [btpAllot, setBtpAllot] = useState(0);
  const [finalnetWtAllotM, setFinalnetWtAllotM] = useState(0);
  const [finalnetWtAllotD, setFinalnetWtAllotD] = useState(0);
  var netWtAllotM = 0,
    netWtAllotD = 0;
  const [selectedOrder, setSelectedOrder] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);
  const [toggleBtn, setToggleBtn] = useState(false);
  const [isClicked, setIsClicked] = useState(true);
  const [delayBreakTable, setDelayBreakTable] = React.useState(null);

  var coilsMatchingBOM = [];

  const status = [
    { label: "VA RM in Transit from Mother Mill", value: "VA" },
    { label: "PR Processed/Consumed RM Stock", value: "PR" },
    { label: "VF Free RM Stock Waiting for processing", value: "VF" },
    { label: "WL Despatched", value: "WL" },
    { label: "VB RM Stock Linked to Order", value: "VB" },
    { label: "VF+VB Waiting for processing", value: "VFVB" },
    { label: "VB Dispatchable in Mother Mill", value: "VB" },
    { label: "VC Stock Loaded on Vehicle At Mother Mill", value: "VC" },
  ];

  const [selectedLinkingType, setSelectLinkingType] = React.useState({
    label: "RM Free Stock",
    value: "1",
  });

  const linkingType = [
    { label: "RM Free Stock", value: "1" },
    { label: "WIP Free Stock", value: "2" },
  ];

  const [selectedOrderType, setSelectOrderType] = React.useState([]);
  const [orderType, setOrderType] = useState(0);

  const getOrderType = async (accessToken) => {
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
      var url = "api/LDSM001/getOrderType";
      axiosAPI.post(url, data, defaultOptions).then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row[0];
            obj.value = row[0];
            items.push(obj);
          });
          setOrderType(items);
          //setSelectedOrderType(items[0]);
          Promise.all([
            //getOdia(items[0], accessToken)
          ]).finally(() => {
            resolve();
          });
        }
      });
    });
  };
  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization()
      .then((data) => {
        validateUser(data.accessToken, data.refreshToken);
        //page load functions here
        Promise.all([
          getGroupPlantId(data.accessToken),
          getOrderType(data.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      })
      .catch((e) => {
        alertify.error(e);
      });
  }

  //page load
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (
      SelectedChemMatchingTable === null &&
      chemData?.length > 0 &&
      isClicked
    ) {
      setSelectedChemMatchingTable(
        new Tabulator("#selChemMatchingTableF", {
          data: chemData,
          columns: chemMatchingBOMColumn,
          height: 200,
          layout: "fitDataFill",
        })
      );
    }
    if (
      SelectedChemMatchingTable === null &&
      chemData?.length > 0 &&
      !isClicked
    ) {
      setSelectedChemMatchingTable(
        new Tabulator("#selChemMatchingTableH", {
          data: chemData,
          columns: chemMatchingBOMColumn,
          height: 200,
          layout: "fitDataFill",
        })
      );
    }
  }, [chemData, isClicked]);

  const resetFilter = (plant, accessToken, stopLoader) => {
    return new Promise((resolve) => {
      setThickValue({
        from: [],
        to: [],
      });
      setLengthValue({
        from: [],
      });
      setOdiaValue({
        from: [],
      });
      setIdiaValue({
        from: [],
      });
      setDOdiaValue({
        from: [],
      });
      setDIdiaValue({
        from: [],
      });
      setThickData([]);
      setOdiaData([]);
      setDOdiaData([]);
      setLengthData([]);
      setIdiaData([]);
      setDIdiaData([]);
      if (plant) {
        if (stopLoader !== false) {
          setLoading(true);
        }
        if (accessToken) {
          Promise.all([getOdia(plant, accessToken)]).finally(() => {
            if (stopLoader !== false) {
              setLoading(false);
            }
            resolve();
          });
        } else {
          if (stopLoader !== false) {
            setLoading(true);
          }
          GetAuthorization().then((data) => {
            Promise.all([getOdia(plant, data.accessToken)]).finally(() => {
              if (stopLoader !== false) {
                setLoading(false);
              }
              resolve();
            });
          });
        }
      } else {
        resolve();
      }
    });
  };

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
      var pageName = "LDSM001";

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

  const getScreenAuth = (plantCd, userId, pageName, accessToken) => {
    return new Promise((resolve, reject) => {
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
  };

  const getGroupPlantId = async (accessToken) => {
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
      axiosAPI.post(url, data, defaultOptions).then((response) => {
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
          Promise.all([getOdia(items[0], accessToken)]).finally(() => {
            resolve();
          });
        }
      });
    });
  };

  const handlePlantChangeDeAllot = (e) => {
    setSelectedPlant(e);
    if (e) {
      setAllValuesDeAllot({});
      setCustomerTable([]);
      setDeAllotData([]);
      setDeAllotDataTable(null);
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          resetFilter(e, data.accessToken, false),
          getBusinessCd(e, data.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    } else {
      resetFilter();
    }
  };

  const handleLinkingTypeChange = (value) => {
    setSelectLinkingType(value);
    setCustomerTable([]);
    setChemData([]);
    setChemSelectionBom([]);
    setChemSelectionNBom([]);
    setDeviationFromBOMTable([]);
    setFinalnetWtAllotD(0);
    setFinalnetWtAllotM(0);
    netWtAllotD = 0;
    netWtAllotM = 0;
    setBtpAllot(0);
  };

  const handlePlantChange = (value) => {
    setSelectedPlant(value);
    setCustomerTable([]);
    setOrderTable([]);
    setDeviationFromBOMTable([]);
    setSelectStatus([]);
    setAllValues({});
    setOrdDtFrm(null);
    setOrdDtTo(null);
    setSelectedCustomerTable(null);
    setSelectedOrderTable(null);
    setSelectedDeviationTable(null);
    setFinalnetWtAllotD(0);
    setFinalnetWtAllotM(0);
    netWtAllotD = 0;
    netWtAllotM = 0;
    setBtpAllot(0);
    setSelectedOrder(0);
    setSelectedItem(0);
    setChemData([]);
    setChemSelectionBom([]);
    setChemSelectionNBom([]);
    if (value) {
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([
          resetFilter(value, token.accessToken, false),
          getBusinessCd(value, token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    } else {
      resetFilter();
    }
  };
  const handleOrderTypeChange = (value) => {
    setSelectOrderType(value);
    setOrderTable([]);
    setCustomerTable([]);
    setChemData([]);
    setChemSelectionBom([]);
    setChemSelectionNBom([]);
    setDeviationFromBOMTable([]);
    setFinalnetWtAllotD(0);
    setFinalnetWtAllotM(0);
    netWtAllotD = 0;
    netWtAllotM = 0;
    setBtpAllot(0);
  };

  const getBusinessCd = (value, accessToken) => {
    return new Promise((resolve) => {
      let data = {
        plant: value.value,
      };

      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      axiosAPI
        .post("api/LDSM007/getBUnitCd", data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[1];
              obj.value = row[0];
              items.push(obj);
            });
            setBunit(items[0]);
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const searchCoilsBOM = () => {
    return new Promise((resolve) => {
      if (selectedPlant.value != undefined) {
        var selectedRows = selectedOrderTable?.getSelectedRows();
        var newData = [];
        var tempArr = [];
        var flag = false;

        if (selectedRows.length == 0 && getOrderTable.length == 0) {
          alertify.error("No data available in the screen for linking");
          resolve();
          return;
        }

        if (selectedRows.length == 0) {
          alertify.error("No Rows Selected");
          resolve();
          return;
        }

        var url = "";
        if (selectedLinkingType?.value == "1") {
          url = "api/LDSM001/getCoils";
        } else {
          url = "api/LDSM001/getWIPCoilsMatchingWithBOM";
        }

        selectedRows.forEach(function (item) {
          var data = {
            Plant: selectedPlant.value ? selectedPlant.value : "",
            Order: item._row.data.ENC_ID_ORDER,
            Item: item._row.data.ENC_NO_ITEM,
            Thick: item._row.data.THICK,
            Odia: item._row.data.WIDTH,
            OrdTdc: item._row.data.TDC,
            sfgMAT: item._row.data.TMM_SFG_MAT,
            FGMat : item._row.data.FG_MATERIAL,
          };

          setBtpAllot(parseFloat(item._row.data.BTS));
          // setBtpAllot(5);

          setSelectedOrder(item._row.data.ENC_ID_ORDER);
          setSelectedItem(item._row.data.ENC_NO_ITEM);
          // selectedOrderFromList = data.Order;
          // selectedItemFromList = data.Item;
          setSelectedOrderFromList(data.Order);
          setSelectedItemFromList(data.Item);

          GetAuthorization().then((token) => {
            var defaultOptions = {
              headers: {
                Authorization: "Bearer " + token.accessToken,
              },
            };
            axiosAPI
              .post(url, data, defaultOptions)
              .then((response) => {
                if (response.statusText != "" && response.statusText != "OK") {
                  alertify.error("No Data Found");
                } else {
                  if (response.data.length == 0) {
                    alertify.error("No Data Found for coils matching with BOM");
                    setCustomerTable([]);
                    setSelectedCustomerTable(null);
                  } else {
                    setSelectedCustomerTable(null);
                    setCustomerTable(response.data);

                    coilsMatchingBOM = response.data;
                  }
                }
              })
              .finally((f) => {
                resolve();
              });
          });
        });
      } else {
        alertify.error("No data available in the screen for receiving");
        resolve();
      }
    });
  };

  const searchCoilsDeviationBOM = () => {
    return new Promise((resolve) => {
      if (selectedLinkingType.value == "1") {
        setFinalnetWtAllotD(0);
        setFinalnetWtAllotM(0);
        netWtAllotD = 0;
        netWtAllotM = 0;
        setCustomerTable([]);
        setDeviationFromBOMTable([]);
        if (selectedPlant.value != undefined) {
          var selectedRows = selectedOrderTable?.getSelectedRows();
          var newData = [];
          var tempArr = [];
          var flag = false;

          if (selectedRows.length == 0 && getOrderTable.length == 0) {
            alertify.error("No data available in the screen for linking");
            return;
          }

          if (selectedRows.length == 0) {
            alertify.error("No Rows Selected");
            return;
          }

          var url = "";

          url = "api/LDSM001/getCoilsDeviationFromBOM";

          selectedRows.forEach(function (item) {
            var data = {
              Plant: selectedPlant.value ? selectedPlant.value : "",
              Order: item._row.data.ENC_ID_ORDER,
              Item: item._row.data.ENC_NO_ITEM,
              sfg_mate: item._row.data.TMM_SFG_MAT,
            };

            setLoading(true);
            GetAuthorization().then((token) => {
              var defaultOptions = {
                headers: {
                  Authorization: "Bearer " + token.accessToken,
                },
              };
              Promise.all([
                axiosAPI.post(url, data, defaultOptions),
                searchCoilsBOM(),
              ])
                .then(([response]) => {
                  if (
                    response.statusText != "" &&
                    response.statusText != "OK"
                  ) {
                    alertify.error("No Data Found");
                  } else {
                    if (response.data.length == 0) {
                      alertify.error(
                        "No Data Found for Coil deviation from BOM"
                      );
                    } else if (response.data.length > 0) {
                      setSelectedDeviationTable(null);
                      setDeviationFromBOMTable(response.data);
                    }
                  }
                })
                .finally((f) => {
                  resolve();
                  setLoading(false);
                });
            });
          });
        } else {
          resolve();
          alertify.error("No data available in the screen for receiving");
        }
      } else {
        setLoading(true);
        Promise.all([searchCoilsBOM()]).finally(() => {
          setLoading(false);
        });
        resolve();
      }
    });
  };

  const linkCoil = () => {
    if (selectedPlant.value != undefined) {
      var selectedRowsMatch, selectedRowsDevi;
      selectedRowsMatch = selectedCustomerTable?.getSelectedRows();
      selectedRowsDevi = selectedDeviationTable?.getSelectedRows();
      var selectedRows = selectedOrderTable?.getSelectedRows();

      if (
        selectedRowsMatch?.length === 0 &&
        selectedRowsDevi?.length === 0 &&
        selectedRows?.length == 0
      ) {
        alertify.error("Please select a row from table.");
        return;
      }
      let allotedQntChq = true;
      var selectedDataMatch = [],
        coilsoutisderange = [];
      selectedRowsMatch?.forEach(function (item) {
        if (item._row.data.MASS < item._row.data.MASS) {
          allotedQntChq = false;
        }
        if (
          item._row.data.MASS1 <
          (item._row.data.BTP_T != undefined
            ? item._row.data.BTP_T
            : item._row.data.MASS1)
        ) {
          coilsoutisderange.push(item._row.data.BATCH_ID);
        }
        selectedDataMatch.push({
          BATCH_ID: item._row.data.BATCH_ID,
          BTP_T:
            item._row.data.BTP_T != undefined
              ? item._row.data.BTP_T
              : item._row.data.MASS1,
        });
      });

      var selectedDataDevi = [];
      selectedRowsDevi?.forEach(function (item) {
        if (item._row.data.MASS < item._row.data.MASS) {
          allotedQntChq = false;
        }
        if (
          item._row.data.MASS <
          (item._row.data.BTP_T != undefined ? item._row.data.BTP_T : btpAllot)
        ) {
          coilsoutisderange.push(item._row.data.BATCH_ID);
        }

        selectedDataDevi.push({
          BATCH_ID: item._row.data.BATCH_ID,
          REMARKS: item._row.data.REMARKS,
          BTP_T:
            item._row.data.BTP_T != undefined
              ? item._row.data.BTP_T
              : item._row.data.MASS1,
        });
      });

      if (selectedDataMatch?.length === 0 && selectedDataDevi?.length === 0) {
        alertify.error("Please select a row from table.");
        return;
      }

      if (!allotedQntChq) {
        alertify.error("Coils greater than Net Wt.!");
        return;
      }

      var data = {
        plant: selectedPlant.value ? selectedPlant.value : "",
        order: selectedOrderFromList,
        item: selectedItemFromList,
        selectedDataDevi: selectedDataDevi,
        selectedDataMatch: selectedDataMatch,
        allotedQty: (
          Number(finalnetWtAllotM) + Number(finalnetWtAllotD)
        ).toFixed(3),
        btp: btpAllot,
        sfgMaterial: selectedRows[0]._row.data.TMM_SFG_MAT,
      };

      if (data.allotedQty > btpAllot) {
        alertify.error(
          "Alloted Qty should not be greater than Balance to Plan"
        );
        return;
      }

      setLoading(true);
      var url = "api/LDSM001/linkCoils";
      setLoading(true);
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            var msg = "";

            var results = response.data;
            if (response.statusText != "" && response.statusText != "OK") {
              setLoading(false);
            } else {
              if (response.data.res_n.length == 0) {
                msg = "All Coil/Batch linked successfully";
                alertify.success(msg);
                setSelectedOrder(0);
                setSelectedItem(0);
                setCustomerTable([]);
                setDeviationFromBOMTable([]);
                // getOrdersBtnSubmit(token.accessToken, {
                //   ENC_NO_ITEM: selectedItem,
                //   ENC_ID_ORDER: selectedOrder,
                // });
                getOrdersBtnSubmit();
                setChemData([]);
              } else {
                msg = response.data.res_n[0];
                alertify.error(msg);
                setLoading(false);
              }
            }
          })
          .catch(() => {
            setLoading(false);
          })
          .finally((f) => {
            setFinalnetWtAllotD(0);
            setFinalnetWtAllotM(0);
            netWtAllotD = 0;
            netWtAllotM = 0;
            setBtpAllot(0);
          });
      });
    } else {
      alertify.error("No data available in the screen for receiving");
    }
  };

  const updateDeAllotData = async () => {
    if (selectedPlant.value != undefined) {
      var selectedRows = deAllotDataTable?.getSelectedRows();

      var selectedData = [];
      selectedRows.forEach(function (item) {
        selectedData.push(item._row.data);
      });

      var data = {
        personalNo: serverDetails.PersonalNo,
        selectedData: selectedData,
      };

      var url = "api/LDSM001/updatedeallot";

      setLoading(true);
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            var msg = "";
            if (response.statusText != "" && response.statusText != "OK") {
            } else {
              if (response.data.res_n.length == 0) {
                msg = "All Coil/Batch Delinked successfully";
                setBtpAllot(0);
              } else {
                setBtpAllot(0);
                msg += "Coil ID : ";
                response.data.res_n.map((val) => {
                  msg += val.toString() + ", ";
                });
                if (response.data.res_y.length == 0) {
                  msg += "failed.";
                } else {
                  msg += " failed and rest are successful.";
                }
              }
              alertify.success(msg);
              getDeAllotData();
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    } else {
      alertify.error("No data available in the screen for receiving");
    }
  };

  const getOrdersBtnSubmit = (accessToken, dtData) => {
    if (selectedPlant == null) {
      setOrderTable([]);
      alertify.error("Please select Plant");
      return;
    }

    if (selectedPlant.value == undefined) {
      setOrderTable([]);
      alertify.error("Please Select Plant");
      return;
    }

    setSelectedCustomerTable(null);
    setSelectedOrderTable(null);
    setSelectedDeviationTable(null);

    setCustomerTable([]);
    setDeviationFromBOMTable([]);

    setFinalnetWtAllotD(0);
    setFinalnetWtAllotM(0);
    netWtAllotD = 0;
    netWtAllotM = 0;
    setBtpAllot(0);
    setSelectedOrder(0);
    setSelectedItem(0);

    var url = "api/LDSM001/getOrders";
    var data = {
      Plant: selectedPlant.value ? selectedPlant.value : "",
      Order: dtData
        ? dtData.ENC_ID_ORDER
        : allValues.orderId
        ? allValues.orderId
        : "",
      Item: dtData ? dtData.ENC_NO_ITEM : allValues.item ? allValues.item : "",
      //OrderType: allValues.orderType ? allValues.orderType : "",
      OrderType: selectedOrderType.value ? selectedOrderType.value : "",
      Odia: odiaValue?.from ? odiaValue.from : "",
      Idia: idiaValue?.from ? idiaValue.from : "",
      OrderCreateFrom: ordDtFrm
        ? ordDtFrm
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "",
      OrderCreateTo: ordDtTo
        ? ordDtTo
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "",
      ThickFrom: thickValue?.from ? thickValue.from : "",
      ThickTo: thickValue?.to ? thickValue.to : "",
      Grade: allValues.grade ? allValues.grade : "",
      Length: lengthValue?.from ? lengthValue.from : "",
    };
    setLoading(true);
    if (accessToken) {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("No Data Found");
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setOrderTable([]);
            } else {
              setSelectedOrderTable(null);
              let varData = dtData ? [...getOrderTable] : response.data;
              setOrderTable([]);
              if (dtData) {
                varData?.forEach((x) => {
                  if (
                    x.ENC_ID_ORDER === dtData.ENC_ID_ORDER &&
                    x.ENC_NO_ITEM === dtData.ENC_NO_ITEM
                  ) {
                    x = response.data[0];
                  }
                });
              }
              setOrderTable(varData);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };

        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
              alertify.error("No Data Found");
            } else {
              if (response.data.length == 0) {
                alertify.error("No Data Found");
                setOrderTable([]);
              } else {
                setSelectedOrderTable(null);
                setOrderTable(response.data);
              }
            }
          })
          .finally(() => {
            setLoading(false);
          });
      });
    }
  };

  const getDeAllotData = async (newToken = false) => {
    if (selectedPlant.value == undefined) {
      alertify.error("Please Select Plant");
      return;
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LDSM001/getdeallotdata";

      var data = {
        plant: selectedPlant.value ? selectedPlant.value : "",
      };

      data = { ...data, ...allValuesDeAllot };
      data.odia = dOdiaValue?.from;
      data.idia = dIdiaValue?.from;

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("No Data Found");
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              // setOrderTable([]);
              setDeAllotData([]);
            } else {
              setDeAllotDataTable(null);
              setDeAllotData(response.data);
              // setOrderTable(response.data);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const options = {
    height: 400,
    pagination: "local",
    paginationSize: 200,
    // layout: "fitDataFill",
    downloadDataFormatter: (data) => data,
    downloadReady: (fileContents, blob) => blob,
    // responsiveLayout:"collapse",
    // responsiveLayoutCollapseStartOpen:false,
  };

  var deAllotColumn = [
    {
      formatter: "rowSelection",
      //titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    
    {
      title: "Batch Id",
      field: "BATCH_ID",
      headerFilter: "input",
      width: 100,
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Current Proc",
      field: "CURRENT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "EPA_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No.",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Desc.",
      field: "MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Alloted Qty(MT)",
      field: "ALLOTED_MASS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },

    {
      title: "Net Wt.(MT)",
      field: "MASS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
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
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Odia/Width",
      field: "ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Length",
      field: "LEN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Idia",
      field: "IDIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Order",
      field: "PREV_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "PREV_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Qty",
      field: "ORD_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          // return value;
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Balance to Plan(MT)",
      field: "BTS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Prod Cd",
      field: "PROD_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Tdc / Grade",
      field: "TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qlty Cd",
      field: "LOM_CD_QLTY_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Created On",
      field: "CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material Description",
      field: "FG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG Material",
      field: "SFG_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG Description",
      field: "SFG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Description",
      field: "RM_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Customer Name",
      field: "CUSTOMER_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  var orderDetailsColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    {
      title: "Customer Name",
      field: "SOLD_CUST_NM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mark Customer Name",
      field: "ENC_MARK_CUST_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Id",
      field: "ENC_ID_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item No",
      field: "ENC_NO_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No",
      field: "FG_MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Desc.",
      field: "FG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //     title: "WIP Qty.",
    //     field: "WIP_QTY",
    //     headerFilter: "input",
    //     headerFilterPlaceholder: "search...",
    //     formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             // return value.toFixed(3);
    //             return value;
    //         }
    //         return value;
    //     },
    //},

    {
      //title: "Order Qty(MT)",
      title: "Order Qty.(TON)",
      // field: "ENC_ORD_QUANTITY",
      field: "ORDER_QTY_MT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          // return value;
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      //title: "Balance to Produce(MT)",
      title: "Balance to Plan(MT)",
      field: "BTS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "FG(KG)",
      field: "FG_STOCK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "WIP(KG)",
      field: "WIP_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
          //return value;
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "BTF(TON)",
      field: "BTF",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      tooltip: "Order Qty - FG",
      formatter: function (cell, formatterParams) {
        var data = cell.getData();
        // Order qty - ( FG/1000)
        // var value = data.ORD_QTY - ((data.FG_KG/1000));
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },

      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "BTR(TON)",
      field: "BTR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      tooltip: "Order Qty - ( FG + WIP )",
      formatter: function (cell, formatterParams) {
        var data = cell.getData();
        // Order qty - ( FG/1000 + WIP/1000 )
        // var value = data.ORD_QTY - ((data.FG_KG/1000) + (data.WIP_KG/1000));
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },

      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    // {
    //   title: "Free Qty(MT)",
    //   field: "FREESTOCK_QTY",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       //return value.toFixed(3);
    //       return value;
    //     }
    //     return value;
    //   },
    //   cellClick: function (e, cell) {
    //     // var element = cell.getElement();
    //     // var chkbox = element.querySelector('.select-row');

    //     var OrderNo = cell.getData().ENC_ID_ORDER;
    //     var Item = cell.getData().ENC_NO_ITEM;
    //     setSelectedOrder(OrderNo);
    //     setSelectedItem(Item);

    //     setCustomerTable([]);
    //     setDeviationFromBOMTable([]);

    //     setFinalnetWtAllotD(0);
    //     setFinalnetWtAllotM(0);
    //     netWtAllotD = 0;
    //     netWtAllotM = 0;
    //     setBtpAllot(0);
    //   }
    // },
    {
      title: "Alloted(TON)",
      field: "ALLOTED_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          //return value.toFixed(3);
          return value;
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "BTA RM(TON)",
      field: "BTA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      tooltip: "Order Qty - (FG + WIP + ALLOTED)",
      formatter: function (cell, formatterParams) {
        // var data = cell.getData();
        // Order qty - ( FG/1000 + WIP/1000 + ALLOTED)
        // var value = data.ORD_QTY - ((data.FG_KG/1000) + (data.WIP_KG/1000) + data.ALLOTED_TO);
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    // {
    //   title: "Dispatched Qty(MT)",
    //   field: "DISPATCHED_FG_MT",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       // return value.toFixed(3);
    //       return value;
    //     }
    //     return value;
    //   },
    //   cellClick: function (e, cell) {
    //     // var element = cell.getElement();
    //     // var chkbox = element.querySelector('.select-row');

    //     var OrderNo = cell.getData().ENC_ID_ORDER;
    //     var Item = cell.getData().ENC_NO_ITEM;
    //     setSelectedOrder(OrderNo);
    //     setSelectedItem(Item);

    //     setCustomerTable([]);
    //     setDeviationFromBOMTable([]);

    //     setFinalnetWtAllotD(0);
    //     setFinalnetWtAllotM(0);
    //     netWtAllotD = 0;
    //     netWtAllotM = 0;
    //     setBtpAllot(0);
    //   }
    // },
    {
      title: "Thick",
      field: "THICK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Odia/Width",
      field: "WIDTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Length",
      field: "LNGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Tdc",
      field: "TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod Cd",
      field: "PROD_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qlty Cd",
      field: "QLTY_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Idia",
      field: "IDIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Order Type",
      field: "ENC_ORDER_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Creation Date",
      field: "ENC_DT_ORD_CREATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      sorter: "datetime",
      sorterParams: {
        format: "dd-MMM-yy HH:mm:ss",
        alignEmptyValues: "top",
      },
    },
    {
      title: "Item Type",
      field: "ITEM_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mill",
      field: "MILL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Draw Type",
      field: "DRAW_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Geometry",
      field: "GEOMETRY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Category",
      field: "CATEGORY",
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
      title: "Grade",
      field: "GRADE",
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
      title: "Class",
      field: "CLASS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ins Code",
      field: "INS_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Out Dia",
      field: "OUT_DIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "In Dia",
      field: "IN_DIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },

    {
      title: "Ageing Days",
      field: "AGENING_DAYS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Without BOM(MT)",
      field: "COIL_WITHOUT_BOM_COUNT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM With BOM(MT)",
      field: "COIL_WITH_BOM_COUNT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Odia",
      field: "ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "SFG Material",
      field: "TMM_SFG_MAT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellClick: function (e, cell) {
        handleClickOpen(cell, "SFG");
      },
    },
    {
      title: "SFG material Desc",
      field: "TMM_SFG_MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Material",
      field: "TMM_RM_MAT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellClick: function (e, cell) {
        handleClickOpen(cell, "RM");
      },
    },
    {
      title: "RM Material Desc",
      field: "TMM_RM_MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //     title: "FG Material",
    //     field: "FG_MATERIAL",
    //     headerFilter: "input",
    //     headerFilterPlaceholder: "search...",
    // },
    // {
    //     title: "FG Material Desc.",
    //     field: "FG_MATERIAL_DESC",
    //     headerFilter: "input",
    //     headerFilterPlaceholder: "search...",
    // },
    // {
    //     title: "FG Stock",
    //     field: "FG_STOCK",
    //     headerFilter: "input",
    //     headerFilterPlaceholder: "search...",
    //     formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             // return value.toFixed(3);
    //             return value;
    //         }
    //         return value;
    //     },
    // },
    {
      title: "Material Group",
      field: "MATERIAL_GRP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material Spec",
      field: "MATNR_SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material IP",
      field: "MATNR_IP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Order Qty.(MT)",
    //   field: "ORDER_QTY_MT",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(3);
    //     }
    //     return value;
    //   },
    // },

    {
      title: "Delv. Status",
      field: "OVERALL_DELV_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Sales Office",
      field: "SALES_OFFICE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    // {
    //     title: "Sold Cust. Name",
    //     field: "SOLD_CUST_NM",
    //     headerFilter: "input",
    //     headerFilterPlaceholder: "search...",
    // },

    {
      title: "Order Qty (in sales Unit)",
      field: "ORD_QNTY_IN_SALES_UNIT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Sales Unit",
      field: "SALES_UNIT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "ENC_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const handleClickOpen = async (cell, type) => {
    cell.type = type;
    setModal(cell);
    setModalData([]);
    let varData = await cellApi({
      type: type,
      plant: selectedPlant?.value,
      material: cell._cell.row.data?.FG_MATERIAL,
      Mat:
        type === "SFG"
          ? cell._cell.row.data?.TMM_RM_MAT
          : cell._cell.row.data?.TMM_SFG_MAT,
    });
    setModalData(varData?.data);
  };

  useEffect(() => {
    if (modalData?.length > 0 && modal) {
      let column = [
        {
          formatter: "rowSelection",
          titleFormatter: "rowSelection",
          hozAlign: "center",
          headerSort: false,
        },
        {
          title: `${modal.type === "SFG" ? "SFG" : "RM"} Material`,
          field: "MATERIAL",
          headerFilter: "input",
          headerFilterPlaceholder: "search...",
        },
        {
          title: `${modal.type === "SFG" ? "SFG" : "RM"} Material Desc`,
          field: "MATERIAL_DEC",
          headerFilter: "input",
          headerFilterPlaceholder: "search...",
        },
      ];
      setDelayBreakTable(
        new Tabulator("#planTableData", {
          data: modalData,
          columns: column,
          height: 400,
          layout: "fitDataFill",
          selectable: 1,
        })
      );
    } else {
      setDelayBreakTable(null);
    }
  }, [modalData]);

  useEffect(() => {
    delayBreakTable?.on("rowSelectionChanged", async function (data, rows) {
      if (data?.length > 0) {
        if (modal.type === "SFG") {
          let varData = await cellApi({
            type: "RM",
            plant: selectedPlant?.value,
            material: modal._cell.row.data?.FG_MATERIAL,
            Mat: data[0]?.MATERIAL,
          });
          modal?.getRow()?.update({
            TMM_SFG_MAT: data[0]?.MATERIAL,
            TMM_SFG_MAT_DESC: data[0]?.MATERIAL_DEC,
            TMM_RM_MAT: varData?.data[0]?.MATERIAL,
            TMM_RM_MAT_DESC: varData?.data[0]?.MATERIAL_DEC,
          });
        }
        if (modal.type === "RM") {
          let varData = await cellApi({
            type: "SFG",
            plant: selectedPlant?.value,
            material: modal._cell.row.data?.FG_MATERIAL,
            Mat: data[0]?.MATERIAL,
          });
          modal?.getRow()?.update({
            TMM_RM_MAT: data[0]?.MATERIAL,
            TMM_RM_MAT_DESC: data[0]?.MATERIAL_DEC,
            TMM_SFG_MAT: varData?.data[0]?.MATERIAL,
            TMM_SFG_MAT_DESC: varData?.data[0]?.MATERIAL_DEC,
          });
        }
        setModal(null);
      }
    });
  }, [delayBreakTable]);

  const cellApi = (data) => {
    return new Promise((success, reject) => {
      setLoading(true);
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        axiosAPI
          .post("api/LDSM001/getCoilList", data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
            } else {
              success(response);
            }
          })
          .finally(() => {
            reject(null);
            setLoading(false);
          });
      });
    });
  };

  var deviationOrderColumn = [
    {
      formatter: function (cell, formatterParams, onRendered) {
        const data = cell.getRow().getData();
        if (data.WIDTH > 0 && data.THICK > 0) {
          var checkbox = document.createElement("input");

          checkbox.type = "checkbox";

          if (this.table.modExists("selectRow", true)) {
            checkbox.addEventListener("click", (e) => {
              e.stopPropagation();
            });

            if (typeof cell.getRow == "function") {
              var row = cell.getRow();
              if (row._getSelf().type == "row") {
                checkbox.addEventListener("change", (e) => {
                  row.toggleSelect();
                });

                checkbox.checked = row.isSelected && row.isSelected();
                this.table.modules.selectRow.registerRowSelectCheckbox(
                  row,
                  checkbox
                );
              } else {
                checkbox = "";
              }
            } else {
              checkbox.addEventListener("change", (e) => {
                if (this.table.modules.selectRow.selectedRows.length) {
                  this.table.deselectRow();
                } else {
                  this.table.selectRow(formatterParams.rowRange);
                }
              });

              this.table.modules.selectRow.registerHeaderSelectCheckbox(
                checkbox
              );
            }
          }
          return checkbox;
        }
        return null;
      },
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      width: 50,
    },
    {
      title: "Batch Id",
      field: "BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Current Proc",
      field: "CURRENT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Desc.",
      field: "MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Net Wt.(MT)",
      field: "MASS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Alloted Qty.",
      field: "MASS1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: selectedLinkingType?.value === "1" ? "number" : null,
      formatter: function (cell, formatterParams) {
        if (selectedLinkingType?.value === "1") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
      cellEdited: (cell) => {
        let row = cell.getRow();
        let isSelected = false;
        if (row?._row?.modules?.select?.selected) {
          setChemBlock(true);
          isSelected = true;
        }
        row.deselect();
        var MassWt = cell._cell.row.data.MASS;
        var MassWt_m = cell._cell.row.data.MASS1;
        if (isSelected) {
          row.select();
        }
        if (MassWt < MassWt_m) {
          alertify.error("Coils greater than Net Wt.!");
          row.update({
            MASS1: MassWt,
          });
          return;
        }
      },
    },
    // {
    //   title: "Odia/Width",
    //   field: "ODIA",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(3);
    //     }
    //     return value;
    //   },
    // },
    {
      title: "Prod Cd",
      field: "PROD_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thick",
      field: "THICK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Width",
      field: "WIDTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "TDC",
      field: "TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qlty Cd",
      field: "EIC_CD_QLTY_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Age",
      field: "BATCH_AGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "EPA_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Processing Flag",
      field: "PROCESSING_FLAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Remarks",
      field: "REMARKS",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";

        return value;
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prev Order",
      field: "PREV_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prev Item",
      field: "PREV_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cast No",
      field: "CAST_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  var customerOrderColumn = [
    {
      formatter: function (cell, formatterParams, onRendered) {
        const data = cell.getRow().getData();
        if (data.WIDTH > 0 && data.THICK > 0) {
          var checkbox = document.createElement("input");

          checkbox.type = "checkbox";

          if (this.table.modExists("selectRow", true)) {
            checkbox.addEventListener("click", (e) => {
              e.stopPropagation();
            });

            if (typeof cell.getRow == "function") {
              var row = cell.getRow();
              if (row._getSelf().type == "row") {
                checkbox.addEventListener("change", (e) => {
                  row.toggleSelect();
                });

                checkbox.checked = row.isSelected && row.isSelected();
                this.table.modules.selectRow.registerRowSelectCheckbox(
                  row,
                  checkbox
                );
              } else {
                checkbox = "";
              }
            } else {
              checkbox.addEventListener("change", (e) => {
                if (this.table.modules.selectRow.selectedRows.length) {
                  this.table.deselectRow();
                } else {
                  this.table.selectRow(formatterParams.rowRange);
                }
              });

              this.table.modules.selectRow.registerHeaderSelectCheckbox(
                checkbox
              );
            }
          }
          return checkbox;
        }
        return null;
      },
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      width: 50,
    },
    {
      title: "Batch Id",
      field: "BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Current Proc",
      field: "CURRENT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Desc",
      field: "MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt.(MT)",
      field: "MASS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Alloted Qty.",
      field: "MASS1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: selectedLinkingType?.value === "1" ? "number" : null,
      formatter: function (cell, formatterParams) {
        if (selectedLinkingType?.value === "1") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
      cellEdited: (cell) => {
        let row = cell.getRow();
        let isSelected = false;
        if (row?._row?.modules?.select?.selected) {
          setChemBlock(true);
          isSelected = true;
        }
        row.deselect();
        var MassWt = cell._cell.row.data.MASS;
        var MassWt_m = cell._cell.row.data.MASS1;
        if (isSelected) {
          row.select();
        }
        if (MassWt < MassWt_m) {
          alertify.error("Coils greater than Net Wt.!");
          row.update({
            MASS1: MassWt,
          });
          return;
        }
      },
    },
    // {
    //   title: "Odia/Width",
    //   field: "ENC_ODIA",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(3);
    //     }
    //     return value;
    //   },
    // },
    {
      title: "Prod Cd",
      field: "PROD_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thick",
      field: "THICK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Width",
      field: "WIDTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "TDC",
      field: "TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qlty Cd",
      field: "LOM_CD_QLTY_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Age",
      field: "BATCH_AGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "EPA_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Processing Flag",
      field: "PROCESSING_FLAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prev Order",
      field: "PREV_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prev Item",
      field: "PREV_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cast No",
      field: "CAST_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  useEffect(() => {
    if (
      tabValue == 0 &&
      selectedCustomerTable === null &&
      getCustomerTable?.length > 0
    ) {
      setSelectedCustomerTable(
        new Tabulator("#selCustomerTable", {
          data: getCustomerTable,
          columns: customerOrderColumn,
          layout: "fitDataFill",
          height: 200,
        })
      );
    } else if (
      tabValue == 0 &&
      getCustomerTable?.length === 0 &&
      selectedCustomerTable !== null
    ) {
      setSelectedCustomerTable(null);
    }
  }, [getCustomerTable, tabValue]);

  useEffect(() => {
    setChemSelectionBom([]);
    setChemSelectionNBom([]);
  }, [getOrderTable, getCustomerTable, getDeviationFromBOMTable]);
  // checkbox calc
  var coilQty = 0;
  var sumD = 0;
  var sumM = 0;
  useEffect(() => {
    if (getCustomerTable.length != 0 && selectedCustomerTable != null) {
      selectedCustomerTable.on("rowSelectionChanged", function (data, rows) {
        if (!chemBlock) {
          setChemData([]);
        }
        var sum = 0;
        data.forEach((item) => {
          sum += parseFloat(item.MASS1);
        });
        sumM = sum;
        //coilQty = finalnetWtAllotD + sum
        //coilQty = finalnetWtAllotD + sum
        // Added by Tej
        var totolAllotedM = (Number(sumM) + Number(sumD)).toFixed(3);

        if (totolAllotedM > btpAllot) {
          //if (sum > btpAllot) {
          selectedCustomerTable.deselectRow();
          alertify.error(
            "Alloted Qty should not be greater than Balance to Plan"
          );
          setFinalnetWtAllotM(0);
          sumM = 0;
          return;
        }
        //sum = coilQty;
        setFinalnetWtAllotM(sumM);
        if (!chemBlock) {
          setChemSelectionBom(data);
        }
        setChemBlock(false);
      });
    }

    if (
      selectedDeviationTable != null &&
      getDeviationFromBOMTable?.length != 0
    ) {
      selectedDeviationTable.on("rowSelectionChanged", function (data, rows) {
        if (!chemBlock) {
          setChemData([]);
        }
        var sum = 0;
        data.forEach((item) => {
          sum += parseFloat(item.MASS1);
        });
        sumD = sum;
        var totalAllotedD = (Number(sumM) + Number(sumD)).toFixed(3);
        if (totalAllotedD > btpAllot) {
          selectedDeviationTable.deselectRow();
          alertify.error(
            "Alloted Qty should not be greater than Balance to Plan"
          );
          setFinalnetWtAllotD(0);
          sumD = 0;
          return;
        }
        setFinalnetWtAllotD(sumD);
        setFinalnetWtAllotM(sumM);
        if (!chemBlock) {
          setChemSelectionNBom(data);
        }
        setChemBlock(false);
      });
    }
  }, [selectedCustomerTable, selectedDeviationTable]);
  useEffect(() => {
    if (tabValue == 1 && deAllotDataTable === null && deAllotData?.length > 0) {
      setDeAllotDataTable(
        new Tabulator("#deallottab", {
          // pagination: "local", //enable local pagination.
          // paginationSize: 12,
          data: deAllotData,
          columns: deAllotColumn,
          layout: "fitDataFill",
          height: 300,
          selectable: 1,
          
        })
      );
    } else if (
      tabValue == 1 &&
      deAllotData?.length === 0 &&
      deAllotDataTable !== null
    ) {
      setDeAllotDataTable(null);
    }
  }, [deAllotData, tabValue]);

  useEffect(() => {
    if (
      tabValue == 0 &&
      selectedOrderTable === null &&
      getOrderTable?.length > 0
    ) {
      setSelectedOrderTable(
        new Tabulator("#selOrderTable", {
          data: getOrderTable,
          columns: orderDetailsColumn,
          layout: "fitDataFill",
          height: 200,
          selectable: 1,
        })
      );
    }
  }, [getOrderTable, tabValue]);

  useEffect(() => {
    if (selectedOrderTable !== null) {
      selectedOrderTable.on("rowSelectionChanged", function (data, rows) {
        if (data?.length > 0) {
          var OrderNo = data[0].ENC_ID_ORDER;
          var Item = data[0].ENC_NO_ITEM;
          setSelectedOrder(OrderNo);
          setSelectedItem(Item);

          setCustomerTable([]);
          setDeviationFromBOMTable([]);

          setFinalnetWtAllotD(0);
          setFinalnetWtAllotM(0);
          netWtAllotD = 0;
          netWtAllotM = 0;
          setBtpAllot(0);
        }
      });
    }
  }, [selectedOrderTable]);

  useEffect(() => {
    if (
      tabValue == 0 &&
      selectedDeviationTable === null &&
      getDeviationFromBOMTable?.length > 0 &&
      selectedLinkingType?.value === "1"
    ) {
      setSelectedDeviationTable(
        new Tabulator("#selDeviationTable", {
          data: getDeviationFromBOMTable,
          columns: deviationOrderColumn,
          layout: "fitDataFill",
          height: 200,
        })
      );
    } else if (
      tabValue == 0 &&
      getDeviationFromBOMTable?.length === 0 &&
      selectedDeviationTable !== null
    ) {
      setSelectedDeviationTable(null);
    }
  }, [getDeviationFromBOMTable, tabValue]);

  let chemMatchingBOMColumn = [
    {
      title: "Batch Id",
      field: "BATCH_ID",
      frozen: true,
      width: "35%",
      // cellClick: () => {
      //   setSelectedChemMatchingTable(null);
      //   setIsClicked(!isClicked);
      // }
    },
    {
      title: "Message",
      field: "MESSAGE",
      width: "65%",
      formatter: function (cell, formatterParams) {
        let value = cell.getValue();
        if (value?.slice(0, 2) === "N-") {
          // cell.getElement().style["background-color"] = "red";
          cell.getElement().style["color"] = "red";
        }
        if (value?.slice(0, 2) === "Y-") {
          // cell.getElement().style["background-color"] = "green";
          cell.getElement().style["color"] = "green";
        }
        if (!isClicked) {
          return value?.slice(0, 1);
        } else {
          return value;
        }
      },
    },
  ];

  useEffect(() => {
    if (chemSelectionBom || chemSelectionNBom) {
      setChemError(false);
      const varData = [];
      chemSelectionBom?.map((x) =>
        varData.push({
          CD_EPA: selectedPlant?.value,
          ORDER_NO: selectedOrder,
          ITEM_NO: selectedItem,
          BATCH_ID: x.BATCH_ID,
        })
      );
      chemSelectionNBom?.map((x) =>
        varData.push({
          CD_EPA: selectedPlant?.value,
          ORDER_NO: selectedOrder,
          ITEM_NO: selectedItem,
          BATCH_ID: x.BATCH_ID,
        })
      );

      if (varData?.length > 0 && selectedOrder?.length > 0 && !chemBlock) {
        setLoading(true);
        GetAuthorization().then((token) => {
          var defaultOptions = {
            headers: {
              Authorization: "Bearer " + token.accessToken,
            },
          };
          axiosAPI
            .post("api/LDSM001/chemChk", { data: varData }, defaultOptions)
            .then((response) => {
              if (response.statusText != "" && response.statusText != "OK") {
                //reject(response.statusText);
              } else {
                if (response?.data) {
                  response.data?.map((x) => {
                    if (x.MESSAGE?.slice(0, 2) === "N-") {
                      setChemError(true);
                    }
                  });
                }
                setSelectedChemMatchingTable(null);
                setChemData(response.data);
              }
            })
            .finally(() => {
              setLoading(false);
            });
        });
      } else if (!chemBlock) {
        setSelectedChemMatchingTable(null);
        setChemData([]);
      }
    }
  }, [chemSelectionBom, chemSelectionNBom]);

  const downloadExcelcustomerTableData = () => {
    downloadExcelCoilDeviTableData();

    if (selectedCustomerTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedCustomerTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSM001_coils_matching " + date.toString() + ".xlsx";
    selectedCustomerTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelAvailableOrdersTableData = () => {
    if (selectedOrderTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedOrderTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSM001_available_orders " + date.toString() + ".xlsx";
    selectedOrderTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelCoilDeviTableData = () => {
    if (selectedDeviationTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedDeviationTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSM001_Deviation " + date.toString() + ".xlsx";
    selectedDeviationTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelDeAllotTableData = () => {
    if (deAllotDataTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = deAllotDataTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSM001_DeAllotment " + date.toString() + ".xlsx";
    deAllotDataTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleClearAll = (newToken = false) => {
    setSelectedPlant([]);
    setSelectStatus([]);
    setAllValues({});
    setOrdDtFrm(null);
    setOrdDtTo(null);

    setSelectedCustomerTable(null);
    setSelectedOrderTable(null);
    setSelectedDeviationTable(null);

    setCustomerTable([]);
    setOrderTable([]);
    setDeviationFromBOMTable([]);
    setChemData([]);
    setChemSelectionNBom([]);
    setChemSelectionBom([]);
    setFinalnetWtAllotD(0);
    setFinalnetWtAllotM(0);
    netWtAllotD = 0;
    netWtAllotM = 0;
    setBtpAllot(0);

    setSelectedOrder(0);
    setSelectedItem(0);

    setSelectLinkingType([]);
    resetFilter();
  };

  const handleClearAllDeAllot = () => {
    setSelectedPlant([]);
    setAllValuesDeAllot({});
    setDeAllotData([]);
    setDeAllotDataTable(null);
    resetFilter();
  };

  const getOdia = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        plant: value.value,
      };

      Promise.all([
        axiosAPI.post("api/LDSM001/odiaList", data, defaultOptions),
        axiosAPI.post("api/LDSM001/lengthList", data, defaultOptions),
        axiosAPI.post("api/LDSM001/thickList", data, defaultOptions),
        axiosAPI.post("api/LDSM001/idiaList", data, defaultOptions),
        axiosAPI.post("api/LDSM001/dOdiaList", data, defaultOptions),
        axiosAPI.post("api/LDSM001/dIdiaList", data, defaultOptions),
      ])
        .then(
          ([
            dataOdiaList,
            dataLengthList,
            dataThickList,
            dataIdiaList,
            dataDOdiaList,
            dataDIdiaList,
          ]) => {
            if (
              dataOdiaList.statusText != "" &&
              dataOdiaList.statusText != "OK"
            ) {
              //reject(dataOdiaList.statusText);
            } else if (dataOdiaList.data?.length) {
              let varData1 = [];
              dataOdiaList.data?.map((x) =>
                varData1.push(x?.toFixed(2) ? x.toFixed(2) : x)
              );
              setOdiaData(varData1);
            }

            if (
              dataLengthList.statusText != "" &&
              dataLengthList.statusText != "OK"
            ) {
              //reject(dataLengthList.statusText);
            } else if (dataLengthList.data?.length) {
              let varData2 = [];
              dataLengthList.data?.map((x) =>
                x?.toFixed(2) ? varData2.push(x?.toFixed(2)) : null
              );
              setLengthData(varData2);
            }

            if (
              dataThickList.statusText != "" &&
              dataThickList.statusText != "OK"
            ) {
              //reject(dataThickList.statusText);
            } else if (dataThickList.data?.length) {
              let varData3 = [];
              dataThickList.data?.map((x) =>
                x?.toFixed(2) ? varData3.push(x?.toFixed(2)) : null
              );
              setThickData(varData3);
            }

            if (
              dataIdiaList.statusText != "" &&
              dataIdiaList.statusText != "OK"
            ) {
              //reject(dataIdiaList.statusText);
            } else if (dataIdiaList.data?.length) {
              let varData4 = [];
              dataIdiaList.data?.map((x) =>
                x?.toFixed(2) ? varData4.push(x?.toFixed(2)) : null
              );
              setIdiaData(varData4);
            }

            if (
              dataDOdiaList.statusText != "" &&
              dataDOdiaList.statusText != "OK"
            ) {
              //reject(dataDOdiaList.statusText);
            } else if (dataDOdiaList.data?.length) {
              let varData5 = [];
              dataDOdiaList.data?.map((x) =>
                x?.toFixed(2) ? varData5.push(x?.toFixed(2)) : null
              );
              setDOdiaData(varData5);
            }

            if (
              dataDIdiaList.statusText != "" &&
              dataDIdiaList.statusText != "OK"
            ) {
              //reject(dataDIdiaList.statusText);
            } else if (dataDIdiaList?.data?.length) {
              let varData6 = [];
              dataDIdiaList.data?.map((x) =>
                x?.toFixed(2) ? varData6.push(x?.toFixed(2)) : null
              );
              setDIdiaData(varData6);
            }
          }
        )
        .finally(() => {
          resolve();
        });
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Planning & Scheduling"
        page="Allotment / Deallotment Screen"
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
              <Grid item xs={6}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab label="Allotment" icon={<Today />} />
                    <Tab label="Deallotment" icon={<Today />} />
                  </Tabs>
                </AppBar>
              </Grid>
              <Grid item xs={12}>
                {tabValue == 0 && (
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

                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Clear All">
                            <span>
                              <IconButton
                                color="white"
                                onClick={() => handleClearAll(true)}
                              >
                                <ClearAllIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={3}>
                      <Grid container spacing={1}>
                        <Grid item xs={2.5} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Plant*{" "}
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={plant}
                            value={selectedPlant}
                            onChange={handlePlantChange}
                          />
                        </Grid>
                        <Grid item xs={0.9}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Order{" "}
                          </MDTypography>
                          <MDInput
                            name="orderId"
                            value={allValues.orderId || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid>
                        <Grid item xs={0.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Item{" "}
                          </MDTypography>
                          <MDInput
                            name="item"
                            value={allValues.item || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid>

                        {/* <Grid item xs={.75}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Order Type{" "}
                          </MDTypography>
                          <MDInput
                            name="orderType"
                            value={allValues.orderType || ""}
                            onChange={(e) => handleChange(e)}
                          ></MDInput>
                        </Grid> */}
                        <Grid item xs={0.75}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Length{" "}
                          </MDTypography>
                          {/* <MDInput type="number" name="thikFrm" value={allValues.thikFrm || ''} onChange={(e) => handleChange(e)} /> */}
                          <MultipleSelect
                            value={lengthValue.from}
                            setValue={(val) => {
                              if (getCustomerTable?.length > 0) {
                                setCustomerTable([]);
                              }
                              setLengthValue({ ...lengthValue, from: val });
                            }}
                            data={lengthData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                        {thickValue?.to?.length <= 1 ? (
                          <Grid
                            item
                            xs={thickValue?.from?.length > 1 ? 1.5 : 0.75}
                          >
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Thick From{" "}
                            </MDTypography>
                            {/* <MDInput type="number" name="thikFrm" value={allValues.thikFrm || ''} onChange={(e) => handleChange(e)} /> */}
                            <MultipleSelect
                              value={thickValue.from}
                              setValue={(val) => {
                                if (getCustomerTable?.length > 0) {
                                  setCustomerTable([]);
                                }
                                setThickValue({ ...thickValue, from: val });
                              }}
                              data={thickData}
                              placeholder={"--Select--"}
                            />
                          </Grid>
                        ) : null}
                        {thickValue?.from?.length <= 1 ? (
                          <Grid
                            item
                            xs={thickValue?.to?.length > 1 ? 1.5 : 0.75}
                          >
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Thick To{" "}
                            </MDTypography>
                            {/* <MDInput type="number" name="thikTo" value={allValues.thikTo || ''} onChange={(e) => handleChange(e)} /> */}
                            <MultipleSelect
                              value={thickValue?.to}
                              setValue={(val) => {
                                if (getCustomerTable?.length > 0) {
                                  setCustomerTable([]);
                                }
                                setThickValue({ ...thickValue, to: val });
                              }}
                              data={thickData}
                              placeholder={"--Select--"}
                            />
                          </Grid>
                        ) : null}

                        <Grid item xs={0.75}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Odia{" "}
                          </MDTypography>
                          <MultipleSelect
                            value={odiaValue?.from}
                            setValue={(val) => {
                              {
                                if (getCustomerTable?.length > 0) {
                                  setCustomerTable([]);
                                }
                                setOdiaValue({ ...odiaValue, from: val });
                              }
                            }}
                            data={odiaData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                        <Grid item xs={0.75}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            idia{" "}
                          </MDTypography>
                          <MultipleSelect
                            value={idiaValue?.from}
                            setValue={(val) => {
                              {
                                if (getCustomerTable?.length > 0) {
                                  setCustomerTable([]);
                                }
                                setIdiaValue({ ...idiaValue, from: val });
                              }
                            }}
                            data={idiaData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                        <Grid item xs={0.65}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Grade
                          </MDTypography>
                          <MDInput
                            label=""
                            name="grade"
                            inputProps={{ maxLength: 10 }}
                            value={allValues.grade || ""}
                            onChange={(e) => handleChange(e)}
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
                            Linking Type{" "}
                          </MDTypography>
                          <ReactSelect
                            id="linkingType"
                            options={linkingType}
                            value={selectedLinkingType}
                            onChange={handleLinkingTypeChange}
                          />
                        </Grid>
                        <Grid item xs={1.15}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Order Type{" "}
                          </MDTypography>
                          <ReactSelect
                            id="orderType"
                            options={orderType}
                            value={selectedOrderType}
                            onChange={handleOrderTypeChange}
                          />
                        </Grid>
                        <Grid item xs={0.85}>
                          {" "}
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => getOrdersBtnSubmit()}
                          >
                            {" "}
                            Get Orders{" "}
                          </MDButton>{" "}
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}

                {tabValue == 1 && (
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

                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Clear All">
                            <span>
                              <IconButton
                                color="white"
                                onClick={() => handleClearAllDeAllot(true)}
                              >
                                <ClearAllIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={3}>
                      <Grid container spacing={1}>
                        <Grid item xs={3} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Plant*{" "}
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={plant}
                            value={selectedPlant}
                            onChange={handlePlantChangeDeAllot}
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
                            Order{" "}
                          </MDTypography>
                          <MDInput
                            name="orderId"
                            value={allValuesDeAllot.orderId || ""}
                            onChange={(e) => handleChangeDeAllot(e)}
                          />
                        </Grid>
                        <Grid item xs={0.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Item{" "}
                          </MDTypography>
                          <MDInput
                            name="item"
                            value={allValuesDeAllot.item || ""}
                            onChange={(e) => handleChangeDeAllot(e)}
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
                            Odia/Width{" "}
                          </MDTypography>
                          <MultipleSelect
                            value={dOdiaValue?.from}
                            setValue={(val) => {
                              {
                                setDOdiaValue({ ...dOdiaValue, from: val });
                              }
                            }}
                            data={dOdiaData}
                            placeholder={"--Select--"}
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
                            idia{" "}
                          </MDTypography>
                          <MultipleSelect
                            value={dIdiaValue?.from}
                            setValue={(val) => {
                              {
                                setDIdiaValue({ ...dIdiaValue, from: val });
                              }
                            }}
                            data={dIdiaData}
                            placeholder={"--Select--"}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          {" "}
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => getDeAllotData(true)}
                          >
                            {" "}
                            Display{" "}
                          </MDButton>{" "}
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
              </Grid>

              <Grid item xs={12}>
                {tabValue == 0 && (
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
                        <Grid item xs={8}>
                          <MDTypography variant="h6" color="white">
                            Available Orders
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <MDTypography variant="p" color="white">
                              Order : {selectedOrder}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Item :{" "}
                              {selectedItem}
                            </MDTypography>
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        {/* <Grid item xs={1}>
                                                    <Tooltip title="Search Coils Matching with BOM" arrow>
                                                        <IconButton color="white" onClick={() => searchCoilsBOM(true)}>
                                                            <SaveIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Download" arrow >
                                                        <IconButton color="white" onClick={() => downloadExcelcustomerTableData()}>
                                                            <DownloadForOfflineIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid> */}

                        <Grid item xs={1}>
                          <Tooltip title="Search Coils " arrow>
                            <span>
                              <IconButton
                                color="white"
                                onClick={() => searchCoilsDeviationBOM(true)}
                              >
                                <FormatListBulletedIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Download" arrow>
                            <span>
                              <IconButton
                                color="white"
                                onClick={() =>
                                  downloadExcelAvailableOrdersTableData()
                                }
                              >
                                <DownloadForOfflineIcon />
                              </IconButton>
                            </span>
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
                          {/* <div style={{overflow: "scroll", height: 200 }}> */}
                          {getOrderTable?.length > 0 ? (
                            <div id="selOrderTable" />
                          ) : null}
                          {/* </div> */}
                          <br />
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            Showing 1 to {getOrderTable.length} of{" "}
                            {getOrderTable.length} entries
                          </p>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}

                {tabValue == 1 && (
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
                            DeAllotment Data
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        {/* <Grid item xs={1}>
                                                    <Tooltip title="Search Coils Matching with BOM" arrow>
                                                        <IconButton color="white" onClick={() => searchCoilsBOM(true)}>
                                                            <SaveIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Download" arrow >
                                                        <IconButton color="white" onClick={() => downloadExcelcustomerTableData()}>
                                                            <DownloadForOfflineIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid> */}

                        <Grid item xs={1}>
                          <Tooltip title="Delink coils with Order" arrow>
                            <span>
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => updateDeAllotData(true)}
                              >
                                <SaveIcon />
                              </IconButton>
                            </span>
                          </Tooltip>

                          <Tooltip title="Download" arrow>
                            <span>
                              <IconButton
                                color="white"
                                onClick={() => downloadExcelDeAllotTableData()}
                              >
                                <DownloadForOfflineIcon />
                              </IconButton>
                            </span>
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
                          {/* <div style={{overflow: "scroll", height: 200 }}> */}
                          {deAllotData?.length > 0 ? (
                            <div id="deallottab" />
                          ) : null}
                          {/* </div> */}
                          <br />
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            Showing 1 to {deAllotData.length} of{" "}
                            {deAllotData.length} entries
                          </p>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
              </Grid>

              {tabValue == 0 && (
                <React.Fragment>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item xs={12}>
                        <Card>
                          <MDBox
                            mx={2}
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
                              <Grid item xs={10}>
                                <MDTypography variant="h6" color="white">
                                  Coil Details
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  <MDTypography variant="p" color="white">
                                    {/* Balance to Produce : {btpAllot} */}
                                    Balance to Plan : {btpAllot}
                                  </MDTypography>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  <MDTypography variant="p" color="white">
                                    Alloted Qty :{" "}
                                    {(
                                      Number(finalnetWtAllotM) +
                                      Number(finalnetWtAllotD)
                                    ).toFixed(3)}
                                  </MDTypography>
                                </MDTypography>
                              </Grid>
                              <Grid
                                item
                                xs={2}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Tooltip title="Link Coil With Order" arrow>
                                  <span>
                                    <IconButton
                                      color="white"
                                      disabled={isReadWriteAccess || chemError}
                                      onClick={() => linkCoil(true)}
                                    >
                                      <SaveIcon />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Download" arrow>
                                  <span>
                                    <IconButton
                                      color="white"
                                      onClick={() =>
                                        downloadExcelcustomerTableData()
                                      }
                                    >
                                      <DownloadForOfflineIcon />
                                    </IconButton>
                                  </span>
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
                                <Grid>
                                  <Accordion defaultExpanded={true}>
                                    <AccordionSummary
                                      sx={{
                                        backgroundColor: "#7bdcb5",
                                        color: "white",
                                      }}
                                      //expandIcon={<ExpandMoreIcon />}
                                      expandIcon={<ExpandCircleDownIcon />}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header"
                                    >
                                      <Typography
                                        variant="h6"
                                        color="common.white"
                                      >
                                        Coils Matching with BOM
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      {/* <div style={{overflow: "scroll", height: 200 }}> */}
                                      {getCustomerTable?.length > 0 ? (
                                        <div id="selCustomerTable" />
                                      ) : null}
                                      {/* </div> */}
                                      <br />
                                      <p
                                        color="black"
                                        style={{
                                          color: "black",
                                          paddingLeft: "1rem",
                                          marginTop: "-1rem",
                                        }}
                                      >
                                        Showing 1 to {getCustomerTable.length}{" "}
                                        of {getCustomerTable.length} entries
                                      </p>
                                    </AccordionDetails>
                                  </Accordion>
                                  {selectedLinkingType?.value === "1" ? (
                                    <Accordion defaultExpanded={true}>
                                      <AccordionSummary
                                        sx={{
                                          backgroundColor: "#f47373",
                                        }}
                                        // expandIcon={<ExpandMoreIcon />}
                                        expandIcon={<ExpandCircleDownIcon />}
                                        aria-controls="panel2a-content"
                                        id="panel2a-header"
                                      >
                                        <Typography
                                          variant="h6"
                                          color="common.white"
                                        >
                                          <p color="white">
                                            {" "}
                                            Coils deviation from BOM
                                          </p>
                                        </Typography>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                        {/* <div style={{overflow: "scroll", height: 200 }}> */}
                                        {getDeviationFromBOMTable?.length >
                                        0 ? (
                                          <div id="selDeviationTable" />
                                        ) : null}
                                        {/* </div> */}
                                        <br />
                                        <p
                                          color="black"
                                          style={{
                                            color: "black",
                                            paddingLeft: "1rem",
                                            marginTop: "-1rem",
                                          }}
                                        >
                                          Showing 1 to{" "}
                                          {getDeviationFromBOMTable.length} of{" "}
                                          {getDeviationFromBOMTable.length}{" "}
                                          entries
                                        </p>
                                      </AccordionDetails>
                                    </Accordion>
                                  ) : null}
                                </Grid>
                              </Grid>
                            </Grid>
                          </MDBox>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item xs={12}>
                        <Card>
                          <MDBox
                            mx={2}
                            mt={-3}
                            py={0.25}
                            px={1}
                            variant="gradient"
                            borderRadius="lg"
                            coloredShadow="info"
                            style={{ backgroundColor: "#6c757d" }}
                          >
                            <Grid
                              container
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Grid item>
                                <MDTypography variant="h6" color="white" p={1}>
                                  Chemistry Details
                                </MDTypography>
                              </Grid>
                            </Grid>
                          </MDBox>

                          <MDBox px={3} py={2}>
                            <Grid container spacing={1}>
                              <Grid item xs={12}>
                                <Grid>
                                  {chemData?.length > 0 && isClicked ? (
                                    <div id="selChemMatchingTableF" />
                                  ) : null}
                                  {chemData?.length > 0 && !isClicked ? (
                                    <div id="selChemMatchingTableH" />
                                  ) : null}
                                  <br />
                                  <p
                                    color="black"
                                    style={{
                                      color: "black",
                                      paddingLeft: "1rem",
                                      marginTop: "-1rem",
                                    }}
                                  >
                                    Showing 1 to {chemData.length} of{" "}
                                    {chemData.length} entries
                                  </p>
                                </Grid>
                              </Grid>
                            </Grid>
                          </MDBox>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          </MDBox>
        </>
      )}
      {/* <Avatar sx={{ bgcolor: '#6c757d', position: 'fixed', right: '30px', bottom: '30px', padding: '30px' }} onClick={() => setToggleBtn(true)}>
        <AssignmentIcon fontSize='large' />
      </Avatar> */}
      {modal && (
        <Dialog
          fullWidth={true}
          maxWidth={"sm"}
          open={modal !== null}
          onClose={() => setModal(null)}
        >
          <DialogTitle>
            {modal.type === "SFG" ? "SFG" : "RM"} Material Data
          </DialogTitle>
          <DialogContent>
            <Grid item xs={12} style={{ marginTop: "30px" }}>
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
                  <Grid item xs={3}>
                    <MDTypography variant="h6" color="white">
                      Data
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox px={3} py={3}>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ display: "none" }}
                ></Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <div id="planTableData" />
                  </Grid>
                </Grid>
              </MDBox>
            </Grid>
          </DialogContent>
          <DialogActions>
            {loading ? (
              <Preloader />
            ) : (
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                style={{ marginTop: "0.5rem" }}
              >
                <Button onClick={() => setModal(null)}>Ok</Button>
                {/* <MDButton
                  size="small"
                  color="info"
                  onClick={() =>saveData(props.data.DURATION)}
                  style={{margin:"1.5rem"}}
                >
                  Save
                </MDButton> */}
              </Grid>
            )}
          </DialogActions>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
