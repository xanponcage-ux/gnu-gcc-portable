import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import "../../tabulatorCss.scss";

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
import ReactSelect from "components/Select/ReactSelect";
// Data
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";

//icons
import SummarizeIcon from "@mui/icons-material/Summarize";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SegmentIcon from "@mui/icons-material/Segment";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import IconButton from "@mui/material/IconButton";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { GetAuthorization } from "utils";

export default function LDSC002() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [bUnit, setBunit] = useState([]);

  const [castTestData, setCastTestData] = useState([]);
  const [castTestTable, setCastTestTable] = useState(null);
  const [coilTestData, setCoilTestData] = useState([]);
  const [coilTestTable, setCoilTestTable] = useState(null);
  const [specLimitData, setSpecLimitData] = useState([]);
  const [specLimitTable, setSpecLimitTable] = useState(null);
  const [batchTestData, setBatchTestData] = useState([]);
  const [batchTestTable, setBatchTestTable] = useState(null);

  const [allValuesBatch, setAllValuesBatch] = useState({
    castNo: "",
    batchNo: "",
  });
  const [ipData, setIpData] = useState([]);
  const [ipTable, setIpTable] = useState(null);

  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const [tdc, setTdc] = useState([]);
  const [selectedTdc, setSelectedTdc] = React.useState([]);

  const [param, setParam] = useState([]);
  const [selectedParam, setSelectedParam] = React.useState([]);

  const [allValuesSpec, setAllValuesSpec] = useState({
    tdc: "",
    param: "",
  });

  const [allValuesCast, setAllValuesCast] = useState({
    castNo: "",
  });

  const [allValuesCoil, setAllValuesCoil] = useState({
    castNo: "",
    batchNo: "",
  });

  const [allValuesIp, setAllValuesIp] = useState({
    ip: "",
    spec: "",
  });

  const handleChangeSpec = (e) => {
    setAllValuesSpec({ ...allValuesSpec, [e.target.name]: e.target.value });
  };

  const handleChangeCast = (e) => {
    setAllValuesCast({ ...allValuesCast, [e.target.name]: e.target.value });
  };
  const handleChangeBatch = (e) => {
  setAllValuesBatch({
    ...allValuesBatch,
    [e.target.name]: e.target.value,
  });
};

  const handleChangeCoil = (e) => {
    setAllValuesCoil({ ...allValuesCoil, [e.target.name]: e.target.value });
  };

  const handleChangeIp = (e) => {
    setAllValuesIp({ ...allValuesIp, [e.target.name]: e.target.value });
  };

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      //page load functions here
      Promise.all([getTDC(token.accessToken)]).finally(() => {
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
      var pageName = "LDSC002";

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

  const getBatchTestRes = () => {
  var data = { ...allValuesBatch };

  if (data.batchNo == "") {
    alertify.error("Please enter Batch Number");
    setBatchTestData([,]);
    return;
  }

  setLoading(true);

  GetAuthorization().then((token) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };

    var url = "api/LDSC002/getBatchTest";

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (
          response.statusText != "" &&
          response.statusText != "OK"
        ) {
        } else {
          if (response.data.length == 0) {
            alertify.error("No Data Found");
            setBatchTestData([,]);
          } else {
            setBatchTestData(response.data);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  });
};
useEffect(() => {
  if (tabValue == 3) {
    if (batchTestData && batchTestData.length > 0) {
      setBatchTestTable(
        new Tabulator("#batchTest", {
          data: batchTestData,
          columns: batchTestColumn,
          // height: 500,
          layout: "fitDataFill",
          movableColumns: true,
          pagination: true,
          paginationSize: 20,
        })
      );
    }
  }
}, [batchTestData, tabValue]);

const downloadExcelBatchTest = () => {
  if (batchTestData.length == 0) {
    alertify.error("No Data exists in table for Downloading");
    return;
  }

  batchTestTable.download(
    "xlsx",
    "Batch_Test.xlsx",
    {
      sheetName: "Sheet1",
    }
  );
};
const handleClearAllBatchTest = () => {
  setAllValuesBatch({
    castNo: "",
    batchNo: "",
  });

  setBatchTestData([,]);
  setBatchTestTable(null);
};
const batchTestColumn = [
  {
    title: "Cast No",
    field: "BTR_CAST_NO",
    headerFilter: "input",
  },
  {
    title: "Batch No",
    field: "BTR_PROD_NO",
    headerFilter: "input",
  },
  {
    title: "Lab Test Code",
    field: "BTR_LAB_TEST_CD",
    headerFilter: "input",
  },
  {
    title: "Test Parameter",
    field: "BTR_TEST_PARA",
    headerFilter: "input",
  },
  {
    title: "Sequence No",
    field: "BTR_SEQ_NO",
    headerFilter: "input",
  },
  {
    title: "Parameter Remark",
    field: "BTR_TEST_PARA_REM",
    headerFilter: "input",
  },
  {
    title: "Parameter Value",
    field: "BTR_TEST_PARA_VAL",
    headerFilter: "input",
    formatter: function (cell) {
      const value = cell.getValue();
      if (value !== null && value !== undefined) {
        return Number(value).toFixed(4);
      }
      return value;
    },
  },
  {
    title: "Vendor Cast No",
    field: "BTR_CAST_NO_VEND",
    headerFilter: "input",
  },
  {
    title: "Source",
    field: "BTR_SOURCE",
    headerFilter: "input",
  },
  {
    title: "Created Date",
    field: "BTR_CRT_DT",
    headerFilter: "input",
  },
  {
    title: "Created By",
    field: "BTR_CRT_BY",
    headerFilter: "input",
  },
  {
    title: "Updated Date",
    field: "BTR_UPD_DT",
    headerFilter: "input",
  },
  {
    title: "Updated By",
    field: "BTR_UPD_BY",
    headerFilter: "input",
  },
  {
    title: "Source Program",
    field: "BTR_SOURCE_PGM",
    headerFilter: "input",
  },
  {
    title: "Error Code",
    field: "BTR_ERROR_CD",
    headerFilter: "input",
  },
  {
    title: "PI Status",
    field: "BTR_PI_STATUS",
    headerFilter: "input",
  },
  {
    title: "Pick Timestamp",
    field: "BTR_PICK_TIMESTAMP",
    headerFilter: "input",
  },
  {
    title: "Ack Timestamp",
    field: "BTR_ACK_TIMESTAMP",
    headerFilter: "input",
  },
  {
    title: "Post Timestamp",
    field: "BTR_POST_TIMESTAMP",
    headerFilter: "input",
  },
  {
    title: "PI IB Message Id",
    field: "BTR_PI_IB_MESSAGE_ID",
    headerFilter: "input",
  },
  {
    title: "PI OB Message Id",
    field: "BTR_PI_OB_MESSAGE_ID",
    headerFilter: "input",
  },
  {
    title: "PI Source Program",
    field: "BTR_PI_SOURCE_PGM",
    headerFilter: "input",
  },
  {
    title: "Upload Result Tag",
    field: "BTR_UP_RESULT_TAG",
    headerFilter: "input",
  },
];

  //use Effect to render display data
  useEffect(() => {
    if (tabValue == 0) {
      // if (specLimitData.length == 0) {
      //   getSpecLimitMast();
      // }
      if (specLimitData && specLimitData.length > 0) {
        setSpecLimitTable(
          new Tabulator("#specLimitMaster", {
            data: specLimitData,
            columns: specLimitColumn,
            height: 400,
            layout: "fitDataFill",
          })
        );
      }
    }
  }, [specLimitData, tabValue]);

  useEffect(() => {
    if (tabValue == 1) {
      // if (castTestData.length == 0) {
      //   getCastTestRes();
      // }
      if (castTestData && castTestData.length > 0) {
        setCastTestTable(
          new Tabulator("#castTest", {
            data: castTestData,
            columns: castTestColumn,
            height: 400,
            layout: "fitDataFill",
          })
        );
      }
    }
  }, [castTestData, tabValue]);

  useEffect(() => {
    if (tabValue == 2) {
      // if (coilTestData.length == 0) {
      //   getCoilTestRes();
      // }
      if (coilTestData && coilTestData.length > 0) {
        setCoilTestTable(
          new Tabulator("#coilTest", {
            data: coilTestData,
            columns: coilTestColumn,
            height: 400,
            layout: "fitDataFill",
          })
        );
      }
    }
  }, [coilTestData, tabValue]);

  useEffect(() => {
    if (tabValue == 4) {
      // if (ipData.length == 0) {
      //   getIpSpecMast();
      // }
      if (ipData && ipData.length > 0) {
        setIpTable(
          new Tabulator("#ipspecmast", {
            data: ipData,
            columns: ipColumn,
            height: 400,
            layout: "fitDataFill",
          })
        );
      }
    }
  }, [ipData, tabValue]);

  const getSpecLimitMast = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      // var data = { ...allValuesSpec };
      var data = { tdc: selectedTdc?.value, param: selectedParam?.value };

      var url = "api/LDSC002/getspeclimit";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setSpecLimitData([,]);
            } else {
              setSpecLimitData(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getCastTestRes = () => {
    var data = { ...allValuesCast };

    if (data.castNo == "") {
      alertify.error("Please enter Cast Number");
      setCastTestData([,]);
      return;
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LDSC002/getcasttest";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setCastTestData([,]);
            } else {
              setCastTestData(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getCoilTestRes = async (newToken = false) => {
    var data = { ...allValuesCoil };

    if (data.batchNo == "") {
      alertify.error("Please enter Batch Number");
      setCoilTestData([,]);
      return;
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LDSC002/getcoiltest";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setCoilTestData([,]);
            } else {
              setCoilTestData(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getIpSpecMast = async (newToken = false) => {
    var data = { ...allValuesIp };

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LDSC002/getinspplan";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setIpData([,]);
            } else {
              setIpData(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const castTestColumn = [
    // {
    //   formatter: "rowSelection",
    //   titleFormatter: "rowSelection",
    //   hozAlign: "center",
    //   headerSort: false,
    //   width: "2%",
    // },
    {
      title: "Cast No",
      field: "TCA_CAST_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Test Para",
      field: "TCA_TEST_PARA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Test Para Remarks",
      field: "TCA_TEST_PARA_REM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Test Para Val",
      field: "TCA_TEST_PARA_VAL",
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
      title: "Created Date",
      field: "CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const coilTestColumn = [
    // {
    //   formatter: "rowSelection",
    //   titleFormatter: "rowSelection",
    //   hozAlign: "center",
    //   headerSort: false,
    //   width: "2%",
    // },
    {
      title: "Batch No",
      field: "TCO_PROD_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cast No",
      field: "TCO_CAST_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Lab Test Cd",
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
      title: "Test Para Rem",
      field: "TCO_TEST_PARA_REM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Test Para Val",
      field: "TCO_TEST_PARA_VAL",
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
      title: "Created Date",
      field: "CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const ipColumn = [
    // {
    //   formatter: "rowSelection",
    //   titleFormatter: "rowSelection",
    //   hozAlign: "center",
    //   headerSort: false,
    //   width: "2%",
    // },
    {
      title: "Mandt",
      field: "MANDT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ip",
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
      title: "Comp Value",
      field: "COMP_VAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Created By",
      field: "CRT_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Created Date",
      field: "CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Program ID",
      field: "PROG_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const specLimitColumn = [
    // {
    //   formatter: "rowSelection",
    //   titleFormatter: "rowSelection",
    //   hozAlign: "center",
    //   headerSort: false,
    //   width: "2%",
    // },
    {
      title: "Tdc",
      field: "TSL_TDC_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Test Para",
      field: "TSL_TEST_PARA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Para Min",
      field: "TSL_PARA_MIN",
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
      title: "Para Max",
      field: "TSL_PARA_MAX",
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
      title: "Para Unit",
      field: "TSL_PARA_UNIT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Created Date",
      field: "CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];
  const downloadExcelSpecLimitMast = () => {
    if (specLimitData.length == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "Spec_Limit_Mast " + ".xlsx";
    specLimitTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelCastTest = () => {
    if (castTestData.length == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "Cast_Test " +  ".xlsx";
    castTestTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelCoilTest = () => {
    if (coilTestData.length == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "Coil_Test " + ".xlsx";
    coilTestTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelIp = () => {
    if (ipData.length == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "IP_and_Spec_Mast " + ".xlsx";
    ipTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleClearAllSpecLimit = (newToken = false) => {
    // setAllValuesSpec({});
    setSelectedTdc([]);
    setSelectedParam([]);
    setSpecLimitData([,]);
    setSpecLimitTable(null);
  };

  const handleClearAllCastTest = (newToken = false) => {
    setAllValuesCast({});
    setCastTestData([,]);
    setCastTestTable(null);
  };

  const handleClearAllCoilTest = (newToken = false) => {
    setAllValuesCoil({});
    setCoilTestData([,]);
    setCoilTestTable(null);
  };

  const handleClearAllIp = (newToken = false) => {
    setAllValuesIp({});
    setIpData([,]);
    setIpTable(null);
  };

  const handleTdcChange = (value) => {
    if (value) {
      setSpecLimitData([,]);
      setSelectedTdc(value);
      getParam(value);
    } else {
      setSelectedTdc([]);
    }
  };

  const handleParamChange = (value) => {
    if (value) {
      setSelectedParam(value);
      setSpecLimitData([,]);
    } else {
      setSelectedParam([]);
    }
  };

  const getTDC = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        tdc: serverDetails.PersonalNo,
      };
      var url = "api/LDSC002/getTdc";
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
            setTdc(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getParam = (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      let data = {
        tdc: value?.value,
      };
      var url = "api/LDSC002/getParam";
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
            setParam(items);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Common" page="Parameter Master" />
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
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab
                      label="Spec Limit Master"
                      icon={<FormatListBulletedIcon />}
                    />
                    <Tab label="Cast Test Result" icon={<SummarizeIcon />} />
                    <Tab label="Coil Test Result" icon={<AssessmentIcon />} />
                    <Tab label="Batch Test Result" icon={<AssessmentIcon />} />
                    <Tab label="IP and Spec Master" icon={<SegmentIcon />} />
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
                        <Grid item xs={2}>
                          <Tooltip title="Clear All">
                            <IconButton
                              color="white"
                              onClick={() => handleClearAllSpecLimit(true)}
                            >
                              <ClearAllIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={1}>
                      <Grid item xs={12}>
                        <Grid container spacing={1}>
                          {/* <Grid item xs={1}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              TDC
                            </MDTypography>

                            <MDInput
                              label=""
                              name="tdc"
                              inputProps={{ maxLength: 10 }}
                              value={allValuesSpec.tdc || ""}
                              onChange={(e) => handleChangeSpec(e)}
                            />
                          </Grid> */}

                          <Grid item xs={1.5} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              TDC
                            </MDTypography>
                            <ReactSelect
                              id="tdc"
                              options={tdc}
                              onChange={handleTdcChange}
                              value={selectedTdc}
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
                              Parameter{" "}
                            </MDTypography>
                            <ReactSelect
                              id="Parameter"
                              options={param}
                              onChange={handleParamChange}
                              value={selectedParam}
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
                              Parameter
                            </MDTypography>
                            <MDInput
                              label=""
                              name="param"
                              inputProps={{ maxLength: 10 }}
                              value={allValuesSpec.param || ""}
                              onChange={(e) => handleChangeSpec(e)}
                            />
                          </Grid> */}

                          <Grid item xs={1}>
                            <MDButton
                              style={{ marginTop: "1.5rem" }}
                              size="small"
                              color="info"
                              onClick={() => getSpecLimitMast(true)}
                            >
                              Submit
                            </MDButton>
                          </Grid>
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
                        <Grid item xs={2}>
                          <Tooltip title="Clear All">
                            <IconButton
                              color="white"
                              onClick={() => handleClearAllCastTest(true)}
                            >
                              <ClearAllIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={1}>
                      <Grid item xs={12}>
                        <Grid container spacing={1}>
                          <Grid item xs={1}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Cast No*
                            </MDTypography>
                            <MDInput
                              label=""
                              name="castNo"
                              inputProps={{ maxLength: 10 }}
                              value={allValuesCast.castNo || ""}
                              onChange={(e) => handleChangeCast(e)}
                            />
                          </Grid>

                          <Grid item xs={1}>
                            <MDButton
                              style={{ marginTop: "1.5rem" }}
                              size="small"
                              color="info"
                              onClick={() => getCastTestRes(true)}
                            >
                              Submit
                            </MDButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
                {tabValue == 2 && (
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
                              onClick={() => handleClearAllCoilTest(true)}
                            >
                              <ClearAllIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={1}>
                      <Grid item xs={12}>
                        <Grid container spacing={1}>
                          <Grid item xs={1}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Batch No*
                            </MDTypography>
                            <MDInput
                              label=""
                              name="batchNo"
                              inputProps={{ maxLength: 10 }}
                              value={allValuesCoil.batchNo || ""}
                              onChange={(e) => handleChangeCoil(e)}
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
                              Cast No
                            </MDTypography>
                            <MDInput
                              label=""
                              name="castNo"
                              inputProps={{ maxLength: 10 }}
                              value={allValuesCoil.castNo || ""}
                              onChange={(e) => handleChangeCoil(e)}
                            />
                          </Grid>

                          <Grid item xs={1}>
                            <MDButton
                              style={{ marginTop: "1.5rem" }}
                              size="small"
                              color="info"
                              onClick={() => getCoilTestRes(true)}
                            >
                              Submit
                            </MDButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
                {tabValue == 3 && (
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
                              onClick={handleClearAllBatchTest}
                            >
                              <ClearAllIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={1}>
                      <Grid container spacing={1}>
                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color="dark"
                          >
                            Batch No*
                          </MDTypography>

                          <MDInput
                            name="batchNo"
                            value={allValuesBatch.batchNo || ""}
                            onChange={handleChangeBatch}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color="dark"
                          >
                            Cast No
                          </MDTypography>

                          <MDInput
                            name="castNo"
                            value={allValuesBatch.castNo || ""}
                            onChange={handleChangeBatch}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={getBatchTestRes}
                          >
                            Submit
                          </MDButton>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
                {tabValue == 4 && (
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
                              onClick={() => handleClearAllIp(true)}
                            >
                              <ClearAllIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={1}>
                      <Grid item xs={12}>
                        <Grid container spacing={1}>
                          <Grid item xs={1}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              I.P
                            </MDTypography>
                            <MDInput
                              label=""
                              name="ip"
                              inputProps={{ maxLength: 10 }}
                              value={allValuesIp.ip || ""}
                              onChange={(e) => handleChangeIp(e)}
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
                              Spec
                            </MDTypography>
                            <MDInput
                              label=""
                              name="spec"
                              inputProps={{ maxLength: 10 }}
                              value={allValuesIp.spec || ""}
                              onChange={(e) => handleChangeIp(e)}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <MDButton
                              style={{ marginTop: "1.5rem" }}
                              size="small"
                              color="info"
                              onClick={() => getIpSpecMast(true)}
                            >
                              Submit
                            </MDButton>
                          </Grid>
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
                            Spec Limit Master
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelSpecLimitMast()}
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
                          <div id="specLimitMaster" />
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
                            Cast Test Results
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelCastTest()}
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
                          <div id="castTest" />
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
                )}
                {tabValue == 2 && (
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
                            Coil Test Results
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelCoilTest()}
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
                          <div id="coilTest" />
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
                )}
                {tabValue == 3 && (
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
                        <Grid item xs={3}>
                          <MDTypography variant="h6" color="white">
                            Batch Test Results
                          </MDTypography>
                        </Grid>

                        <Grid item xs={1}>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={downloadExcelBatchTest}
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
                          <div id="batchTest" />
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
                {tabValue == 4 && (
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
                            IP and Spec Master
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelIp()}
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
                          <div id="ipspecmast" />
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
                )}
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
