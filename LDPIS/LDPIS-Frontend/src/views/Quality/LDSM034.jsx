import React, { useEffect, useState, useRef, forwardRef } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import SearchIcon from "@mui/icons-material/Search";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ReactSelect from "components/Select/ReactSelect";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import ListAltIcon from "@mui/icons-material/ListAlt";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import Today from "@mui/icons-material/Today";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import "../../tabulatorCss.scss";
import { useSyncExternalStore } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import LDSM034CastDetailModal from "./Modals/LDSM034CastDetailModal";
import { GetAuthorization } from "../../utils";
import { number } from "prop-types";
import { debug } from "util";


export default function TubePlanning() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [ordType, setOrdType] = useState([]);
  const [customerDesc, setCustomerDesc] = useState([]);
  const [qualityDataTable, setqualityDataTable] = useState(null);
  const [qualityResultDataTable, setqualityResultDataTable] = useState(null);

  const [plant, setPlant] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [orderItemList, setOrderItemList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [selectedOrderItem, setSelectedOrderItem] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const [qualityData, setqualityData] = useState([]);
  const [qualityResultData, setqualityResultData] = useState([]);
  const [defectRecordingData, setDefectRecordingData] = useState([]);
  const [defectRecordingTableData, setDefectRecordingTableData] = useState([]);
  const [bUnit, setBunit] = useState([]);
  const selectPlantRef = useRef();
  const [allValues, setAllValues] = useState({
    mBatch: "",
    batch: "",
  });

  const [selectedPlantDeci, setSelectedPlantDeci] = useState([]);
  const [allValuesDeci, setAllValuesDeci] = useState({
    batch: "",
    coil: "",
    // status : "",
  });

  const [qaDeciData, setQaDeciData] = useState([]);
  const [qaDeciDataTable, setQaDeciDataTable] = useState(null);

  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  //Main tab value
  const [tabValueMain, setTabValueMain] = useState(0);
  const handleSetTabValueMain = (event, newValue) => setTabValueMain(newValue);

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const [qltyList, setQltyList] = useState([]);
  const [matNoList, setMatNoList] = useState([]);
  const [matNoListUD, setMatNoListUD] = useState([]);

  const [tdcList, setTdcList] = useState([]);
  const [addlProcessList, setAddlProcessList] = useState([]);

  const handleChangeDeci = (e) => {
    setAllValuesDeci({ ...allValuesDeci, [e.target.name]: e.target.value });
  };

  const [showCastDetailModal, setShowCastDetailModal] = useState(false);
  const [castDetailData, setCastDetailData] = useState([]);
  const [castNo, setCastNo] = useState("");

  const [valueRadio, setValueRadio] = React.useState("ConfirmUD");

  const qaDeciStatusList = [
    // { label: "%Q", value: "%Q" },
    { label: "%D", value: "%D" },
    // { label: "ZZ", value: "ZZ" },
  ];
  const [qaDeciSelectedStatus, setQaDeciSelectedStatus] = useState([]);
  const [sumPrimeTubes, setSumPrimeTubes] = useState(0);
  const [qrrFlg, setQrrFlg] = useState(-1);
  const [cntResTag, setCntResTag] = useState(0);

  var _cntResTag = 0;
  const [prodTypeTitle, setProdTypeTitle] = useState("");

  const [hideSaveUd, setHideSaveUd] = useState(false);

  const [testResDt, setTestResDt] = useState([]);
  const [testDataTable, setTestDataTable] = useState(null);

  const [testDetailsResDt, setTestDetailsResDt] = useState([]);
  const [testDetailsDataTable, setTestDetailsDataTable] = useState(null);

  const [selectedMbatch, setSelectedMbatch] = useState([]);
  const [selectedbatch, setSelectedbatch] = useState([]);
  const [selectedbatchdt, setSelectedbatchdt] = useState([]);

  const [mbatchList, setMbatchList] = useState([]);
  const [batchList, setBatchList] = useState([]);

  const [totalScrapWt, setTotalScrapWt] = useState(0);
  const [sumScrapWt, setSumScrapWt] = useState(0);
  // const [scrapWtFlag,setScrapWtFlag] = useState(false);
  const [sumScrapTubes, setSumScrapTubes] = useState(0);
  //const [scrapWtFlag,setScrapWtFlag] = useState(false);
  const [showScrapWt, setShowScrapWt] = useState(false);

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization().then((data) => {
      validateUser(data);
      //page load functions here
      Promise.all([getGroupPlantId(data.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  }

  //page load
  useEffect(() => {
    fetchData();
  }, []);

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
      var pageName = "LDSM034";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
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

  //get business code
  const getBusinessCd = (value, accessToken) => {
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
            setSelectedPlant(items[0]);
            setSelectedPlantDeci(items[0]);
            setPlant(items);
            Promise.all([
              getStatusData(items[0], accessToken),
              getBatch(items[0], accessToken),
            ]).finally(() => {
              resolve();
            });
          }
        })
        .catch(() => {
          resolve();
        });
    });
  };

  //get status data
  const getStatusData = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LDSM034/getStatusList";
      var data = {
        plant: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response?.data?.map((row) => {
              var obj = new Object();
              obj.label = row[0];
              obj.value = row[0];
              items.push(obj);
            });
            setStatusList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  //get order list
  const getOrderData = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM034/getOrderList";
      let data = {
        plant: selectedPlant.value,
        statusList: value,
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
            setOrderList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  //use Effect to render display data
  useEffect(() => {
    if (qualityData && qualityData.length > 0) {
      setqualityDataTable(
        new Tabulator("#displayTable", {
          data: qualityData,
          columns: QualityDataColumn,
          height: "100%",
          layout: "fitDataFill",
        })
      );
    }
  }, [qualityData, matNoListUD]);

  //use Effect to render quality result data
  useEffect(() => {
    console.log(qualityResultData);
    if (tabValue === 0) {
      if (qualityResultData && qualityResultData.length > 0) {
        
        setqualityResultDataTable(
          new Tabulator("#getqualityResultTable", {
            data: qualityResultData,
            columns: QualityResultColumn,
            layout: "fitDataFill"
          })
        );
      }
    }
  }, [qualityResultData, tabValue]);
  
  // useEffect(() => {
  //   console.log("qualityResultData:", qualityResultData);
    
  //   if (tabValue === 0 && qualityResultData && qualityResultData.length > 0) {
  //     if (qualityResultDataTable) {
  //       // Update table data if it already exists
  //       qualityResultDataTable.setData(qualityResultData);
  //       console.log("data getting set");
  //     } else {
  //       // Initialize the table if it doesn't exist
  //       const newTable = new Tabulator("#getqualityResultTable", {
  //         data: qualityResultData,
  //         columns: QualityResultColumn,
  //         height: "100%",
  //         layout: "fitDataFill",
  //         renderComplete: function() {
  //           console.log("Table rendered successfully.");
  //         },

  //       });
  //       setqualityResultDataTable(newTable);
  //       console.log("new table set");
  //     }
  //   }
  // }, [qualityResultData, tabValue]);
  

  useEffect(() => {
    if (tabValueMain === 1) {
      if (qaDeciData && qaDeciData.length > 0) {
        setQaDeciDataTable(
          new Tabulator("#qaDeci", {
            data: qaDeciData,
            columns: qaDeciDataColumn,
            height: "400",
            layout: "fitDataFill",
          })
        );
      }
    }
  }, [qaDeciData, tabValueMain, matNoList, addlProcessList]);

  //use effect to render defect recording data
  useEffect(() => {
    if (tabValue === 1) {
      if (defectRecordingData && defectRecordingData.length > 0) {
        setDefectRecordingTableData(
          new Tabulator("#defectrecordingtable", {
            data: defectRecordingData,
            columns: column_defect_recording,
            height: "600",
            // widht : "300",
            layout: "fitDataFill",
          })
        );
      }
    }
  }, [defectRecordingData, tabValue, showScrapWt]);

  const getCustDesc = (value, accessToken) => {
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
        .finally((f) => {
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

      setLoading(true);
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
        .finally((f) => {
          resolve();
        });
    });
  };

  const handlePlantChange = (value) => {
    setSelectedPlant(value);
    // getCustDesc(value);
    // getOrdTyp(value);
    setSelectedOrder([]);
    setSelectedOrderItem([]);
    setSelectedStatus([]);
    setAllValues({});

    setqualityData([,]);
    setqualityDataTable(null);

    setqualityResultData([,]);
    setqualityResultDataTable(null);

    setDefectRecordingData([,]);
    setDefectRecordingTableData(null);
    setShowScrapWt(false);
    setTotalScrapWt(0);
    setSumPrimeTubes(0);
    setLoading(true);
    GetAuthorization().then((data) => {
      Promise.all([
        getBusinessCd(value, data.accessToken),
        getStatusData(value, data.accessToken),
        getBatch(value, data.accessToken),
      ]).finally(() => {
        setLoading(false);
      });
    });
  };

  const handleRadioChange = (e) => {
    setValueRadio(e.target.value);
    if (e.target.value == "RejectUD") {
      getMatNoUD();
    } else {
      setMatNoListUD([,]);
    }
  };

  const handleQAStatusChange = (e) => {
    setQaDeciSelectedStatus(e);

    setQaDeciData([,]);
    setQaDeciDataTable(null);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e);

    setSelectedOrder([]);
    setSelectedOrderItem([]);
    setAllValues({});

    setqualityData([,]);
    setqualityDataTable(null);

    setqualityResultData([,]);
    setqualityResultDataTable(null);

    setDefectRecordingData([,]);
    setDefectRecordingTableData(null);
    setShowScrapWt(false);
    setTotalScrapWt(0);
    setSumPrimeTubes(0);
    if (e?.value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          getProdTypeTitle(e?.value, data.accessToken),
          getOrderData(e?.value, data.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }

    if (selectedStatus == "MQ") {
      setShowScrapWt(true);
    } else {
      setShowScrapWt(false);
    }
  };

  const handleOrderList = (e) => {
    setSelectedOrder(e);
    // getOrderItem(e.value);

    setSelectedOrderItem([]);
    setAllValues({});

    setqualityData([,]);
    setqualityDataTable(null);

    setqualityResultData([,]);
    setqualityResultDataTable(null);

    setDefectRecordingData([,]);
    setDefectRecordingTableData(null);

    setShowScrapWt(false);
    setTotalScrapWt(0);
    setSumPrimeTubes(0);
    if (e?.value) {
      var arr_val = e.value.split(" - ");
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([getOrderItem(arr_val[0], token.accessToken)]).finally(
          () => {
            setLoading(false);
          }
        );
      });
    }
  };

  const handleOrderItemChange = (e) => {
    setSelectedOrderItem(e);

    setAllValues({});

    setqualityData([,]);
    setqualityDataTable(null);

    setqualityResultData([,]);
    setqualityResultDataTable(null);

    setDefectRecordingData([,]);
    setDefectRecordingTableData(null);
  };

  const handlePlantChangeDeci = (e) => {
    setSelectedPlantDeci(e);

    setQaDeciSelectedStatus([]);
    setAllValuesDeci({});
    setQaDeciData([,]);
    setQaDeciDataTable(null);
    // getMatNo(e);
  };

  const getProdTypeTitle = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM034/getprodtypetitle";
      let data = {
        plant: selectedPlant.value,
        status: value,
      };

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            setProdTypeTitle(response.data);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getOrderItem = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM034/orderitem";
      let data = {
        plant: selectedPlant.value,
        orderId: value,
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
              obj.value = row[2];
              items.push(obj);
            });
            setOrderItemList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getDefectRecording = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var selectedRows = qualityDataTable.getSelectedRows();
      var selectedData = [];
      selectedRows.forEach(function (item) {
        // if(item._row.data.LOM_NO_CAST == null){
        //   emptyCast.push(item._row.data.LOM_NO_CAST);
        // }
        selectedData.push({
          // ORDERID: item._row.data.ORDERID,
          // ITEM: item._row.data.ITEM,
          // MATERIAL: item._row.data.MATERIAL,
          // MOTHER_BATCH: item._row.data.MOTHER_BATCH,{Parent Mother Batch Add}
          MOTHER_BATCH: item._row.data.PAR_COIL_NO,
          // LOM_NO_CAST : item._row.data.LOM_NO_CAST,
          BATCH_ID: item._row.data.BATCH_ID,
          PROCESS: item._row.data.CURRENT_PROCESS,
        });
      });

      // if(emptyCast.length > 0){
      //   alertify.error("Please select row with available cast.");
      //   return;
      // }
      var url;

      var data = {
        plant: selectedPlant.value,
        selectedData: selectedData,
      };

      url = "api/LDSM034/defectrecording";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setDefectRecordingData([,]);
            } else {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];
                rows.push({
                  ESR_RSN_CD: rowdata.ESR_RSN_CD,
                  ESR_RSN_DESC: rowdata.ESR_RSN_DESC,
                  TBD_DEFECT_NO_PCS: rowdata.TBD_DEFECT_NO_PCS,
                  TBD_DEFECT_WT: rowdata.TBD_DEFECT_WT,
                  TBD_DEFECT_WT1: rowdata.TBD_DEFECT_WT1,
                });
              }
              setDefectRecordingData(rows);
            }
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const getQRRFlg = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var data = {
        plant: selectedPlant.value,
        status: selectedStatus.value,
      };

      var url = "api/LDSM034/getqrrflg";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              // setqualityData([,]);
              setQrrFlg(-1);
            } else {
              setQrrFlg(response.data);
              if (response.data == 0) {
                setTabValue(1);
                alertify.success("You can proceed with Defect Recording.");
                // tabValue
              }
              // setQrrFlg(0);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getDataFnc = () => {
    //filter criteria

    if (!selectedPlant?.value) {
      alertify.error("Please select Plant ID");
      return;
    }
    if (!selectedStatus?.value) {
      alertify.error("Please select Status");
      return;
    }

    if (!selectedOrder?.value) {
      alertify.error("Please select Order ID");
      return;
    }

    if (selectedOrderItem?.value == "") {
      alertify.error("Please enter Order Item");
      return;
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getData(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getData = (accessToken) => {
    return new Promise((resolve) => {
      //If Session(CommonConstants.SPC_BUS_UNIT) = "TUBES" Or Session(CommonConstants.SPC_BUS_UNIT) = "LP" Then
      setqualityResultData([,]);
      setqualityResultDataTable(null);
      setDefectRecordingData([,]);
      setDefectRecordingTableData(null);

      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var arr_val = selectedOrder.value.split(" - ");

      var data = {
        plant: selectedPlant.value,
        status: selectedStatus.value,
        // order: selectedOrder.value,
        order: arr_val[0],
        mBatch: arr_val[1],
        item: selectedOrderItem.value,
      };

      data = { ...data, ...allValues };

      // getQRRFlg();
      var url = "api/LDSM034/getDisplayData";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setqualityData([,]);
            } else {
              // var rows = [];
              // for (var i in response.data) {
              //   var rowdata = response.data[i];
              //   rows.push({
              //     BATCH_ID: rowdata.BATCH_ID,
              //     CURRENT_PROCESS: rowdata.CURRENT_PROCESS,
              //     GROSS_WT: rowdata.GROSS_WT,
              //     ITEM: rowdata.ITEM,
              //     MATERIAL: rowdata.MATERIAL,
              //     MOTHER_BATCH: rowdata.MOTHER_BATCH,
              //     Mat_Description: rowdata.MAT_DESC,
              //     NET_WT: rowdata.NET_WT,
              //     ORDERID: rowdata.ORDERID,
              //     PRODUCT: rowdata.PRODUCT,
              //     QUALITY: rowdata.QUALITY,
              //     STATUS: rowdata.STATUS,
              //     THICKNESS: rowdata.THINCKNESS,
              //     LOM_NO_CAST : rowdata.LOM_NO_CAST,
              //     CUSTOMER : rowdata.CUSTOMER,
              //     PROD_TYPE : rowdata.PROD_TYPE
              //     // THINCKNESS: rowdata.THINCKNESS,
              //   });
              // }
              // setqualityData(rows);
              setHideSaveUd(false);
              setqualityData(response.data);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handleConfirmUD = () => {
    var selectedRows = qualityDataTable.getSelectedRows();
    var selectedData = [];
    selectedRows.forEach(function (item) {
      selectedData.push({
        BATCH_ID: item._row.data.BATCH_ID,
        // CURRENT_PROCESS : item._row.data.CURRENT_PROCESS ,
        // CUSTOMER : item._row.data.CUSTOMER ,
        LOM_IDIA: item._row.data.LOM_IDIA,
        LOM_NO_CAST: item._row.data.LOM_NO_CAST,
        LOM_NO_PIECES: item._row.data.LOM_NO_PIECES,
        LOM_ODIA: item._row.data.LOM_ODIA,
        LOM_PASSED_PROC: item._row.data.LOM_PASSED_PROC,
        LOM_SEC2: item._row.data.LOM_SEC2,
        // GROSS_WT : item._row.data.GROSS_WT ,
        ITEM: item._row.data.ITEM,
        MATERIAL: item._row.data.MATERIAL,
        MOTHER_BATCH: item._row.data.MOTHER_BATCH,
        // Mat_Description : item._row.data.Mat_Description,
        NET_WT: item._row.data.NET_WT,
        ORDERID: item._row.data.ORDERID,
        // PRODUCT : item._row.data.PRODUCT ,
        PROD_END_TM: item._row.data.PROD_END_TM,
        PROD_STRT_TM: item._row.data.PROD_STRT_TM,
        // PROD_TYPE : item._row.data.PROD_TYPE ,
        // QUALITY : item._row.data.QUALITY ,
        // STATUS : item._row.data.STATUS ,
        THICKNESS: item._row.data.THICKNESS,
      });
    });
    //no row selected alert
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      return;
    }

    var data = {
      plant: selectedPlant.value,
      personalNo: serverDetails.PersonalNo,
      flag: "UDCONFIRM",
      selectedData: selectedData,
    };

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LDSM034/confirmud";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
            } else {
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const handleSaveUD = async (newToken = false) => {
    debugger;
    
    if (valueRadio == "") {
      alertify.error("No Action Selected.");
      return;
    }

    var work_cent_chk = false;
    var selectedRows = qualityDataTable.getSelectedRows();
    var selectedData = [],
      batch_no_action = [],
      batch_rej_no_mat = [],
      flag = "";
    selectedRows.forEach(function (item) {
      if (valueRadio == "RejectUD" && item._row.data.MAT_NO == undefined) {
        batch_rej_no_mat.push(item._row.data.BATCH_ID);
      }

      let mat_no = "";
      if (valueRadio == "RejectUD" && item._row.data.MAT_NO != undefined) {
        mat_no = item._row.data.MAT_NO;
      } else {
        mat_no = item._row.data.MATERIAL;
      }

      //CONFIRM UD THEN
      if (valueRadio == "ConfirmUD" && item._row.data.PROD_TYPE == "SFG") {
        flag = "SFGGR";
      } else if (
        valueRadio == "ConfirmUD" &&
        item._row.data.PROD_TYPE == "FG"
      ) {
        // flag = "FGGR";
        flag = item._row.data.STATUS;
      } else if (
        valueRadio == "ConfirmUD" &&
        //(item._row.data.STATUS == "KB" || item._row.data.STATUS == "KD") // 20-06-2023 changed
        item._row.data.STATUS == "KQ"
      ) {
        flag = item._row.data.STATUS;
      }

      if (valueRadio == "RejectUD" && item._row.data.PROD_TYPE == "SFG") {
        flag = "SFGDOWNGRADE";
      } else if (valueRadio == "RejectUD" && item._row.data.PROD_TYPE == "FG") {
        flag = "FGDOWNGRADE";
      }

      if (
        item._row.data.LOM_WORK_CENTER == undefined ||
        item._row.data.LOM_WORK_CENTER == ""
      ) {
        work_cent_chk = true;
      }

      selectedData.push({
        BATCH_ID: item._row.data.BATCH_ID,
        CURRENT_PROCESS: item._row.data.CURRENT_PROCESS,
        // CUSTOMER : item._row.data.CUSTOMER ,
        LOM_IDIA: item._row.data.LOM_IDIA,
        LOM_NO_CAST: item._row.data.LOM_NO_CAST,
        LOM_NO_PIECES: item._row.data.LOM_NO_PIECES,
        LOM_ODIA: item._row.data.LOM_ODIA,
        LOM_PASSED_PROC: item._row.data.LOM_PASSED_PROC,
        LOM_SEC2: item._row.data.LOM_SEC2,
        // GROSS_WT : item._row.data.GROSS_WT ,
        ITEM: item._row.data.ITEM,
        // MATERIAL : item._row.data.MATERIAL ,
        MATERIAL: mat_no,
        // MOTHER_BATCH: item._row.data.MOTHER_BATCH, {Add Parent Mother Batch}
        MOTHER_BATCH: item._row.data.PAR_COIL_NO,
        // Mat_Description : item._row.data.Mat_Description,
        NET_WT: item._row.data.NET_WT,
        ORDERID: item._row.data.ORDERID,
        // PRODUCT : item._row.data.PRODUCT ,
        PROD_END_TM: item._row.data.PROD_END_TM,
        PROD_STRT_TM: item._row.data.PROD_STRT_TM,
        // PROD_TYPE : item._row.data.PROD_TYPE ,
        // QUALITY : item._row.data.QUALITY ,
        STATUS: item._row.data.STATUS,
        THICKNESS: item._row.data.THICKNESS,
        // ACTION : item._row.data.ACTION ? item._row.data.ACTION : "" ,
        // MAT_NO : item._row.data.MAT_NO ? item._row.data.MAT_NO : "" ,
        LOM_CD_NEXT_PROC: item._row.data.LOM_CD_NEXT_PROC,
        LOM_WORK_CENTER: item._row.data.LOM_WORK_CENTER,
        REMARKS: item._row.data.REMARKS,
        CRT_DT: item._row.data.CRT_DT,
      });
    });

    //no row selected alert
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      return;
    }

    if (batch_no_action.length > 0) {
      alertify.error("Please select actions for " + batch_no_action.toString());
      return;
    }

    if (batch_rej_no_mat.length > 0) {
      alertify.error(
        "Please select material Numbers for " + batch_rej_no_mat.toString()
      );
      return;
    }

    if (work_cent_chk == true) {
      alertify.error("Work center is null");
      return;
    }

    if (selectedStatus.value == "MQ" && valueRadio == "ReturnToProd") {
      var d = {
        plant: selectedPlant.value,
        personalNo: serverDetails.PersonalNo,
        flag: "MQ",
        ACTION: valueRadio,
        selectedData: selectedData,
      };
      setLoading(true);
      var url = "api/LDSM034/saveudReturn";
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        axiosAPI
          .post(url, d, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
              setLoading(false);
            } else {
              setHideSaveUd(true);
              var msg = "";
              if (response.data.res_n.length == 0) {
                msg = "Save UD successful for all coils";
              } else if (response.data.res_n.length == 1) {
                response.data.res_n_msg.map((val) => {
                  msg += val.toString() + "\n";
                });
              } else {
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
              if (response.data.res_n.length == 0) {
                alertify.success(msg);
              } else if (response.data.res_n.length == 1) {
                alertify.error(msg);
              }

              if (response.data.res_n.length == 0) {
                setqualityResultData([,]);
                setqualityResultDataTable(null);

                setDefectRecordingData([,]);
                setDefectRecordingTableData(null);

                Promise.all([getData(token.accessToken)]).finally(() => {
                  setLoading(false);
                });
              } else {
                setLoading(false);
              }
            }
          })
          .catch(() => {
            setLoading(false);
          });
      });
    } else {
      debugger;
      var data = {
        plant: selectedPlant.value,
        personalNo: serverDetails.PersonalNo,
        flag: flag,
        ACTION: valueRadio,
        selectedData: selectedData,
      };

      setLoading(true);
      var url = "api/LDSM034/saveud";
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
              setLoading(false);
            } else {
              setHideSaveUd(true);
              if (response.data == "1") {
                setLoading(false);
                alertify.error(
                  "Save UD can not be done with failed Quality result."
                );
                return;
              } else if (response.data == "2") {
                setLoading(false);
                alertify.error(
                  "Save UD can not be done without defect recording."
                );
                return;
              } else if (response.data == "3") {
                setLoading(false);
                alertify.error(
                  "Save UD can not be done without defect recording and with failed Quality result."
                );
                return;
              } else if (response.data == "4") {
                setLoading(false);
                alertify.error(
                  "Save UD can not be done without defect recording and without Quality result recording."
                );
                return;
              } else if (response.data == "5") {
                setLoading(false);
                alertify.error(
                  "Save UD can not be done without Quality result recording."
                );
                return;
              } else if (response.data == "6") {
                setLoading(false);
                alertify.error(
                  "Save UD can only be done after All Quality result recording are saved."
                );
                return;
              } else if (response.data == "7") {
                setLoading(false);
                alertify.error("UD already done!");
                return;
              } else {
                var msg = "";
                if (response.data.res_n.length == 0) {
                  msg = "Save UD successful for all coils";
                } else if (response.data.res_n.length == 1) {
                  response.data.res_n_msg.map((val) => {
                    msg += val.toString() + "\n";
                  });
                } else {
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
                if (response.data.res_y.length == 0) {
                  response.data.res_n_msg.map((val) => {
                    msg += val.toString() + "\n";
                  });
                  //alertify.error(msg);
                  var msge = alertify.error('Default message');
                  msge.delay(8).setContent(msg);
                } else {
                  alertify.success(msg);
                }
                //alertify.success(msg);
                if (response.data.res_n.length == 0) {
                  setqualityResultData([,]);
                  setqualityResultDataTable(null);

                  setDefectRecordingData([,]);
                  setDefectRecordingTableData(null);

                  Promise.all([getData(token.accessToken)]).finally(() => {
                    setLoading(false);
                  });
                } else {
                  setLoading(false);
                }
              }
            }
          })
          .catch(() => {
            setLoading(false);
          });
      });
    }
  };

  const getDataDeciFnc = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getDataDeci(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getDataDeci = (accessToken) => {
    //If Session(CommonConstants.SPC_BUS_UNIT) = "TUBES" Or Session(CommonConstants.SPC_BUS_UNIT) = "LP" Then
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var data = {
        plant: selectedPlantDeci.value,
        status: qaDeciSelectedStatus ? qaDeciSelectedStatus.value : "",
      };

      data = { ...data, ...allValuesDeci };

      //filter criteria
      if (!data.plant) {
        alertify.error("Please select Plant ID");
        return;
      }

      setLoading(true);
      var url = "api/LDSM034/getdatadeci";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setQaDeciData([,]);
            } else {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];
                rows.push({
                  LOM_CD_EPA: rowdata.LOM_CD_EPA,
                  LOM_ID_FIRST_PAR: rowdata.LOM_ID_FIRST_PAR,
                  ENC_CUST_NAME: rowdata.ENC_CUST_NAME,
                  LOM_CD_CURR_PROC: rowdata.LOM_CD_CURR_PROC,
                  LOM_CD_NEXT_PROC: rowdata.LOM_CD_NEXT_PROC,
                  LOM_CD_PROD: rowdata.LOM_CD_PROD,
                  LOM_CD_QLTY_ACTL: rowdata.LOM_CD_QLTY_ACTL,
                  LOM_CD_QLTY_AIM: rowdata.LOM_CD_QLTY_AIM,
                  LOM_CD_STATUS: rowdata.LOM_CD_STATUS,
                  LOM_CD_ST_ACTL: rowdata.LOM_CD_ST_ACTL,
                  LOM_ID_BATCH: rowdata.LOM_ID_BATCH,
                  LOM_ID_ORDER_CUS: rowdata.LOM_ID_ORDER_CUS,
                  LOM_ID_ORD_ITEM_CUS: rowdata.LOM_ID_ORD_ITEM_CUS,
                  LOM_LENGTH: rowdata.LOM_LENGTH,
                  LOM_MS_GROSS_ACTL: rowdata.LOM_MS_GROSS_ACTL,
                  LOM_MS_GROSS_CAL: rowdata.LOM_MS_GROSS_CAL,
                  LOM_MS_PIECE_ACTL: rowdata.LOM_MS_PIECE_ACTL,
                  LOM_PROD_HOLD: rowdata.LOM_PROD_HOLD,
                  LOM_SEC1: rowdata.LOM_SEC1,
                  LOM_SEC2: rowdata.LOM_SEC2,
                  LOM_TDC_ACTL: rowdata.LOM_TDC_ACTL,
                  LOM_TDC_AIM: rowdata.LOM_TDC_AIM,
                  LOM_WFL_STATUS: rowdata.LOM_WFL_STATUS,
                  MATNO: rowdata.MATNO,
                  MAT_DESC: rowdata.MAT_DESC,
                  HOLD_CD: rowdata.HOLD_CD,
                  OPR_REMARKS: rowdata.OPR_REMARKS,
                  HOLD_DESC: rowdata.HOLD_DESC,
                });
              }
              setQaDeciData(rows);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getScrapWt = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var selectedRows = qualityDataTable.getSelectedRows();
      var selectedData = [];
      selectedRows.forEach(function (item) {
        selectedData.push({
          // MOTHER_BATCH: item._row.data.MOTHER_BATCH,{Add Parent Mother batch} 
          MOTHER_BATCH: selectedStatus.value === "MQ" ? item._row.data.PAR_COIL_NO : item._row.data.BATCH_ID,
          BATCH_ID: item._row.data.BATCH_ID,
          PROCESS: selectedStatus.value === "MQ" ? "M" : item._row.data.CURRENT_PROCESS,
        });
      });
      var data = {
        plant: selectedPlant.value,
        selectedData: selectedData,
      };
      //setLoading(true);
      var url = "api/LDSM034/getScrapWt";

      axiosAPI
        .post(url, data, defaultOptions)
        .then(
          (response) => {

            if (response.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
            } else {
              setTotalScrapWt(response.data[0].SCRAP_WT.toFixed(3));
              setSumPrimeTubes(response.data[0].LOM_NO_PIECES);
              setShowScrapWt(true);
            }
          },
          [showScrapWt]
        )
        .finally((f) => {
          resolve();
        });
    });

  };

  const TestDataColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Test Code",
      field: "CODE_VALUE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
    {
      title: "Test Parameter",
      field: "TC_ELEMENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
    {
      title: "Description",
      field: "CODE_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
    {
      title: "Minimum Value",
      field: "INT_MIN_SPEC_VAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 150,
    },
    {
      title: "Maximum Value",
      field: "INT_MAX_SPEC_VAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 150,
    },
    {
      title: "Test UOM",
      field: "CODE_SUB_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 190,
    },
    // {
    //   title: "Test Value",
    //   // field: "VALUE",
    //   field: "ACTUAL_RECORD_VAL",
    //   // editor: "number",
    //   // editor:"input",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   width: 150,
    //   editor: function (cell, onRendered, success, cancel, editorParams) {
    //     var drop_chk = cell._cell.row.data.DROP_CHK;

    //     if (drop_chk == 0) {
    //       var editor = document.createElement("input");
    //       editor.setAttribute("type", "number");
    //       editor.style.padding = "3px";
    //       editor.style.width = "100%";
    //       editor.style.boxSizing = "border-box";
    //       editor.value = cell.getValue() ? cell.getValue() : "";
    //       onRendered(function () {
    //         editor.focus();
    //         editor.style.css = "100%";
    //       });

    //       function successFunc() {
    //         success(editor.value);
    //       }

    //       editor.addEventListener("change", successFunc);
    //       editor.addEventListener("blur", successFunc);

    //       return editor;
    //     } else {
    //       var editor = document.createElement("select");
    //       var editorParams = [
    //         { key: "PASSED", value: "PASSED" },
    //         { key: "FAILED", value: "FAILED" },
    //         { key: "OK", value: "OK" },
    //         { key: "NOT OK", value: "NOT OK" },
    //         { key: "SATISFACTORY", value: "SATISFACTORY" },
    //         { key: "NOT SATISFACTORY", value: "NOT SATISFACTORY" },
    //         { key: "N.S.", value: "N.S." },
    //         { key: "N.A.", value: "N.A." },
    //         { key: "N.G.", value: "N.G." },
    //         { key: "WITHIN LIMIT", value: "WITHIN LIMIT" },
    //         { key: "FULL FLATENING", value: "FULL FLATENING" },
    //       ];
    //       for (var i = 0; i < editorParams.length; i++) {
    //         var opt = document.createElement("option");
    //         opt.value = editorParams[i].key;
    //         opt.innerHTML = editorParams[i].value;
    //         editor.appendChild(opt);
    //       }

    //       editor.style.padding = "3px";
    //       editor.style.width = "100%";
    //       editor.style.boxSizing = "border-box";

    //       editor.value = cell.getValue();

    //       onRendered(function () {
    //         editor.focus();
    //         editor.style.css = "100%";
    //       });

    //       function successFunc() {
    //         success(editor.value);
    //       }

    //       editor.addEventListener("change", successFunc);
    //       editor.addEventListener("blur", successFunc);

    //       return editor;
    //     }
    //   },
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();

    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     if (value) {
    //       var drop_val = cell._cell.row.data.ACTUAL_RECORD_VAL;

    //       if (
    //         ((Number(cell._cell.row.data.INT_MIN_SPEC_VAL) > value ||
    //           Number(cell._cell.row.data.INT_MAX_SPEC_VAL) < value) &&
    //           Number(cell._cell.row.data.INT_MIN_SPEC_VAL) != 0 &&
    //           Number(cell._cell.row.data.INT_MAX_SPEC_VAL) != 0) ||
    //         drop_val == "NOT OK" ||
    //         drop_val == "NOT SATISFACTORY" ||
    //         drop_val == "FAILED" ||
    //         drop_val == "N.G." ||
    //         value.substring(0, 3).toLowerCase() == "not"
    //       ) {
    //         cell.getElement().style["background-color"] = "#ff9178";
    //       }
    //       //  else {
    //       //   // cell.getElement().style["background-color"] = "";
    //       // }
    //     }
    //     return value;
    //   },
    // },
    {
      title: "Test Value",
      field: "ACTUAL_RECORD_VAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 150,
      editor: function (cell, onRendered, success, cancel, editorParams) {
        var drop_chk = cell._cell.row.data.DROP_CHK;
    
        if (drop_chk == 0) {
          var editor = document.createElement("input");
          editor.setAttribute("type", "number");
          editor.style.padding = "3px";
          editor.style.width = "100%";
          editor.style.boxSizing = "border-box";
          editor.value = cell.getValue() ? cell.getValue() : "";
          onRendered(function () {
            editor.focus();
            editor.style.css = "100%";
          });
    
          function successFunc() {
            success(editor.value);
          }
    
          editor.addEventListener("change", successFunc);
          editor.addEventListener("blur", successFunc);
    
          return editor;
        } else if (drop_chk == 1) {
          var editor = document.createElement("select");
          var editorParams = [
            { key: "PASSED", value: "PASSED" },
            { key: "FAILED", value: "FAILED" },
            { key: "OK", value: "OK" },
            { key: "NOT OK", value: "NOT OK" },
            { key: "SATISFACTORY", value: "SATISFACTORY" },
            { key: "NOT SATISFACTORY", value: "NOT SATISFACTORY" },
            { key: "N.S.", value: "N.S." },
            { key: "N.A.", value: "N.A." },
            { key: "N.G.", value: "N.G." },
            { key: "WITHIN LIMIT", value: "WITHIN LIMIT" },
            { key: "FULL FLATENING", value: "FULL FLATENING" },
          ];
          for (var i = 0; i < editorParams.length; i++) {
            var opt = document.createElement("option");
            opt.value = editorParams[i].key;
            opt.innerHTML = editorParams[i].value;
            editor.appendChild(opt);
          }
    
          editor.style.padding = "3px";
          editor.style.width = "100%";
          editor.style.boxSizing = "border-box";
    
          editor.value = cell.getValue();
    
          onRendered(function () {
            editor.focus();
            editor.style.css = "100%";
          });
    
          function successFunc() {
            success(editor.value);
          }
    
          editor.addEventListener("change", successFunc);
          editor.addEventListener("blur", successFunc);
    
          return editor;
        } else if (drop_chk == 2) {
          var editor = document.createElement("input");
          editor.setAttribute("type", "date");
          editor.style.padding = "3px";
          editor.style.width = "100%";
          editor.style.boxSizing = "border-box";
          editor.value = cell.getValue() ? cell.getValue() : "";
          onRendered(function () {
            editor.focus();
            editor.style.css = "100%";
          });
    
          function successFunc() {
            success(editor.value);
          }
    
          editor.addEventListener("change", successFunc);
          editor.addEventListener("blur", successFunc);
    
          return editor;
        }
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
    
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value) {
          var drop_val = cell._cell.row.data.ACTUAL_RECORD_VAL;
    
          if (
            ((Number(cell._cell.row.data.INT_MIN_SPEC_VAL) > value ||
              Number(cell._cell.row.data.INT_MAX_SPEC_VAL) < value) &&
              Number(cell._cell.row.data.INT_MIN_SPEC_VAL) != 0 &&
              Number(cell._cell.row.data.INT_MAX_SPEC_VAL) != 0) ||
            drop_val == "NOT OK" ||
            drop_val == "NOT SATISFACTORY" ||
            drop_val == "FAILED" ||
            drop_val == "N.G." ||
            value.substring(0, 3).toLowerCase() == "not"
          ) {
            cell.getElement().style["background-color"] = "#ff9178";
          }
        }
        return value;
      },
    },    
    {
      field: "FLAG",
      title: "Flag",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      width: 150,
      editor: "select",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: [
          { label: "Required", value: "Required" },
          { label: "Not Required", value: "Not Required" },
        ],
      },
      formatter: "lookup",
      defaultValue: "Not Required",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
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
      width: 200,
    },
  ];

  const TestDetailsDataColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      width: "2%",
    },
    {
      title: "Cast No",
      field: "TCO_CAST_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod No",
      field: "TCO_PROD_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "LAB_TEST_CD",
      field: "TCO_LAB_TEST_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Test Para",
      field: "TCO_TEST_PARA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "TEST_PARA_REM",
      field: "TCO_TEST_PARA_REM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "TEST_PARA_VAL",
      field: "TCO_TEST_PARA_VAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "UP_RESULT_TAG",
      field: "TCO_UP_RESULT_TAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "CRT DT",
      field: "TCO_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "CRT BY",
      field: "TCO_CRT_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "UPD DT",
      field: "TCO_UPD_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "UPD BY",
      field: "TCO_UPD_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "TEST_PARA_VAL_WIRE",
      field: "TCO_TEST_PARA_VAL_WIRE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SOURCE_PGM",
      field: "TCO_SOURCE_PGM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ERROR_CD",
      field: "TCO_ERROR_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "PI_STATUS",
      field: "TCO_PI_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "PICK_TIMESTAMP",
      field: "TCO_PICK_TIMESTAMP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ACK_TIMESTAMP",
      field: "TCO_ACK_TIMESTAMP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "POST_TIMESTAMP",
      field: "TCO_POST_TIMESTAMP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "PI_IB_MESSAGE_ID",
      field: "TCO_PI_IB_MESSAGE_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "PI_OB_MESSAGE_ID",
      field: "TCO_PI_OB_MESSAGE_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "PI_SOURCE_PGM",
      field: "TCO_PI_SOURCE_PGM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "OPR_REMARKS",
      field: "TCO_OPR_REMARKS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const handlePlantChangeTstResult = (e) => {
    setSelectedPlantDeci(e);
    setLoading(true);
    GetAuthorization().then((data) => {
      Promise.all([
        getMbatch(e, data.accessToken),
        getBatch(e, data.accessToken),
      ]).finally(() => {
        setLoading(false);
      });
    });
  };

  const handleMbatchChange = (e) => {
    setSelectedMbatch(e);
  };

  const handlebatchChange = (e) => {
    setSelectedbatch({ label: e.label, value: e.label });
    setSelectedbatchdt(e.value);
    setTestResDt([,]);
  };

  const getMbatch = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM034/gettestresmbatch";
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
              obj.value = row[0];
              items.push(obj);
            });
            setMbatchList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getBatch = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM034/gettestresbatch";
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
              obj.value = row;

              items.push(obj);
            });
            setBatchList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  useEffect(() => {
    if (tabValueMain === 2) {
      if (testResDt && testResDt.length > 0) {
        setTestDataTable(
          new Tabulator("#displayTableTest", {
            data: testResDt,
            columns: TestDataColumn,
            height: "500",
            layout: "fitDataFill",
          })
        );
      }
    }
  }, [testResDt, tabValueMain]);

  useEffect(() => {
    if (tabValueMain === 2) {
      if (testDetailsResDt && testDetailsResDt.length > 0) {
        setTestDetailsDataTable(
          new Tabulator("#testDetailsTable", {
            data: testDetailsResDt,
            columns: TestDetailsDataColumn,
            height: "200",
            layout: "fitDataFill",
          })
        );
      }
    }
  }, [testDetailsResDt, tabValueMain]);

  const getDataTestResult = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getDataTesrResTable(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getDataTesrResTable = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var data = {
        batch_id: selectedbatch ? selectedbatch.value : "",
        LOM_no_cast: selectedbatchdt[1],
        plant: selectedPlantDeci ? selectedPlantDeci.value : "",
        orderid: selectedbatchdt[2],
        orderitem: selectedbatchdt[3],
      };

      if (!data.plant) {
        alertify.error("Please select Plant ID");
        setLoading(false);
        return;
      }

      if (!data.batch_id) {
        alertify.error("Please select Batch ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      var url = "api/LDSM034/getchangeresult";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setTestResDt([,]);
            } else {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];
                rows.push({
                  CODE_DESC: rowdata.CODE_DESC,
                  CODE_SUB_DESC: rowdata.CODE_SUB_DESC,
                  TC_ELEMENT: rowdata.TC_ELEMENT,
                  CODE_VALUE: rowdata.CODE_VALUE,
                  INT_MAX_SPEC_VAL: rowdata.INT_MAX_SPEC_VAL,
                  INT_MIN_SPEC_VAL: rowdata.INT_MIN_SPEC_VAL,
                  ACTUAL_RECORD_VAL: rowdata.ACTUAL_RECORD_VAL,
                  DROP_CHK: rowdata.DROP_CHK,
                  FLAG: "Required",
                });
              }
              setTestResDt(rows);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getTestResultDataFunc = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getTestResultDetails(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getTestResultDetails = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var selectedRows = testDataTable.getSelectedRows();
      if (selectedRows.length == 0) {
        alertify.error("No rows selected");
        setLoading(false);
        return;
      }

      var data = {
        // batch: allValuesDeci ? allValuesDeci.coil : "",
        batch: selectedbatch ? selectedbatch.value : "",
        testpra: selectedRows[0]._row.data.TSL_TEST_PARA,
      };

      if (!data.batch) {
        alertify.error("Please select M-Batch");
        setLoading(false);
        return;
      }

      var url = "api/LDSM034/getchangeResultdetails";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setTestDetailsResDt([,]);
            } else {
              var rowdata = response.data;
              setTestDetailsResDt(rowdata);
            }
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const getQualityResultDataFunc = () => {
    setLoading(true);
    console.log("data gettingcleaned");
    setqualityResultData([]);
    console.log("data- is cleaned");
    GetAuthorization().then((token) => {
      Promise.all([getQualityResultData(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getQualityResultData = (accessToken) => {
    // getDefectRecording();
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var selectedRows = qualityDataTable.getSelectedRows();
      var selectedData = [],
        orderList = [],
        mBatchList = [],
        castList = [],
        emptyCast = [],
        _sumPrimeTubes = 0;
      selectedRows.forEach(function (item) {
        _sumPrimeTubes += Number(item._row.data.NO_PRIME_TUBE);
        // if (item._row.data.LOM_NO_CAST == null) {
        //   emptyCast.push(item._row.data.LOM_NO_CAST);
        // }
        if (
          item._row.data.LOM_NO_CAST == null ||
          item._row.data.LOM_NO_CAST == "n.a" ||
          item._row.data.LOM_NO_CAST == "N.A"
        ) {
          emptyCast.push(item._row.data.LOM_NO_CAST);
        }
        if (orderList.indexOf(item._row.data.ORDERID) == -1) {
          orderList.push(item._row.data.ORDERID);
        }

        if (mBatchList.indexOf(item._row.data.MOTHER_BATCH) == -1) {
          mBatchList.push(item._row.data.MOTHER_BATCH);
        }

        if (castList.indexOf(item._row.data.LOM_NO_CAST) == -1) {
          castList.push(item._row.data.LOM_NO_CAST);
        }

        selectedData.push({
          ORDERID: item._row.data.ORDERID,
          ITEM: item._row.data.ITEM,
          MATERIAL: item._row.data.MATERIAL,
          //MOTHER_BATCH: item._row.data.MOTHER_BATCH, //{Parent Mother Batch Add 06.10}
          MOTHER_BATCH: item._row.data.PAR_COIL_NO,
          LOM_NO_CAST: item._row.data.LOM_NO_CAST,
          BATCH_ID: item._row.data.BATCH_ID,
          FG_MAT: item._row.data.FG_MAT_NO
        });
      });

      //setSumPrimeTubes(_sumPrimeTubes);
      if (emptyCast.length > 0) {
        //alertify.error("Please select row with available cast.");
        alertify.error("Cast no is not valid !!!");
        setLoading(false);
        return;
      }
      if (orderList.length > 1) {
        alertify.error("Multiple Order List selected.");
        setLoading(false);
        return;
      }

      if (mBatchList.length > 1) {
        alertify.error("Multiple Mother Batch selected.");
        setLoading(false);
        return;
      }

      if (castList.length > 1) {
        alertify.error("Multiple Cast selected.");
        setLoading(false);
        return;
      }

      //no row selected alert
      if (selectedRows.length == 0) {
        alertify.error("No rows selected");
        setLoading(false);
        return;
      }

      var data = {
        plant: selectedPlant.value,
        status: selectedStatus.value,
        selectedData: selectedData,
      };

      var url = "api/LDSM034/getQualityResultData";

      Promise.all([
        getQRRFlg(accessToken),
        axiosAPI.post(url, data, defaultOptions),
        getDefectRecording(accessToken),
        getScrapWt(accessToken),
      ])
        .then(([res1, response, res2]) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
            } else if (response.data.length > 0) {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];
                rows.push({
                  CODE_DESC: rowdata.CODE_DESC,
                  CODE_SUB_DESC: rowdata.CODE_SUB_DESC,
                  TC_ELEMENT: rowdata.TC_ELEMENT,
                  CODE_VALUE: rowdata.CODE_VALUE,
                  INT_MAX_SPEC_VAL: rowdata.INT_MAX_SPEC_VAL,
                  INT_MIN_SPEC_VAL: rowdata.INT_MIN_SPEC_VAL,
                  ACTUAL_RECORD_VAL: rowdata.ACTUAL_RECORD_VAL,
                  DROP_CHK: rowdata.DROP_CHK,
                  FLAG: "Required",
                });
                
              }
              console.log("data fetched from backednd");
              setqualityResultData(rows);
            }
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const saveData = () => {
    
    var selectedFirstTableRows = qualityDataTable.getSelectedRows();
    var selectedSecondTableRows = qualityResultDataTable.getSelectedRows();
    var outsideRange = [];
   
    var selectedFirstTableData = [];
    selectedFirstTableRows.forEach(function (item) {
      selectedFirstTableData.push({
        //MOTHER_BATCH: item._row.data.MOTHER_BATCH, {Add Parent Mother batch 06.10.2023}
        MOTHER_BATCH: item._row.data.PAR_COIL_NO,
        BATCH_ID: item._row.data.BATCH_ID,
        LOM_NO_CAST: item._row.data.LOM_NO_CAST,
      });
    });
    var selectedSecondTableData = [],
      empVal = false;
    var wire_dt = null;

    // Retrieve the entire table data
    var tableData = qualityResultDataTable.getData();

    // Find the row where TC_ELEMENT === "HYDRA_DT"
    for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].TC_ELEMENT === "HYDRA_DT") {
            wire_dt = tableData[i].ACTUAL_RECORD_VAL; // Retrieve the value
            break; // Exit loop after finding the first match
        }
    }

    selectedSecondTableRows = selectedSecondTableRows.filter(function (item) {
    if (item._row.data.TC_ELEMENT === "HYDRA_DT") {
      //wire_dt = item._row.data.ACTUAL_RECORD_VAL; // Retrieving the value
      return false; // Remove this row
    }
      return true; // Keep this row
    });      
    selectedSecondTableRows.forEach(function (item) {
      if (item._row.data.FLAG == "Not Required") {
        empVal = false;

        selectedSecondTableData.push({
          TEST_CODE: item._row.data.CODE_VALUE,
          TEST_PARAMETER: item._row.data.TC_ELEMENT,
          TEST_REMARK: item._row.data.REMARKS,
          //TEST_VALUE: item._row.data.ACTUAL_RECORD_VAL,
          //TCO_TEST_PARA_VAL: 99999,
          TEST_VALUE: 99999,
          TCO_TEST_PARA_REM: "OPTIONAL",
          CHECK_RANGE: {
            INT_MAX_SPEC_VAL: item._row.data.INT_MAX_SPEC_VAL,
            INT_MIN_SPEC_VAL: item._row.data.INT_MIN_SPEC_VAL
          }
        });
      } else {
        if (
          item._row.data.ACTUAL_RECORD_VAL == undefined ||
          item._row.data.ACTUAL_RECORD_VAL == null ||
          //item._row.data.ACTUAL_RECORD_VAL == "" ||
          item._row.data.ACTUAL_RECORD_VAL < 0
        ) {
          empVal = true;
        }

        if (
          item._row.data.ACTUAL_RECORD_VAL > item._row.data.INT_MAX_SPEC_VAL ||
          item._row.data.ACTUAL_RECORD_VAL < item._row.data.INT_MIN_SPEC_VAL
        ) {
          outsideRange.push(item._row.data.TEST_CODE);
        }

        selectedSecondTableData.push({
          TEST_CODE: item._row.data.CODE_VALUE,
          TEST_PARAMETER: item._row.data.TC_ELEMENT,
          TEST_REMARK: item._row.data.REMARKS,
          TEST_VALUE: item._row.data.ACTUAL_RECORD_VAL,
          CHECK_RANGE: {
            INT_MAX_SPEC_VAL: item._row.data.INT_MAX_SPEC_VAL,
            INT_MIN_SPEC_VAL: item._row.data.INT_MIN_SPEC_VAL
          }
        });
      }
    });

    var result = selectedSecondTableData.filter(
      (a) =>
        a.TEST_VALUE !== "" ||
        a.TEST_VALUE !== null ||
        a.TEST_VALUE !== undefined
    );
    if (result.length !== selectedSecondTableData.length) {
      alertify.error("Test Value should be inside range.");
    }

    if (empVal) {
      alertify.error("Please insert test value in all row(s)");
      return;
    }
    //no row selected alert
    if (selectedFirstTableData.length == 0) {
      alertify.error("No rows selected from Display Table");
      return;
    }

    if (selectedSecondTableRows.length == 0) {
      alertify.error("No rows selected from Quality Result Table");
      return;
    }

    var data = {
      plant: selectedPlant.value,
      personalNo: serverDetails.PersonalNo,
      selectedFirstTableData: selectedFirstTableData,
      selectedSecondTableData: selectedSecondTableData,
      wire_dt: wire_dt
    };

    setLoading(true);

    var url = "api/LDSM034/insertQualityTestData";

    // api call
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
            alertify.error("Error saving Data");
          } else {
            alertify.success(`${response.data} row(s) saved!`);
            getQualityResultData(token.accessToken);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const saveDeciTableData = () => {
    var selectedRows = qaDeciDataTable.getSelectedRows();
    debugger;
    var deci_flag = 0;
    var selectedData = [];
    selectedRows.forEach(function (item) {
      selectedData.push(item._row.data);
      if (
        item._row.data.DECISION == "Downgrade" &&
        item._row.data.MAT_NO == undefined
      ) {
        deci_flag = 1;
      }
      if (
        item._row.data.DECISION == "Diverted" &&
        item._row.data.MAT_NO == undefined
      ) {
        deci_flag = 2;
      }
    });

    //no row selected alert
    if (selectedData.length == 0) {
      alertify.error("No rows selected from QA Decision Data Table");
      return;
    }

    // no material in case of downgrade alert
    if (deci_flag == 1) {
      alertify.error("Material Number is required in case of Downgrade");
      return;
    }

    // no material in case of downgrade alert
    if (deci_flag == 2) {
      alertify.error("Material Number is required in case of Diversion");
      return;
    }

    var data = {
      plant: selectedPlantDeci.value,
      personalNo: serverDetails.PersonalNo,
      selectedData: selectedData,
    };

    setLoading(true);

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LDSM034/saveqadecidata";

      // api call
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            setLoading(false);
            alertify.error("Error Inserting Data");
          } else {
            // alertify.success(`${response.data} row(s) inserted successfully!`);
            response.data.res_n.map((val) => {
              alertify.error(val);
            });
            response.data.res_y.map((val) => {
              alertify.success(val);
            });
            Promise.all([getDataDeci(token.accessToken)]).finally(() => {
              setLoading(false);
            });
          }
        })
        .catch((f) => {
          setLoading(false);
        });
    });
  };

  const getQltyData = async (cell, newToken = false) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var data = {
        personalNo: serverDetails.PersonalNo,
      };

      var url = "api/LDSM034/getqlty";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setQltyList([,]);
            } else {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];
                rows.push({
                  label:
                    rowdata.IQL_CD_QLTY +
                    " - " +
                    rowdata.IQL_DS_QLTY +
                    " - " +
                    rowdata.IQL_GRADE +
                    " - " +
                    rowdata.IQL_GRADE_DESC,
                  value: rowdata.IQL_CD_QLTY,
                });
              }
              setQltyList(rows);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getMatNo = async (e, newToken = false) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var data = {
        plant: selectedPlantDeci.value,
      };
      setLoading(true);
      var url = "api/LDSM034/getmatno";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setMatNoList([,]);
            } else {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i].split(":");

                rows.push({
                  key: rowdata[0] + " - " + rowdata[1],
                  value: rowdata[0],
                });
              }

              setMatNoList(rows);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getmatnoDiverted = async (e, newToken = false) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var data = {
        plant: selectedPlantDeci.value,
      };
      setLoading(true);
      var url = "api/LDSM034/getmatnoDiverted";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setMatNoList([,]);
            } else {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i].split(":");

                rows.push({
                  key: rowdata[0] + " - " + rowdata[0],
                  value: rowdata[0],
                });
              }

              setMatNoList(rows);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getMatNoUD = (e) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var data = {
        plant: selectedPlant.value,
      };
      var url = "api/LDSM034/getmatno";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setMatNoListUD([,]);
            } else {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i].split(":");

                rows.push({
                  label: rowdata[0] + " - " + rowdata[1],
                  value: rowdata[0],
                });
              }
              setMatNoListUD(rows);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getTdcData = async (cell, newToken = false) => {
    var data = {
      personalNo: serverDetails.PersonalNo,
    };

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LDSM034/gettdc";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setTdcList([,]);
            } else {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];
                rows.push({
                  label: rowdata.EAT_TDC_NO,
                  value: rowdata.EAT_TDC_NO,
                });
              }
              setTdcList(rows);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getAddlProcessData = (cell) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var data = {
        plant: selectedPlantDeci.value,
        curr_proc: cell._cell.row.data.LOM_CD_CURR_PROC
          ? cell._cell.row.data.LOM_CD_CURR_PROC
          : "",
      };
      var url = "api/LDSM034/getaddlprocess";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Additional Process Data Found");
              setAddlProcessList([,]);
            } else {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i].split(":");
                rows.push({
                  // label: rowdata[0] + " - " + rowdata[1],
                  label: rowdata[0],
                  value: rowdata[0],
                });
              }
              setAddlProcessList(rows);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const showCastDetailWindow = async (cell) => {
    setShowCastDetailModal(true);
    setCastNo(cell._cell.row.data.LOM_NO_CAST);
    setCastDetailData(cell._cell.row.data);
  };

  const QualityDataColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      width: "2%",
    },
    {
      title: "Cast",
      field: "LOM_NO_CAST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellClick: function (e, cell) {
        showCastDetailWindow(cell);
      },
    },
    {
      title: "Mother Batch",
      field: "MOTHER_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plan Proc",
      field: "LOM_PLANNED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false
    },
    {
      title: "Parent Mother Batch",
      field: "PAR_COIL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch Id",
      field: "BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Order",
      field: "ORDERID",
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
      title: "Odia",
      field: "LOM_ODIA",
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
      title: "Order Length",
      field: "SO_LENGTH",
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
    // {
    //   title: "Width/Odia",
    //   field: "LOM_SEC2",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(3);
    //     }
    //     return value
    //   },
    // },
    {
      title: "Thickness",
      field: "THICKNESS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Customer",
      field: "CUSTOMER",
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
      title: "Net Wt.(KG)",
      field: "NET_WT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
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
      title: "Material No.",
      field: "MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Description",
      field: "MAT_DESCRIPTION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material No.",
      field: "FG_MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material Desc.",
      field: "FG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Downgrade Material No.",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: matNoListUD,
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Remarks",
      field: "REMARKS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Prod. Type",
      field: "PROD_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    // {
    //   title: "Gross Wt.",
    //   field: "GROSS_WT",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "TDC",
      field: "LOM_TDC_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },

    {
      title: "Batch Production Dt.",
      field: "CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Product Code",
      field: "PRODUCT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Quality",
      field: "QUALITY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Rolling Length",
      field: "ROLLING_LENGTH",
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
      title: "Specification",
      field: "SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Yield",
      field: "YIELD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Work Center",
      field: "LOM_WORK_CENTER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "No. of Prime Tube",
      field: "NO_PRIME_TUBE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Section Size",
      field: "SEC_SIZE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Current Process",
      field: "CURRENT_PROCESS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Process",
      field: "LOM_CD_NEXT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    // {
    //   title: "Action",
    //   field: "ACTION",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    // },
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor:"list",
    //   editorParams: {
    //     allowEmpty: false, showListOnEmpty: true, values: [
    //         { label: "ConfirmUD", value: "ConfirmUD" },
    //         { label: "RejectUD", value: "RejectUD" }
    //     ]
    //   },
    //   cellEdited : function (cell) {
    //     if(cell._cell.row.data.ACTION == "ConfirmUD"){
    //       setMatNoListUD([,]);
    //       // getMatNo();
    //     }else if(cell._cell.row.data.ACTION == "RejectUD"){
    //       getMatNoUD();
    //     }

    //   },
    // },
  ];

  const qaDeciDataColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      width: "2%",
    },
    {
      title: "Plant",
      field: "LOM_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch ID",
      field: "LOM_ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mother Batch",
      field: "LOM_ID_FIRST_PAR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ProdCd",
      field: "LOM_CD_PROD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thick",
      field: "LOM_SEC1",
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
      title: "Width/Odia",
      field: "LOM_SEC2",
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
      field: "LOM_LENGTH",
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
      title: "Status",
      field: "LOM_CD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Order",
      field: "LOM_ID_ORDER_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "LOM_ID_ORD_ITEM_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Decision",
      field: "DECISION",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: [
          { label: "Pass", value: "Pass" },
          { label: "Addl Process", value: "Addl Process" },
          { label: "Downgrade", value: "Downgrade" },
          { label: "Diverted", value: "Diverted" },
        ],
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      // defaultValue:"Downgrade",
      cellEdited: function (cell) {
        var row = cell.getRow();
        if (
          cell._cell.row.data.DECISION == "Downgrade"
        ) {
          row.update({
            MAT_NO: '',
          });
          // getQltyData();
          // getTdcData();
          getMatNo();
        } else if (cell._cell.row.data.DECISION == "Diverted") {
          row.update({
            MAT_NO: '',
          });
          getmatnoDiverted();
        } else if (cell._cell.row.data.DECISION == "Addl Process") {
          getAddlProcessData(cell);
          setMatNoList([,]); //Added to remove the material no, field should be blank (should be uneditable).
        }
      },
    },
    {
      title: "Material No.",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: function (cell, onRendered, success, cancel, editorParams) {
        var drop_chk = cell._cell.row.data.DECISION;

        if (drop_chk == "Pass" || drop_chk == "Addl Process") {
          var editor = document.createElement("input");
          editor.readOnly = true;
          editor.style.padding = "3px";
          editor.style.width = "100%";
          editor.style.boxSizing = "border-box";

          editor.value = cell.getValue() ? cell.getValue() : "";

          onRendered(function () {
            editor.focus();
            editor.style.css = "100%";
          });

          function successFunc() {
            success(editor.value);
          }

          editor.addEventListener("change", successFunc);
          editor.addEventListener("blur", successFunc);

          return editor;
        }

        // if (drop_chk == "Diverted") {
        //   var editor = document.createElement("input");

        //   editor.style.padding = "3px";
        //   editor.style.width = "100%";
        //   editor.style.boxSizing = "border-box";

        //   editor.value = cell.getValue() ? cell.getValue() : "";

        //   onRendered(function () {
        //     editor.focus();
        //     editor.style.css = "100%";
        //   });

        //   function successFunc() {
        //     success(editor.value);
        //   }

        //   editor.addEventListener("change", successFunc);
        //   editor.addEventListener("blur", successFunc);

        //   return editor;
        // } else {
        var editor = document.createElement("select");
        //   var editorParams = [{key : "PASSED" , value : "PASSED"} ,
        //   {key : "FAILED" , value : "FAILED"},
        //   {key : "OK" , value : "OK"} ,
        //   {key : "NOT OK" , value : "NOT OK"} ,
        //   {key : "SATISFACTORY" , value : "SATISFACTORY"} ,
        //   {key : "NOT SATISFACTORY" , value : "NOT SATISFACTORY"} ,
        //   {key : "N.S." , value : "N.S."} ,
        //   {key : "N.A." , value : "N.A."} ,
        //   {key : "N.G." , value : "N.G."},
        //   {key : "WITHIN LIMIT" , value : "WITHIN LIMIT"} ,
        //   {key : "FULL FLATENING" , value : "FULL FLATENING"},
        //  ];
        var editorParams = matNoList;
        for (var i = 0; i < editorParams.length; i++) {
          var opt = document.createElement("option");

          opt.value = editorParams[i].value;
          opt.innerHTML = editorParams[i].key;

          editor.appendChild(opt);
        }

        editor.style.padding = "3px";
        editor.style.width = "100%";
        editor.style.boxSizing = "border-box";

        editor.value = cell.getValue();

        onRendered(function () {
          editor.focus();
          editor.style.css = "100%";
        });

        function successFunc() {
          success(editor.value);
        }

        editor.addEventListener("change", successFunc);
        editor.addEventListener("blur", successFunc);

        return editor;
        //}
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },

    {
      title: "Addl Process",
      field: "ADDL_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: addlProcessList,
      },
      editor: function (cell, onRendered, success, cancel, editorParams) {
        var drop_chk = cell._cell.row.data.DECISION;

        if (
          drop_chk == "Pass" ||
          drop_chk == "Downgrade" ||
          drop_chk == "Diverted"
        ) {
          var editor = document.createElement("input");
          editor.readOnly = true;
          editor.style.padding = "3px";
          editor.style.width = "100%";
          editor.style.boxSizing = "border-box";
          editor.value = cell.getValue() ? cell.getValue() : "";
          onRendered(function () {
            editor.focus();
            editor.style.css = "100%";
          });

          function successFunc() {
            success(editor.value);
          }

          editor.addEventListener("change", successFunc);
          editor.addEventListener("blur", successFunc);

          return editor;
        } else {
          var form = document.createElement("span");
          var formElement = document.createElement("select");
          formElement.style.padding = "3px";
          formElement.style.width = "100%";
          formElement.style.boxSizing = "border-box";
          for (var i = 0; i < addlProcessList.length; i++) {
            var option = document.createElement("option");
            option.setAttribute("value", addlProcessList[i].value);
            option.label = addlProcessList[i].label;
            formElement.appendChild(option);
          }

          onRendered(function () {
            formElement.focus();
            formElement.style.css = "100%";
          });

          function successFunc() {
            success(formElement.value);
          }

          formElement.addEventListener("change", successFunc);
          formElement.addEventListener("blur", successFunc);

          form.appendChild(formElement);
          return document.body.appendChild(form);
        }
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Remarks",
      field: "REMARKS",
      editor: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "AimQlty",
      field: "LOM_CD_QLTY_AIM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    {
      title: "ActlQlty",
      field: "LOM_CD_QLTY_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt.(KG)",
      field: "LOM_MS_PIECE_ACTL",
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
      title: "Res Wt.",
      field: "LOM_MS_GROSS_CAL",
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
      title: "Gross Wt.",
      field: "LOM_MS_GROSS_ACTL",
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
      title: "Aim Tdc",
      field: "LOM_TDC_AIM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Actl Tdc",
      field: "LOM_TDC_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Curr Proc",
      field: "LOM_CD_CURR_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Proc",
      field: "LOM_CD_NEXT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Customer",
      field: "ENC_CUST_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Batch Material No.",
      field: "MATNO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Batch Material Desc.",
      field: "MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Operator Remarks",
      field: "OPR_REMARKS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Hold Code",
      field: "HOLD_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Hold Desc.",
      field: "HOLD_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const QualityResultColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Test Code",
      field: "CODE_VALUE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
    {
      title: "Test Parameter",
      field: "TC_ELEMENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
    {
      title: "Description",
      field: "CODE_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
    {
      title: "Minimum Value",
      field: "INT_MIN_SPEC_VAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 150,
    },
    {
      title: "Maximum Value",
      field: "INT_MAX_SPEC_VAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 150,
    },
    {
      title: "Test UOM",
      field: "CODE_SUB_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 190,
    },
    {
      title: "Test Value",
      // field: "VALUE",
      field: "ACTUAL_RECORD_VAL",
      // editor: "number",
      // editor:"input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 150,
      editable: function(cell) {
        return cell._cell.row.data.TC_ELEMENT !== "HYDRA_DT";
      },
      editor: function (cell, onRendered, success, cancel, editorParams) {
        var drop_chk = cell._cell.row.data.DROP_CHK;
        console.log("drop chk :",drop_chk);
        console.log("HELLO");
        var value = cell.getValue();
        if (drop_chk == 0) {
          var editor = document.createElement("input");
          editor.setAttribute("type", "number");
          editor.style.padding = "3px";
          editor.style.width = "100%";
          editor.style.boxSizing = "border-box";
          editor.value = cell.getValue() > 0 ? cell.getValue() : "0";
          onRendered(function () {
            editor.focus();
            editor.style.css = "100%";
          });

          function successFunc() {
            success(editor.value > 0 ? editor.value : "0");
          }

          editor.addEventListener("change", successFunc);
          editor.addEventListener("blur", successFunc);

          return editor;
        } else if (drop_chk == 1)  {
          var editor = document.createElement("select");
          var editorParams = [
            { key: "PASSED", value: "PASSED" },
            { key: "FAILED", value: "FAILED" },
            { key: "OK", value: "OK" },
            { key: "NOT OK", value: "NOT OK" },
            { key: "SATISFACTORY", value: "SATISFACTORY" },
            { key: "NOT SATISFACTORY", value: "NOT SATISFACTORY" },
            { key: "N.S.", value: "N.S." },
            { key: "N.A.", value: "N.A." },
            { key: "N.G.", value: "N.G." },
            { key: "WITHIN LIMIT", value: "WITHIN LIMIT" },
            { key: "FULL FLATENING", value: "FULL FLATENING" },
          ];
          for (var i = 0; i < editorParams.length; i++) {
            var opt = document.createElement("option");
            opt.value = editorParams[i].key;
            opt.innerHTML = editorParams[i].value;
            editor.appendChild(opt);
          }

          editor.style.padding = "3px";
          editor.style.width = "100%";
          editor.style.boxSizing = "border-box";

          editor.value = cell.getValue();

          onRendered(function () {
            editor.focus();
            editor.style.css = "100%";
          });

          function successFunc() {
            success(editor.value);
          }

          editor.addEventListener("change", successFunc);
          editor.addEventListener("blur", successFunc);

          return editor;
        } else if (drop_chk == 2) {
          const editor = document.createElement("input");
          editor.setAttribute("type", "date");
          editor.style.padding = "3px";
          editor.style.width = "100%";
          editor.style.boxSizing = "border-box";
          editor.value = cell.getValue();
          onRendered(function () {
            editor.focus();
            editor.style.css = "100%";
          });
  
          function successFunc() {
            success(editor.value);
          }
  
          editor.addEventListener("change", successFunc);
          editor.addEventListener("blur", successFunc);
  
          return editor;
        }
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value) {

          var drop_val = cell._cell.row.data.ACTUAL_RECORD_VAL;

          if (
            ((Number(cell._cell.row.data.INT_MIN_SPEC_VAL) > value ||
              Number(cell._cell.row.data.INT_MAX_SPEC_VAL) < value) &&
              Number(cell._cell.row.data.INT_MIN_SPEC_VAL) != 0 &&
              Number(cell._cell.row.data.INT_MAX_SPEC_VAL) != 0) ||
            drop_val == "NOT OK" ||
            drop_val == "NOT SATISFACTORY" ||
            drop_val == "FAILED" ||
            drop_val == "N.G." ||
            value.substring(0, 3).toLowerCase() == "not" 
          ) {
            cell.getElement().style["background-color"] = "#ff9178";
          }
          else {
            // cell.getElement().style["background-color"] = "";
          }
        }
        return value;
      },
    },
    {
      field: "FLAG",
      title: "Flag",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      width: 150,
      editor: "select",
      editable: function(cell) {
        return cell._cell.row.data.TC_ELEMENT !== "HYDRA_DT";
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: [
          { label: "Required", value: "Required" },
          { label: "Not Required", value: "Not Required" },
        ],
      },
      formatter: "lookup",
      defaultValue: "Not Required",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
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
      width: 200,
    },
  ];

  const formulaCalc = (cell) => {
    setLoading(true);

    let dt = qualityDataTable.getData();

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      let d = {
        plant: selectedPlant.value,
        procPath: dt[0].LOM_PLANNED_PROC
      };
      axiosAPI
        .post("api/LDSM034/getpphProductName", d, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            setLoading(false);
          } else {
            var pName = response.data[0][0];
            let data = {
              plant: selectedPlant.value,
              batch_id: dt[0].BATCH_ID,
              prod_name: pName,
              no_pcs: cell.getData()?.TBD_DEFECT_NO_PCS,
              length: 0,
              p_od: 0,
              p_id: 0,
              p_thk: 0,
            };
            axiosAPI
              .post("api/LDSM034/getPieceActl", data, defaultOptions)
              .then((response) => {
                if (response.statusText != "" && response.statusText != "OK") {
                  setLoading(false);
                } else {
                  if (cell.getData()?.TBD_DEFECT_NO_PCS == "0") {
                    cell.getRow()?.update({ TBD_DEFECT_WT: 0 });
                  } else if (cell.getData()?.TBD_DEFECT_NO_PCS == "") {
                    cell.getRow()?.update({ TBD_DEFECT_WT: "" });
                  } else {
                    cell.getRow()?.update({ TBD_DEFECT_WT: response.data[0][0] });
                  }
                  setLoading(false);
                }
              });
          }
        });


    });
  };

  const column_defect_recording = [
    {
      title: "Defect Code",
      field: "ESR_RSN_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Defect Description",
      field: "ESR_RSN_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // width : 600
      width: "30%",
    },
    {
      title: "No. of Defective Tubes",
      field: "TBD_DEFECT_NO_PCS",
      editor: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: "30%",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: function (cell) {
        /*** fetch function for piece act */
        formulaCalc(cell);

        setSumScrapTubes(
          Number(
            cell.getColumn()?._column?.cells[
              cell.getColumn()?._column?.cells.length - 1
            ]?.value
          )
        );
      },
    },
    {
      title: "Defect Wt",
      field: "TBD_DEFECT_WT",
      editor: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: "30%",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      visible: showScrapWt,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editor: "input",
      cellEdited: (cell) => {
        let defect_Wt = cell._cell.row.data.TBD_DEFECT_WT1;
        let defect_Wt_m = cell._cell.row.data.TBD_DEFECT_WT;
        if (totalScrapWt < defect_Wt_m && selectedStatus.value === "MQ") {
          alertify.error("Modify Defect Wt cannot be greater than Scrap Wt!");
          var row = cell.getRow();
          row.update({
            TBD_DEFECT_WT: defect_Wt,
          });
          return;
        }
        setSumScrapWt(
          Number(
            cell.getColumn()?._column?.cells[
              cell.getColumn()?._column?.cells.length - 1
            ]?.value
          )
        );
      },
    },
  ];

  // const column_defect_recording = [
  //   // {
  //   //   formatter: "rowSelection",
  //   //   titleFormatter: "rowSelection",
  //   //   hozAlign: "center",
  //   //   headerSort: false,
  //   // },
  //   {
  //     title: "Defect Code",
  //     field: "ESR_RSN_CD",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "Defect Description",
  //     field: "ESR_RSN_DESC",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     // width : 600
  //     width: "30%",
  //   },
  //   {
  //     title: "No. of Defective Tubes",
  //     field: "TBD_DEFECT_NO_PCS",
  //     editor: function (cell, onRendered, success, cancel, editorParams) {
  //       var editor = document.createElement("input");
  //       // editor.readOnly = true;
  //       editor.style.padding = "3px";
  //       editor.style.width = "100%";
  //       editor.style.boxSizing = "border-box";

  //       editor.value = cell.getValue() ? cell.getValue() : "";

  //       onRendered(function () {
  //         editor.focus();
  //         editor.style.css = "100%";
  //       });

  //       function successFunc() {
  //         formulaCalc(cell);

  //         setSumScrapTubes(
  //           Number(
  //             cell.getColumn()?._column?.cells[
  //               cell.getColumn()?._column?.cells.length - 1
  //             ]?.value
  //           )
  //         );
  //         success(editor.value);
  //       }

  //       editor.addEventListener("change", successFunc);
  //       editor.addEventListener("blur", successFunc);

  //       return editor;
  //     },
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     width: "30%",
  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       cell.getElement().style["background-color"] = "#DA8EE7";
  //       cell.getElement().style["color"] = "#FFFFFF";
  //       return value;
  //     },
  //     // cellEdited: function (cell) {
  //     //   /*** fetch function for piece act */
  //     //   formulaCalc(cell);

  //     //   setSumScrapTubes(
  //     //     Number(
  //     //       cell.getColumn()?._column?.cells[
  //     //         cell.getColumn()?._column?.cells.length - 1
  //     //       ]?.value
  //     //     )
  //     //   );
  //     // },
  //   },
  //   {
  //     title: "Defect Wt",
  //     field: "TBD_DEFECT_WT",
  //     editor: "input",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     width: "30%",
  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //     visible: showScrapWt,
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       cell.getElement().style["background-color"] = "#DA8EE7";
  //       cell.getElement().style["color"] = "#FFFFFF";
  //       return value;
  //     },
  //     editor: "input",
  //     cellEdited: (cell) => {
  //       let defect_Wt = cell._cell.row.data.TBD_DEFECT_WT1;
  //       let defect_Wt_m = cell._cell.row.data.TBD_DEFECT_WT;
  //       if (totalScrapWt < defect_Wt_m && selectedStatus.value === "MQ") {
  //         alertify.error("Modify Defect Wt cannot be greater than Scrap Wt!");
  //         var row = cell.getRow();
  //         row.update({
  //           TBD_DEFECT_WT: defect_Wt,
  //         });
  //         return;
  //       }
  //       setSumScrapWt(
  //         Number(
  //           cell.getColumn()?._column?.cells[
  //             cell.getColumn()?._column?.cells.length - 1
  //           ]?.value
  //         )
  //       );
  //     },
  //   },
  // ];

  const saveDefectRecording = () => {
    debugger;
    //get selected data
    // var selectedRows = defectRecordingTableData.getSelectedRows();
    var selectedRows = defectRecordingTableData.getData();
    //conversion of data format
    var selectedData = [];
    selectedRows.forEach(function (item) {
      // selectedData.push(item._row.data);
      selectedData.push({
        ESR_RSN_CD: item.ESR_RSN_CD,
        ESR_RSN_DESC: item.ESR_RSN_DESC,
        TBD_DEFECT_NO_PCS: item.TBD_DEFECT_NO_PCS ? item.TBD_DEFECT_NO_PCS : 0,
        TBD_DEFECT_WT: item.TBD_DEFECT_WT ? item.TBD_DEFECT_WT : 0,
      });
    });

    //get display data

    var selectedDisplayRows = qualityDataTable.getSelectedRows();

    var selectedDisplayData = [];
    selectedDisplayRows.forEach((item) => {
      selectedDisplayData.push({
        // MOTHER_BATCH: item._row.data.MOTHER_BATCH, {Parent mother batch add}
        MOTHER_BATCH: item._row.data.PAR_COIL_NO,
        BATCH_ID: item._row.data.BATCH_ID,
        CURRENT_PROCESS: item._row.data.CURRENT_PROCESS,
      });
    });

    //no row selected alert
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      return;
    }

    if (sumPrimeTubes < sumScrapTubes && showScrapWt) {
      alertify.error(
        "Modify No. of Defective Tubes cannot be greater than Scrap Tubes!"
      );
      return;
    }

    if (totalScrapWt < sumScrapWt && showScrapWt) {
      alertify.error("Modify Defect Wt cannot be greater than Scrap Wt!");
      return;
    }
    // //data preperation
    var data = {
      selectedData: selectedData,
      selectedDisplayData: selectedDisplayData,
      personalNo: serverDetails.PersonalNo,
      plant: selectedPlant.value,
    };
    debugger;
    setLoading(true);
    var url = "api/LDSM034/savedefectrecording";
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      //   api call
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("Error Inserting Data");
          } else {
            alertify.success("Data Inserted Successfully");
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const downloadExcelqualityTableData = () => {
    var date = new Date();
    var fileName = "QADefectData " + date.toString() + ".xlsx";
    qualityDataTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelqaDeciTableData = () => {
    var date = new Date();
    var fileName = "QADecisionData " + date.toString() + ".xlsx";
    qaDeciDataTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  //handles clear all button
  const handleClearAll = () => {
    setSelectedPlant([]);
    setSelectedOrder([]);
    setSelectedOrderItem([]);
    setSelectedStatus([]);
    setAllValues({});

    setOrderList([]);
    setOrderItemList([]);

    setqualityData([,]);
    setqualityDataTable(null);

    setqualityResultData([,]);
    setqualityResultDataTable(null);

    setDefectRecordingData([,]);
    setDefectRecordingTableData(null);

    setValueRadio("confrimUD");
  };

  const handleClearAllDeci = () => {
    setSelectedPlantDeci([]);
    setQaDeciSelectedStatus([]);
    setAllValuesDeci({});
    setQaDeciData([,]);
    setQaDeciDataTable(null);
  };

  const saveTestResultDataFunc = () => {
    var selectedSecondTableRows = testDataTable.getSelectedRows();
    var outsideRange = [];

    var selectedFirstTableData = [];
    

    
    selectedFirstTableData.push({
      BATCH_ID: selectedbatchdt[0],
      LOM_NO_CAST: selectedbatchdt[1],
      LOM_TDC_ACTL: selectedbatchdt[4],
    });

    var selectedSecondTableData = [],
      empVal = false;
    selectedSecondTableRows.forEach(function (item) {
      if (item._row.data.FLAG == "Not Required") {
        empVal = false;

        selectedSecondTableData.push({
          TEST_CODE: item._row.data.CODE_VALUE,
          TEST_PARAMETER: item._row.data.TC_ELEMENT,
          TEST_REMARK: item._row.data.REMARKS,
          TEST_VALUE: item._row.data.ACTUAL_RECORD_VAL,
          TCO_TEST_PARA_VAL: 99999,
          TCO_TEST_PARA_REM: "OPTIONAL",
          CHECK_RANGE: {
            INT_MAX_SPEC_VAL: item._row.data.INT_MAX_SPEC_VAL,
            INT_MIN_SPEC_VAL: item._row.data.INT_MIN_SPEC_VAL
          }
        });
      } else {
        if (item._row.data.ACTUAL_RECORD_VAL == undefined) {
          empVal = true;
        }

        if (
          item._row.data.ACTUAL_RECORD_VAL > item._row.data.INT_MAX_SPEC_VAL ||
          item._row.data.ACTUAL_RECORD_VAL < item._row.data.INT_MIN_SPEC_VAL
        ) {
          outsideRange.push(item._row.data.TEST_CODE);
        }

        selectedSecondTableData.push({
          TEST_CODE: item._row.data.CODE_VALUE,
          TEST_PARAMETER: item._row.data.TC_ELEMENT,
          TEST_REMARK: item._row.data.REMARKS,
          TEST_VALUE: item._row.data.ACTUAL_RECORD_VAL,
          CHECK_RANGE: {
            INT_MAX_SPEC_VAL: item._row.data.INT_MAX_SPEC_VAL,
            INT_MIN_SPEC_VAL: item._row.data.INT_MIN_SPEC_VAL
          }
        });
      }
    });

    var result = selectedSecondTableData.filter(
      (a) =>
        a.TEST_VALUE !== "" ||
        a.TEST_VALUE !== null ||
        a.TEST_VALUE !== undefined
    );
    if (result.length !== selectedSecondTableData.length) {
      alertify.error("Test Value should be inside range.");
    }

    if (empVal) {
      alertify.error("Please insert test value in all row(s)");
      return;
    }
    //no row selected alert
    if (selectedFirstTableData.length == 0) {
      alertify.error("No rows selected from Display Table");
      return;
    }
    if (selectedSecondTableRows.length == 0) {
      alertify.error("No rows selected from Quality Result Table");
      return;
    }

    var data = {
      plant: selectedPlant.value,
      personalNo: serverDetails.PersonalNo,
      selectedFirstTableData: selectedFirstTableData,
      selectedSecondTableData: selectedSecondTableData,
    };

    setLoading(true);

    var url = "api/LDSM034/changeQualityTestData";

    // api call
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
            alertify.error("Error saving Data");
          } else {
            alertify.success(`${response.data} row(s) updated!`);
            getQualityResultData(token.accessToken);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Quality"
        page="Quality Decision, defect logging System , Quality Result recording"
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
              <Grid item xs={6}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValueMain}
                    onChange={handleSetTabValueMain}
                  >
                    <Tab
                      label="QA Test result recording/Defect Logging"
                      icon={<Today />}
                    />
                    <Tab label="QA Decision" icon={<Today />} />
                    <Tab
                      label="Change Test Result"
                      icon={<BrowserUpdatedIcon />}
                    />
                  </Tabs>
                </AppBar>
              </Grid>

              {tabValueMain == 0 && (
                <Grid item xs={24}>
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
                          <MDTypography variant="h6" color="white">
                            {prodTypeTitle} Quality Result Recording
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

                    <MDBox px={3} py={1}>
                      <Grid container spacing={1}>
                        <Grid item xs={2} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Plant*
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={plant}
                            value={selectedPlant}
                            onChange={handlePlantChange}
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
                            Status*
                          </MDTypography>
                          <ReactSelect
                            id="statusList"
                            options={statusList}
                            value={selectedStatus}
                            onChange={handleStatusChange}
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
                            Order*
                          </MDTypography>
                          <ReactSelect
                            id="orderNo"
                            options={orderList}
                            value={selectedOrder}
                            onChange={handleOrderList}
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
                            Item
                          </MDTypography>

                          <ReactSelect
                            id="item"
                            options={orderItemList}
                            value={selectedOrderItem}
                            onChange={handleOrderItemChange}
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
                            Batch
                          </MDTypography>
                          <MDInput
                            label=""
                            name="batch"
                            inputProps={{ maxLength: 10 }}
                            value={allValues.batch || ""}
                            onChange={(e) => handleChange(e)}
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
                            MBatch
                          </MDTypography>
                          <MDInput
                            label=""
                            name="mBatch"
                            inputProps={{ maxLength: 10 }}
                            value={allValues.mBatch || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={getDataFnc}
                          >
                            Submit
                          </MDButton>
                        </Grid>
                        {/*                         
                          <Grid item xs = {1}>
                            
                          <MDButton
                              style={{ marginTop: "1.5rem" }}
                              size="small"
                              color="info"
                              onClick={() => handleConfirmUD(true)}
                            >
                              Confirm UD
                            </MDButton>
                          </Grid> */}

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => handleSaveUD(true)}
                            disabled={hideSaveUd}
                          >
                            Save UD
                          </MDButton>
                        </Grid>
                      </Grid>

                      <Grid item xs={6}>
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label">
                            Action
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={valueRadio}
                            onChange={handleRadioChange}
                          >
                            <FormControlLabel
                              value="ConfirmUD"
                              control={<Radio />}
                              label="Confirm UD"
                            />
                            <FormControlLabel
                              value="RejectUD"
                              control={<Radio />}
                              label="Reject UD"
                            />
                            <FormControlLabel
                              value="ReturnToProd"
                              control={<Radio />}
                              label="Return to Production"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
              )}

              {tabValueMain == 0 && (
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
                        <Grid item xs={2}>
                          <Tooltip title="Capture Quality Result">
                            <IconButton
                              color="white"
                              onClick={() => getQualityResultDataFunc()}
                            >
                              <SearchIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelqualityTableData()}
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
                          <div id="displayTable" />
                          {/* <br /> */}
                          {/* <p
                                        color="black"
                                        style={{
                                          color: "black",
                                          paddingLeft: "1rem",
                                          marginTop: "-1rem",
                                        }}
                                      >
                                        Showing 1 to {qualityData.length} of{" "}
                                        {qualityData.length} entries
                                      </p> */}
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
              )}

              {tabValueMain == 0 && (
                <Grid item xs={6}>
                  <AppBar position="static">
                    <Tabs
                      orientation={"horizontal"}
                      value={tabValue}
                      onChange={handleSetTabValue}
                    >
                      <Tab label="Quality Result Recording" icon={<Today />} />
                      <Tab label="Defect Recording" icon={<ListAltIcon />} />
                    </Tabs>
                  </AppBar>
                </Grid>
              )}

              {tabValueMain == 0 && (
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
                              Quality Result Recording
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            {qrrFlg == 0 && (
                              <MDTypography variant="p" color="red">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <span style={{ color: "white" }}>
                                  NOTE : Quality result recording is not
                                  required at this stage
                                </span>
                              </MDTypography>
                            )}
                          </Grid>
                          <Grid item xs={2}>
                            <Tooltip title="Save Data" arrow>
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => saveData(true)}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </MDBox>
                      <MDBox px={3} py={1}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            {qrrFlg > 0 && <div id="getqualityResultTable" />}
                            {/* <br />
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            Showing 1 to {qualityResultData.length} of{" "}
                            {qualityResultData.length} entries
                          </p> */}
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
                          <Grid item xs={4}>
                            <MDTypography variant="h6" color="white">
                              Defect Recording
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <MDTypography variant="p" color="white">
                                Scrap Tubes(nos) : {sumPrimeTubes}
                              </MDTypography>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              {showScrapWt && (
                                <MDTypography variant="p" color="white">
                                  Scrap Wt(KG) : {totalScrapWt}
                                </MDTypography>
                              )}
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <Tooltip title="Save Defect Recording" arrow>
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={saveDefectRecording}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </MDBox>
                      <MDBox px={3} py={1}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <div
                              id="defectrecordingtable"
                              style={{ display: "inline-block", width: "60%" }}
                            />
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  )}
                </Grid>
              )}

              {tabValueMain == 1 && (
                <Grid item xs={24}>
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
                              onClick={() => handleClearAllDeci(true)}
                            >
                              <ClearAllIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={1}>
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
                            Plant*
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={plant}
                            value={selectedPlantDeci}
                            onChange={handlePlantChangeDeci}
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
                            Mbatch
                          </MDTypography>
                          {/* <ReactSelect
                                          id="orderNo"
                                          options={orderList}
                                          value={selectedOrder}
                                          onChange={handleOrderList}
                                        /> */}
                          <MDInput
                            label=""
                            name="coil"
                            inputProps={{ maxLength: 10 }}
                            value={allValuesDeci.coil || ""}
                            onChange={(e) => handleChangeDeci(e)}
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
                            Batch
                          </MDTypography>
                          <MDInput
                            label=""
                            name="batch"
                            inputProps={{ maxLength: 10 }}
                            value={allValuesDeci.batch || ""}
                            onChange={(e) => handleChangeDeci(e)}
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
                            Status
                          </MDTypography>
                          {/* <MDInput
                                          label=""
                                          name="status"

                                          inputProps={{ maxLength: 10 }}
                                          value={allValuesDeci.status || ""}
                                          onChange={(e) => handleChangeDeci(e)}
                                        /> */}
                          <ReactSelect
                            id="qastatusList"
                            options={qaDeciStatusList}
                            value={qaDeciSelectedStatus}
                            onChange={handleQAStatusChange}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => getDataDeciFnc(true)}
                          >
                            Submit
                          </MDButton>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
              )}

              {tabValueMain == 1 && (
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
                            QA Decision Data
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Save">
                            <IconButton
                              color="white"
                              disabled={isReadWriteAccess}
                              onClick={() => saveDeciTableData()}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelqaDeciTableData()}
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
                          <div id="qaDeci" />
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
              )}

              {tabValueMain == 2 && (
                <Grid item xs={24}>
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
                              onClick={() => handleClearAllDeci(true)}
                            >
                              <ClearAllIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={1}>
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
                            Plant*
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={plant}
                            value={selectedPlantDeci}
                            onChange={handlePlantChangeTstResult}
                          />
                        </Grid>

                        {/* <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Mbatch
                          </MDTypography>

                          <MDInput
                            label=""
                            name="coil"
                            inputProps={{ maxLength: 10 }}
                            value={allValuesDeci.coil || ""}
                            onChange={(e) => handleChangeDeci(e)}
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
                            Batch
                          </MDTypography>
                          <MDInput
                            label=""
                            name="batch"
                            inputProps={{ maxLength: 10 }}
                            value={allValuesDeci.batch || ""}
                            onChange={(e) => handleChangeDeci(e)}
                          />
                        </Grid> */}
                        {/* ========== */}
                        {/* <Grid item xs={1.5} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Mbatch*
                          </MDTypography>
                          <ReactSelect
                            id="statusList"
                            options={mbatchList}
                            value={selectedMbatch}
                            onChange={handleMbatchChange}
                          />
                        </Grid> */}

                        <Grid item xs={2} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Batch*
                          </MDTypography>
                          <ReactSelect
                            id="statusList"
                            options={batchList}
                            value={selectedbatch}
                            onChange={handlebatchChange}
                          />
                        </Grid>
                        {/* ============= */}

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => getDataTestResult(true)}
                          >
                            Submit
                          </MDButton>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
              )}

              {tabValueMain == 2 && (
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
                            Test Details
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Save Data">
                            <IconButton
                              color="white"
                              onClick={() => saveTestResultDataFunc()}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox px={3} py={1}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <div id="displayTableTest" />
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

      {showCastDetailModal && (
        <LDSM034CastDetailModal
          open={showCastDetailModal}
          close={setShowCastDetailModal}
          confirmData={castDetailData}
          castNo={castNo}
        // openScrap = {setShowScrapModal}
        // scrapData = {setScrapModalData}
        />
      )}
    </DashboardLayout>
  );
}
