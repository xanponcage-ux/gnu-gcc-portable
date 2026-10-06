import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
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
import ClearAllIcon from "@mui/icons-material/ClearAll";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import { styled } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
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
import MultipleSelect from "components/Select/MultiSelect";
import { GetAuthorization } from "../../utils";

export default function LDSM003() {
  const [state, setState] = React.useState({
    checkedA: true,
  });
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [ordType, setOrdType] = useState([]);
  const [selectedOrderType, setSelectOrderType] = React.useState([]);
  const [customerDesc, setCustomerDesc] = useState([]);
  const [pCat, setProdCat] = useState([]);
  const [selectedPcat, setSelectPcat] = React.useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [bUnit, setBunit] = React.useState([]);
  const [statusList, setStatusList] = useState([]);
  const [selectStatus, setSelectStatus] = React.useState([]);
  const [selectCustomerDesc, setSelectCustomerDesc] = useState([]);
  const defaultHrForm = {
    runit: "P",
    ctype: "",
    rcode: "",
  };

  const [filter, setFilter] = useState(defaultHrForm);
  const [getCustomerTable, setCustomerTable] = React.useState([]);
  const [selectedCustomerTable, setSelectedCustomerTable] = useState(null);
  const [sourcePlantFetched, setSourcePlantFetched] = useState(false);

  const [recvDtFrm, setRecvDtFrm] = useState(null);
  const [recvDtTo, setRecvDtTo] = useState(null);
  const [invDtFrm, setInvDtFrm] = useState(null);
  const [invDtTo, setInvDtTo] = useState(null);
  const [procDtFrm, setProcDtFrm] = useState(null);
  const [procDtTo, setProcDtTo] = useState(null);
  const [odiaValue, setOdiaValue] = useState({
    from: [],
    to: [],
  });
  const [thickValue, setThickValue] = useState({
    from: [],
    to: [],
  });
  const [lengthValue, setLengthValue] = useState({
    from: [],
    to: [],
  });
  const [thickData, setThickData] = useState([]);
  const [odiaData, setOdiaData] = useState([]);
  const [lengthData, setLengthData] = useState([]);
  const [selectedOdiaFrm, setSelectedOdiaFrm] = useState([]);
  const [storeLocation, setStoreLocation] = useState([]);
  const [selectedOdiaTo, setSelectedOdiaTo] = useState([]);
  var customerTable = React.createRef();
  const [allValues, setAllValues] = useState({
    batchId: "",
    prodCd: "",
    qualityCd: "",
    thikFrm: "",
    thikTo: "",
    widthFrm: "",
    widthTo: "",
    invoiceNo: "",
    materialNo: "",
    tdc: "",
  });

  const [invoiceNoCount, setInvoiceNoCount] = useState({});

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

  const coilTypeList = [
    { label: "RM Coil", value: "RM_Coil" },
    { label: "Parted Coil", value: "Parted_Coil" },
    { label: "All", value: "All" },
  ];

  const [selectedCoilType, setSelectedCoilType] = useState(coilTypeList[0]);

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const fetchDetails = () => {
    setLoading(true);
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    GetAuthorization()
      .then((data) => {
        validateUser(data.accessToken, data.refreshToken);
        Promise.all([
          getGroupPlantId(data.accessToken),
          getProdCat(data.accessToken),
          getStatusList(data.accessToken),
          getStoreLocation(data.accessToken),
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

  useEffect(() => {
    if (getCustomerTable && getCustomerTable.length != 0) {
      setSelectedCustomerTable(
        new Tabulator("#selCustomerTable", {
          // pagination: "local", //enable local pagination.
          // paginationSize: 12,
          data: getCustomerTable,
          columns:
            selectedPlant?.value === "0788" && selectStatus.value === "VA"
              ? customerOrderColumn0788(storeLocation)
              : customerOrderColumn,
          height: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [getCustomerTable, storeLocation]);

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
      var pageName = "LDSM003";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        accessToken
      );

      if (authDetails) {
        // if (authDetails.payload.PS_AUTH_USER_SCR != "Y") {
        //   setRestricted(true);
        // } else {
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

  const getGroupPlantId = async (accessToken) => {
    return new Promise((resolve, reject) => {
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
            Promise.all([
              getBusinessCd(items[0], accessToken),
              getCustDesc(items[0], accessToken),
              getOrdTyp(items[0], accessToken),
              getOdia(items[0], accessToken),
            ]).finally(() => {
              resolve();
            });
          }
        })
        .catch((x) => {
          reject();
        });
    });
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
        axiosAPI.post("api/LDSM003/odiaList", data, defaultOptions),
        axiosAPI.post("api/LDSM003/lengthList", data, defaultOptions),
        axiosAPI.post("api/LDSM003/thickList", data, defaultOptions),
      ])
        .then(([odia, length, thick]) => {
          if (odia.statusText != "" && odia.statusText != "OK") {
            //reject(odia.statusText);
          } else if (odia.data?.length) {
            let varData = [];
            odia.data?.map((x) => varData.push(x.toFixed(2)));
            setOdiaData(varData);
          } else if (odia.data?.length === 0) {
            setOdiaData([]);
          }

          if (length.statusText != "" && length.statusText != "OK") {
            //reject(length.statusText);
          } else if (length.data?.length) {
            let varData = [];
            length.data?.map((x) => varData.push(x.toFixed(2)));
            setLengthData(varData);
          } else if (length.data?.length === 0) {
            setLengthData([]);
          }

          if (thick.statusText != "" && thick.statusText != "OK") {
            //reject(thick.statusText);
          } else if (thick.data?.length) {
            let varData = [];
            thick.data?.map((x) => varData.push(x.toFixed(2)));
            setThickData(varData);
          } else if (thick.data?.length === 0) {
            setThickData([]);
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const getCustDesc = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LDSM007/GetCustDesc";
      let data = {
        plant: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
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
            setCustomerDesc(items);
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const getOrdTyp = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM007/GetOrdTyp";
      let data = {
        plant: value.value,
      };
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
            setOrdType(items);
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const getStatusList = async (accessToken) => {
    return new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LDSM003/status";
      axiosAPI
        .post(url, {}, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              var val = row.split(":");
              var obj = new Object();
              obj.label = val[1];
              obj.value = val[0];
              items.push(obj);
            });
            setStatusList(items);
            let obj = items.find((o) => o.value === "VA");
            setSelectStatus(obj);
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const getStoreLocation = async (accessToken) => {
    return new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LDSM003/getStoreLocation";
      axiosAPI
        .get(url, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data?.map((row) => {
              var obj = new Object();
              obj.label = row[0];
              obj.value = row[0];
              items.push(obj);
            });
            setStoreLocation(items);
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const getProdCat = async (accessToken) => {
    return new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LDSM007/GetProdCat";
      axiosAPI
        .post(url, {}, defaultOptions)
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
            setProdCat(items);
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const handlePlantChange = (value) => {
    // setSelectStatus([]);
    let obj = statusList.find((o) => o.value === "VA");
    setSelectStatus(obj);

    setAllValues({});
    setRecvDtFrm(null);
    setRecvDtTo(null);
    setInvDtFrm(null);
    setInvDtTo(null);
    setProcDtFrm(null);
    setProcDtTo(null);
    setSelectedOdiaFrm([]);
    setSelectedOdiaTo([]);
    setOdiaValue({
      from: [],
      to: [],
    });
    setThickValue({
      from: [],
      to: [],
    });
    setLengthValue({
      from: [],
      to: [],
    });
    setSelectedCoilType(coilTypeList[0]);
    setSelectedCustomerTable(null);
    setCustomerTable([,]);

    setSelectedPlant(value);

    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          getCustDesc(value, data.accessToken),
          getOrdTyp(value, data.accessToken),
          getBusinessCd(value, data.accessToken),
          getOdia(value, data.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const getBusinessCd = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LDSM007/getBUnitCd";
      let data = {
        plant: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
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

  const handleStatusChange = (value) => {
    setSelectStatus(value);
    setCustomerTable([,]);
  };

  const handleOdiaFrmChange = (e) => {
    setSelectedOdiaFrm(e);
    setCustomerTable([,]);
  };

  const handleCoilTypeChange = (e) => {
    setSelectedCoilType(e);
    setCustomerTable([,]);
  };

  const handleOdiaToChange = (e) => {
    setSelectedOdiaTo(e);
    setCustomerTable([,]);
  };

  const btnBatchDetails = async () => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    var d = {
      Plant: selectedPlant.value ? selectedPlant.value : "",
      MBATCH_ID: allValues.batchId,
    };
    var url = "api/LDSM003/getBatchDetails";

    axiosAPI.post(url, d, defaultOptions).then((response) => {
      if (response.statusText != "" && response.statusText != "OK") {
        //reject(response.statusText);
      } else {
        if (response.data[1]) {
          // setCustomerTable(response.data[1]);
        } else {
          alertify.error("No Data Found");
        }
      }
    });
  };

  const receiveCoil = async () => {
    if (selectedPlant.value != undefined) {
      var selectedRows = selectedCustomerTable.getSelectedRows();
      var newData = [];
      var tempArr = [];
      var flag = false;
      var flag1 = false;
      selectedRows.forEach(function (item) {
        newData.push(item._row.data);
        if (
          item._row.data.EIC_ID_POS &&
          item._row.data.EIC_ID_POS.toString().length > 1
        ) {
          flag = true;
        }
        if (
          selectedPlant?.value === "0788" &&
          selectStatus.value === "VA" &&
          !item._row.data.STORE_LOCATION?.toString().length > 0
        ) {
          flag1 = true;
        }

        if (item._row.data.EIC_NO_INVOICE) {
          tempArr.push(item._row.data.EIC_NO_INVOICE);
          if (selectedPlant?.value === "0789") {
            item._row.data.STORE_LOCATION = item._row.data.EIC_NO_INVOICE;
          }
        }
      });
      if (flag) {
        alertify.error("Loc Z cannot have more than 1 character");
        return;
      }
      if (flag1) {
        alertify.error("Please select Storelocation for selected row!");
        return;
      }

      if (selectStatus.value != "VA") {
        alertify.error("Receive facility is only applicable for VA coils");
        return;
      }

      if (selectedRows.length == 0) {
        alertify.error("No Rows Selected");
        return;
      }

      if (allValues.invoiceNo == "" && selectedPlant?.value !== "0788") {
        alertify.error("Invoice number is required for receving");
        return;
      } else if (
        !(selectedPlant?.value === "0788" && selectStatus.value === "VA")
      ) {
        var d = tempArr.every((val, i, arr) => val === arr[0]);

        if (d != true) {
          alertify.error(
            "Invoice number should be same for selected rows for receiving"
          );
          return;
        } else {
          var flag = false;
          newData.forEach((row) => {
            if (allValues.invoiceNo != row.EIC_NO_INVOICE) {
              flag = true;
            }
          });

          if (flag) {
            alertify.error(
              "Entered Invoice Number and Selected invoice number are different"
            );
            return;
          }

          if (newData.length != invoiceNoCount[allValues.invoiceNo]) {
            alertify.error(
              "Select all batches of the given invoice number and then receive"
            );
            return;
          }
        }
      }

      if (selectedRows.length == 0 && getCustomerTable.length == 1) {
        alertify.error("No data available in the screen for receiving");
        return;
      }
      var d = tempArr.every((val, i, arr) => val === arr[0]);
      if (d == false) {
        if (selectedRows.length == getCustomerTable.length) {
          alertify.error(
            "Selected rows with different invoices can not be received"
          );
          return;
        }
      }

      // if(allValues.invoiceNo == ""){
      //     if(selectedRows.length == getCustomerTable.length){
      //         alertify.error("All rows with different invoices can not be received")
      //         return;
      //     }
      // }

      // setLoading(true);
      var url;
      var data = {
        Plant: selectedPlant.value ? selectedPlant.value : "",
        dt: newData,
        userId: serverDetails.PersonalNo,
      };

      if (bUnit.label == "WIRE") {
        url = "api/LDSM003/CONFIRM_Wires";
      } else if (bUnit.label == "LP") {
        url = "api/LDSM003/CONFIRM_Wires";
      } else if (bUnit.label == "FP") {
        url = "api/LDSM003/CONFIRM";
      } else if (bUnit.label == "TUBES") {
        url = "api/LDSM003/CONFIRM";
      }

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
            if (response.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
            } else {
              if (response.data == "Y") {
                alertify.success("Coil/Batch received successfully");
                setCustomerTable([,]);
                getDataBtnSubmit();
              } else {
                alertify.error(response.data);
              }
            }
          })
          .finally(() => {
            setLoading(false);
          });
      });
    } else {
      alertify.error("No data available in the screen for receiving");
    }
  };

  const returnCoil = async () => {
    if (selectedPlant.value != undefined) {
      var selectedRows = selectedCustomerTable.getSelectedRows();
      var newData = [];
      var tempArr = [];
      var flag = false;
      var flag1 = false;
      
      selectedRows.forEach(function (item) {
        newData.push(item._row.data);
      });

      if (selectedRows.length == 0) {
        alertify.error("No Rows Selected");
        return;
      }

      // if (selectStatus.value != "VA") {
      //   alertify.error("Receive facility is only applicable for VA coils");
      //   return;
      // }

      if (selectedRows.length == 0 && selectedCustomerTable.length == 1) {
        alertify.error("No data available in the screen for receiving");
        return;
      }
      var url;
      var data = {
        Plant: selectedPlant.value ? selectedPlant.value : "",
        dt: newData,
        userId: serverDetails.PersonalNo,
      };
      console.log("data ==>", data);
      if (bUnit.label == "TUBES") {
        url = "api/LDSM003/RETURN_COIL";
      } 

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
            if (response.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
            } else {
              debugger
              if (response.data == "Y") {
                alertify.success(response.data);
                setCustomerTable([,]);
                getDataBtnSubmit();
              } else {
                alertify.error(response.data);
              }
            }
          })
          .finally(() => {
            setLoading(false);
          });
      });
    } else {
      alertify.error("No data available in the screen for receiving");
    }
  };

  const getDataBtnSubmit = async () => {
    // if (selectedPlant.value != undefined) {

    if (!selectedPlant || selectedPlant.value == undefined) {
      alertify.error("Please Select Plant");
      return;
    }

    if (!selectStatus || selectStatus.value == undefined) {
      alertify.error("Please Select Status");
      return;
    }

    if (
      selectStatus &&
      selectStatus.value == "ALL" &&
      !recvDtFrm &&
      !recvDtTo
    ) {
      alertify.error("Please provide Receive from and to date to fetch coils");
      return;
    }

    if (
      odiaValue?.from?.length > 0 &&
      odiaValue?.to.length > 0 &&
      (odiaValue?.from?.length <= 1 || odiaValue?.to?.length <= 1)
    ) {
      if (
        (odiaValue?.from.length > 0 ? Number(odiaValue?.from[0]) : 0) >
        (odiaValue?.to.length > 0 ? Number(odiaValue?.to[0]) : 0)
      ) {
        alertify.error("Please Select the Odia Properly!");
        return;
      }
    }
    if (
      lengthValue?.from?.length > 0 &&
      lengthValue?.to?.length > 0 &&
      (lengthValue?.from?.length <= 1 || lengthValue?.to?.length <= 1)
    ) {
      if (
        (lengthValue?.from.length > 0 ? Number(lengthValue?.from[0]) : 0) >
        (lengthValue?.to?.length > 0 ? Number(lengthValue?.to[0]) : 0)
      ) {
        alertify.error("Please Select the Length Properly!");
        return;
      }
    }

    if (
      thickValue?.from?.length > 0 &&
      thickValue?.to?.length > 0 &&
      (thickValue?.from?.length <= 1 || thickValue?.to?.length <= 1)
    ) {
      if (
        (thickValue?.from.length > 0 ? Number(thickValue?.from[0]) : 0) >
        (thickValue?.to?.length > 0 ? Number(thickValue?.to[0]) : 0)
      ) {
        alertify.error("Please Select the Thick Properly!");
        return;
      }
    }

    let recvDtDiff = (recvDtTo - recvDtFrm) / (1000 * 60 * 60 * 24);
    if (
      recvDtTo &&
      recvDtFrm &&
      recvDtTo != "" &&
      recvDtFrm != "" &&
      recvDtDiff > 366
    ) {
      alertify.error("Receive date range should not be greater than 366 days");
      return;
    }
    var url = "";

    var data = {
      Plant: selectedPlant.value ? selectedPlant.value : "",
      Status: selectStatus.value ? selectStatus.value : "",
      BATCH_ID: allValues.batchId ? allValues.batchId : "",
      //TDC: allValues.tdc,
      RECVDTFROM: recvDtFrm
        ? recvDtFrm
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "",
      RECVDTTO: recvDtTo
        ? recvDtTo
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "",
      PROCDTFROM: procDtFrm
        ? procDtFrm
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "",
      PROCDTTO: procDtTo
        ? procDtTo
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "",
      //ProdCd: allValues.prodCd,
      // QltyCd: allValues.qualityCd,
      Thick1: thickValue?.from,
      Thick2: thickValue?.to,
      Width1: odiaValue?.from,
      Width2: odiaValue?.to,
      Length1: lengthValue?.from,
      Length2: lengthValue?.to,
      // Width1: allValues.widthFrm ? allValues.widthFrm : "",
      // Width2: allValues.widthTo ? allValues.widthTo : "",

      Material: allValues.materialNo ? allValues.materialNo : "",
      INVOICE: allValues.invoiceNo ? allValues.invoiceNo : "",
      INVOICE_DTFROM: invDtFrm
        ? invDtFrm
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "",
      INVOICE_DTTO: invDtTo
        ? invDtTo
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "",
      coilType:
        selectedCoilType && selectedCoilType.value
          ? selectedCoilType.value
          : "",
    };

    if (bUnit.label == "WIRE") {
      if (selectStatus.value == "VA") {
        alertify.error("Status other than VA is not applicable for Wires SPC");
        return;
      }
      url = "api/LDSM003/getCoils_Wires";
    } else if (bUnit.label == "LP") {
      url = "api/LDSM003/getCoils_LP";
    } else if (bUnit.label == "FP") {
      url = "api/LDSM003/getCoils";
    } else if (bUnit.label == "TUBES") {
      url = "api/LDSM003/getCoils";
    }
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
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("No Data Found");
            setCustomerTable([,]);
          } else {
            var tempInvoiceNoCount = {};

            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setCustomerTable([,]);
            } else {
              //handling response data

              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];
                rows.push({
                  rowId: i,
                  AGE: rowdata.AGE,
                  ARISING: rowdata.ARISING,
                  BALANCE_SLIT_SEC: rowdata.BALANCE_SLIT_SEC,
                  BILLET: rowdata.BILLET,
                  BILLET_PIECE: rowdata.BILLET_PIECE,
                  BOTTOM_REMARKS: rowdata.BOTTOM_REMARKS,
                  EIC_CD_EDGE: rowdata.EIC_CD_EDGE,
                  EIC_CD_EPA: rowdata.EIC_CD_EPA,
                  EIC_CD_PLANT: rowdata.EIC_CD_PLANT,
                  EIC_CD_PROD: rowdata.EIC_CD_PROD,
                  EIC_CD_QLTY_ACTL: rowdata.EIC_CD_QLTY_ACTL,
                  EIC_CD_STATUS: rowdata.EIC_CD_STATUS,
                  EIC_CD_YRD: rowdata.EIC_CD_YRD,
                  EIC_DT_INVOICE: rowdata.EIC_DT_INVOICE,
                  EIC_DT_LOADING: rowdata.EIC_DT_LOADING,
                  EIC_DT_PIECE_UPD: rowdata.EIC_DT_PIECE_UPD,
                  EIC_ID_COIL: rowdata.EIC_ID_COIL,
                  EIC_ID_LOC_X: rowdata.EIC_ID_LOC_X,
                  EIC_ID_LOC_Y: rowdata.EIC_ID_LOC_Y,
                  EIC_ID_OP_DECSN: rowdata.EIC_ID_OP_DECSN,
                  EIC_ID_POS: rowdata.EIC_ID_POS,
                  EIC_ITEM_NO: rowdata.EIC_ITEM_NO,
                  EIC_MARK_CUST: rowdata.EIC_MARK_CUST,
                  EIC_MK_CUSTOMER: rowdata.EIC_MK_CUSTOMER,
                  EIC_MS_PIECE_ACTL: rowdata.EIC_MS_PIECE_ACTL,
                  EIC_NO_INVOICE: rowdata.EIC_NO_INVOICE,
                  EIC_NO_DELIVERY: rowdata.EIC_NO_DELIVERY,
                  EIC_NO_MATNR: rowdata.EIC_NO_MATNR,
                  EIC_REMARKS: rowdata.EIC_REMARKS,
                  EIC_SEC1: rowdata.EIC_SEC1,
                  EIC_SEC2: rowdata.EIC_SEC2,
                  EIC_LENGTH: rowdata.EIC_LENGTH,
                  EIC_TDC_ACTL: rowdata.EIC_TDC_ACTL,
                  EIC_WO_NO: rowdata.EIC_WO_NO,
                  EPA_AGE: rowdata.EPA_AGE,
                  EPA_PASSED_PROC: rowdata.EPA_PASSED_PROC,
                  EPA_Passed_Proc: rowdata.EPA_Passed_Proc,
                  FILE_NAME: rowdata.FILE_NAME,
                  GROSS_YILED: rowdata.GROSS_YILED,
                  INV_DAYS: rowdata.INV_DAYS,
                  MS_SCRAP: rowdata.MS_SCRAP,
                  VEHICAL_NO: rowdata.VEHICAL_NO,
                  ORDER_ITEM: rowdata.ORDER_ITEM,
                  ORDER_NO: rowdata.ORDER_NO,
                  ORDER_STATUS: rowdata.ORDER_STATUS,
                  ORDER_TYPE: rowdata.ORDER_TYPE,
                  PASSED_PROC: rowdata.PASSED_PROC,
                  PRIME: rowdata.PRIME,
                  PRIME_YIELD: rowdata.PRIME_YIELD,
                  PROCESSED_PRM: rowdata.PROCESSED_PRM,
                  PROC_DAYS: rowdata.PROC_DAYS,
                  PROD_GRP: rowdata.PROD_GRP,
                  EIC_NO_CAST: rowdata.EIC_NO_CAST,
                  QUALITY_DESC: rowdata.QUALITY_DESC,
                  RESIDUAL_WEIGHT: rowdata.RESIDUAL_WEIGHT,
                  SALVAGING_REMARKS: rowdata.SALVAGING_REMARKS,
                  SCRAP_REMARKS: rowdata.SCRAP_REMARKS,
                  STATUS_DESC: rowdata.STATUS_DESC,
                  TIME: rowdata.TIME,
                  TOP_REMARKS: rowdata.TOP_REMARKS,
                  TRANSIT_LEAD: rowdata.TRANSIT_LEAD,
                  WORK_CENTER: rowdata.WORK_CENTER,
                  txtLocX: rowdata.txtLocX,
                  txtLocY: rowdata.txtLocY,
                  txtLocZ: rowdata.txtLocZ,
                  txtRemarks: rowdata.txtRemarks,
                  txtyrd: rowdata.txtyrd,
                });
                if (tempInvoiceNoCount[rowdata.EIC_NO_INVOICE]) {
                  tempInvoiceNoCount[rowdata.EIC_NO_INVOICE] += 1;
                } else {
                  tempInvoiceNoCount[rowdata.EIC_NO_INVOICE] = 1;
                }
              }
              setInvoiceNoCount(tempInvoiceNoCount);
              setCustomerTable(rows);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
      // } else {
      //     alertify.error("Please Select Plant!");
      // }
    });
  };

  const options = {
    height: 400,
    pagination: "local",
    paginationSize: 200,
    layout: "fitDataFill",
    downloadDataFormatter: (data) => data,
    downloadReady: (fileContents, blob) => blob,
    // responsiveLayout:"collapse",
    // responsiveLayoutCollapseStartOpen:false,
  };

  const customerOrderColumn = [
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
      field: "EIC_NO_INVOICE",
      title: "Invoice No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_NO_DELIVERY",
      title: "Delivery No",
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
          return value.toFixed(3);
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
      //     return value.toFixed(3);
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
          return value.toFixed(3);
        }
        return value.toFixed(3);
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      field: "RESIDUAL_WEIGHT",
      title: "Residual Wt(MT)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value.toFixed(3);
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      field: "MS_SCRAP",
      title: "Scrap Wt(MT)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value.toFixed(3);
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
    {
      field: "EIC_NO_MATNR",
      title: "Material Number",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_DT_LOADING",
      title: "Arrival Date",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "field": "TRANSIT_LEAD", "title": "Transit Lead Time(Days)", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "TIME", "title": "Time", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "EIC_DT_PIECE_UPD", "title": "Process Date", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "EIC_MS_PIECE_ACTL", "title": "SPC Weight", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" ,bottomCalc:"sum", bottomCalcParams:{precision:3} },
    // { "field": "BILLET", "title": "No of Billet", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "BILLET_PIECE", "title": "Billet Piece Wt", "headerFilter": "input", "headerFilterPlaceholder": "search..." ,bottomCalc:"sum", bottomCalcParams:{precision:3} },
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
      field: "EIC_REMARKS",
      title: "Remarks",
      editor: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    // { "field": "PROC_DAYS", "title": "No Proc Days", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "INV_DAYS", "title": "No Inv Days", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // {
    //   field: "AGE",
    //   title: "Age",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      field: "EPA_AGE",
      title: "Age at Plant",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
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
    // { "field": "SCRAP_REMARKS", "title": "Remarks of Scrap", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
  ];
  const customerOrderColumn0788 = (varVal) => {
    return [
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
      {
        field: "STATUS_DESC",
        title: "Status Desc",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        frozen: true,
      },
      {
        field: "STORE_LOCATION",
        title: "Store Location",
        headerFilter: "input",
        editor: "select",
        formatter: function (cell, formatterParams) {
          var value = cell.getValue();
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
          return value;
        },
        editorParams: {
          allowEmpty: false,
          showListOnEmpty: true,
          values: varVal,
        },
        headerFilterPlaceholder: "search...",
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
            return value.toFixed(3);
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
        //     return value.toFixed(3);
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
            return value.toFixed(3);
          }
          return value.toFixed(3);
        },
        bottomCalc: "sum",
        bottomCalcParams: { precision: 3 },
      },
      {
        field: "RESIDUAL_WEIGHT",
        title: "Residual Wt(MT)",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        formatter: function (cell, formatterParams) {
          var value = cell.getValue();
          if (value) {
            return value.toFixed(3);
          }
          return value.toFixed(3);
        },
        bottomCalc: "sum",
        bottomCalcParams: { precision: 3 },
      },
      {
        field: "MS_SCRAP",
        title: "Scrap Wt(MT)",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        formatter: function (cell, formatterParams) {
          var value = cell.getValue();
          if (value) {
            return value.toFixed(3);
          }
          return value.toFixed(3);
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
      {
        field: "EIC_NO_MATNR",
        title: "Material Number",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
      },
      {
        field: "EIC_DT_LOADING",
        title: "Arrival Date",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
      },
      // { "field": "TRANSIT_LEAD", "title": "Transit Lead Time(Days)", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
      // { "field": "TIME", "title": "Time", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
      // { "field": "EIC_DT_PIECE_UPD", "title": "Process Date", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
      // { "field": "EIC_MS_PIECE_ACTL", "title": "SPC Weight", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" ,bottomCalc:"sum", bottomCalcParams:{precision:3} },
      // { "field": "BILLET", "title": "No of Billet", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
      // { "field": "BILLET_PIECE", "title": "Billet Piece Wt", "headerFilter": "input", "headerFilterPlaceholder": "search..." ,bottomCalc:"sum", bottomCalcParams:{precision:3} },
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
        field: "EIC_REMARKS",
        title: "Remarks",
        editor: "input",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        formatter: function (cell, formatterParams) {
          var value = cell.getValue();
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
          return value;
        },
      },
      // { "field": "PROC_DAYS", "title": "No Proc Days", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
      // { "field": "INV_DAYS", "title": "No Inv Days", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
      // {
      //   field: "AGE",
      //   title: "Age",
      //   headerFilter: "input",
      //   headerFilterPlaceholder: "search...",
      // },
      {
        field: "EPA_AGE",
        title: "Age at Plant",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
      },
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
      // { "field": "SCRAP_REMARKS", "title": "Remarks of Scrap", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    ];
  };

  const downloadExcelcustomerTableData = () => {
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
    var fileName = "LDSM003 " + date.toString() + ".xlsx";
    selectedCustomerTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleClearAll = () => {
    setSelectedPlant([]);
    setSelectStatus([]);
    setAllValues({});
    setRecvDtFrm(null);
    setRecvDtTo(null);
    setInvDtFrm(null);
    setInvDtTo(null);
    setProcDtFrm(null);
    setProcDtTo(null);
    setOdiaValue({
      from: [],
      to: [],
    });
    setThickValue({
      from: [],
      to: [],
    });
    setLengthValue({
      from: [],
      to: [],
    });
    setThickData([]);
    setOdiaData([]);
    setLengthData([]);
    setSelectedCoilType([]);

    setSelectedOdiaFrm([]);
    setSelectedOdiaTo([]);

    setSelectedCustomerTable(null);
    setCustomerTable([,]);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Planning & Scheduling"
        page="Receive Raw Material"
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
                      <Grid item xs={2}>
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
                          onChange={handlePlantChange}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ zIndex: 5 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Status*{" "}
                        </MDTypography>
                        <ReactSelect
                          id="status"
                          options={statusList}
                          value={selectStatus}
                          onChange={handleStatusChange}
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
                          Batch Id{" "}
                        </MDTypography>
                        <MDInput
                          name="batchId"
                          value={allValues.batchId || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>
                      {/* <Grid item xs={1} style={{ marginTop: "1rem" }}>
                                                <Button variant="text" onClick={() => btnBatchDetails(true)}> Click Here</Button>
                                            </Grid>                                             */}

                      {/* recvDtFrm
                                                recvDtTo
                                                invDtFrm
                                                invDtTo
                                                procDtFrm
                                                procDtTo */}
                      <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Recv Date From{" "}
                        </MDTypography>
                        <DatePicker
                          id="receiDtFrm"
                          value={recvDtFrm}
                          onChange={(date) => setRecvDtFrm(date)}
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
                          Recv Date To{" "}
                        </MDTypography>
                        <DatePicker
                          id="receiDtTo"
                          value={recvDtTo}
                          onChange={(date) => setRecvDtTo(date)}
                        />
                      </Grid>

                      {/* <Grid item xs={0.75}>
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
                        <MDInput
                          type="number"
                          name="thikFrm"
                          value={allValues.thikFrm || ""}
                          onChange={(e) => handleChange(e)}
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
                          {" "}
                          Thick To{" "}
                        </MDTypography>
                        <MDInput
                          type="number"
                          name="thikTo"
                          value={allValues.thikTo || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>

                      <Grid item xs={1.25} style={{ zIndex: 5 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          ODia From{" "}
                        </MDTypography>
                        <ReactSelect
                          id="odiafrm"
                          options={odiaFrmList}
                          value={selectedOdiaFrm}
                          onChange={handleOdiaFrmChange}
                        />
                      </Grid>
                      <Grid item xs={1.25} style={{ zIndex: 5 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          {" "}
                          ODia To{" "}
                        </MDTypography>
                        <ReactSelect
                          id="odiato"
                          options={odiaToList}
                          value={selectedOdiaTo}
                          onChange={handleOdiaToChange}
                        />
                      </Grid> */}
                      {lengthValue?.to?.length <= 1 ? (
                        <Grid item xs={lengthValue?.from?.length > 1 ? 2 : 1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Length From{" "}
                          </MDTypography>
                          {/* <MDInput type="number" name="thikFrm" value={allValues.thikFrm || ''} onChange={(e) => handleChange(e)} /> */}
                          <MultipleSelect
                            value={lengthValue.from}
                            setValue={(val) =>
                              setLengthValue({ ...lengthValue, from: val })
                            }
                            data={lengthData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                      ) : null}
                      {lengthValue?.from?.length <= 1 ? (
                        <Grid item xs={lengthValue?.to?.length > 1 ? 2 : 1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Length To{" "}
                          </MDTypography>
                          {/* <MDInput type="number" name="thikTo" value={allValues.thikTo || ''} onChange={(e) => handleChange(e)} /> */}
                          <MultipleSelect
                            value={lengthValue.to}
                            setValue={(val) =>
                              setLengthValue({ ...lengthValue, to: val })
                            }
                            data={lengthData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                      ) : null}
                      {thickValue?.to?.length <= 1 ? (
                        <Grid item xs={thickValue?.from?.length > 1 ? 2 : 1}>
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
                            setValue={(val) =>
                              setThickValue({ ...thickValue, from: val })
                            }
                            data={thickData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                      ) : null}
                      {thickValue?.from?.length <= 1 ? (
                        <Grid item xs={thickValue?.to?.length > 1 ? 2 : 1}>
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
                            setValue={(val) =>
                              setThickValue({ ...thickValue, to: val })
                            }
                            data={thickData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                      ) : null}

                      {odiaValue?.to?.length <= 1 ? (
                        <Grid item xs={odiaValue?.from?.length > 1 ? 2 : 1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Odia From{" "}
                          </MDTypography>
                          <MultipleSelect
                            value={odiaValue?.from}
                            setValue={(val) =>
                              setOdiaValue({ ...odiaValue, from: val })
                            }
                            data={odiaData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                      ) : null}

                      {odiaValue?.from?.length <= 1 ? (
                        <Grid item xs={odiaValue?.to?.length > 1 ? 2 : 1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Odia To{" "}
                          </MDTypography>
                          <MultipleSelect
                            value={odiaValue?.to}
                            setValue={(val) =>
                              setOdiaValue({ ...odiaValue, to: val })
                            }
                            data={odiaData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                      ) : null}

                      <Grid item xs={1.25}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Invoice No{" "}
                        </MDTypography>
                        <MDInput
                          type="number"
                          name="invoiceNo"
                          value={allValues.invoiceNo || ""}
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
                          Material No{" "}
                        </MDTypography>
                        <MDInput
                          type="number"
                          name="materialNo"
                          value={allValues.materialNo || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>

                      {/* <Grid item xs={0.75}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >TDC </MDTypography>
                                                <MDInput name="tdc" value={allValues.tdc || ''} onChange={(e) => handleChange(e)} />
                                            </Grid> */}

                      <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          {" "}
                          Invoice Date From{" "}
                        </MDTypography>
                        <DatePicker
                          id="invoiceDtFrm"
                          value={invDtFrm}
                          onChange={(date) => setInvDtFrm(date)}
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
                          {" "}
                          Invoice Date To{" "}
                        </MDTypography>
                        <DatePicker
                          id="invoiceDtTo"
                          value={invDtTo}
                          onChange={(date) => setInvDtTo(date)}
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
                          {" "}
                          Proc Date From{" "}
                        </MDTypography>
                        <DatePicker
                          id="processingDtFrm"
                          value={procDtFrm}
                          onChange={(date) => setProcDtFrm(date)}
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
                          Proc Date To{" "}
                        </MDTypography>
                        <DatePicker
                          id="processingDtTo"
                          value={procDtTo}
                          onChange={(date) => setProcDtTo(date)}
                        />
                      </Grid>

                      <Grid item xs={1.5} style={{ zIndex: 5 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Coil Type{" "}
                        </MDTypography>
                        {/* <MDInput type="number" name="widthFrm" value={allValues.widthFrm || ''} onChange={(e) => handleChange(e)} /> */}
                        <ReactSelect
                          id="coiltype"
                          options={coilTypeList}
                          value={selectedCoilType}
                          onChange={handleCoilTypeChange}
                        />
                      </Grid>

                      <Grid item xs={1}>
                        {" "}
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getDataBtnSubmit(true)}
                        >
                          {" "}
                          Submit{" "}
                        </MDButton>{" "}
                      </Grid>
                      {/* <Grid item xs={1} > <Button style={{ marginTop: "1.5rem" }} variant="text" onClick={() => getData(true)}> Confirm</Button></Grid> */}
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
                          Receive Raw Material
                        </MDTypography>
                      </Grid>
                      {/* <Grid item xs={2}></Grid> */}
                      <Grid item xs={2}>
                        <Tooltip title="Receive Coil" arrow>
                          <IconButton
                            color="white"
                            disabled={isReadWriteAccess}
                            onClick={() => receiveCoil(true)}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download" arrow>
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelcustomerTableData()}
                          >
                            <DownloadForOfflineIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Return Coil" arrow>
                                <IconButton
                                  color="white"
                                  disabled={isReadWriteAccess}
                                  onClick={() => returnCoil(true)}
                                >
                                  <DeleteIcon />
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
                        <div id="selCustomerTable" />
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {getCustomerTable.length} of{" "}
                          {getCustomerTable.length} entries
                        </p>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
