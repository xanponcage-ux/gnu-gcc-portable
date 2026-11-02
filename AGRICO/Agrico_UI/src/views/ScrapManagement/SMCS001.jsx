import React, { useEffect, useState, useRef, forwardRef } from "react";
// @mui material components

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
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
import ClearAllIcon from "@mui/icons-material/ClearAll";
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

import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";

export default function SMCS001() {
  const [state, setState] = React.useState({
    checkedA: true,
  });
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [plant, setPlant] = useState([]);
  const [ProcessChartList, setProcessChartList] = useState([0]);
  const [selectedPlant, setSelectedPlant] = React.useState([0]);
  const [selectedAction, setSelectedAction] = React.useState([{ label: 'Display', value: 'V' }]);
  const [processChartData, setprocessChartData] = React.useState([]);
  const [processChartTable, setprocessChartTable] = useState(null);
  
  const [processChemistryData, setprocessChemistryData] = React.useState([]);
  const [processChemistryTable, setprocessChemistryTable] = useState(null);

  var customerTable = React.createRef();

  const [selectPname, setPname] = React.useState([]);
  const [selectedPname, setSelectPname] = React.useState([]);


  // my varaibles
  const [selectProcessChartNo, setProcessChartNo] = useState();
  const [selectVersion,setVersion] = useState();
  const [selectProcessChartNoI, setProcessChartNoI] = useState();
  const [selectVersionI,setVersionI] = useState();
  const [selectProdVersion,setProdVersion] = useState();
  const [selectProductGroup,setProductGroup] = useState();
  const [selectQualityCode,setQualityCode] = useState();
  const [selectProductCategory,setProductCategory] = useState();
  const [selectTDCNo,setTDCNo] = useState();
  const [selectProductApplication,setProductApplication] = useState();
  const [selectGradeDescription, setGradeDescription] = useState();
  const [selectRemarks, setRemarks] = useState();

  const action = [
    { label:'Display',value:'V'},
    { label: 'Insert', value:'INSERT'},
    { label: 'Modify', value:'MODIFY'},
    { label: 'Reactivate', value:'REACTIVATE'},
    { label: 'Deactivate', value:'DEACTIVATE'},
   ]

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      //page load functions here
      Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  }
  //page load
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (processChartData) {
      setprocessChartTable(
        new Tabulator("#processChartTable", {
          //   pagination: "local", //enable local pagination.
          data: processChartData,
          columns: processChartDataColumn,
          height: 200,
          layout: "fitDataStretch",
        })
      );
    }
  },[processChartData]);

  useEffect (() => {
    if (processChemistryData) {
      setprocessChemistryTable(
        new Tabulator('#processChemistryTable', {
          //   pagination: "local", //enable local pagination.
          data: processChemistryData,
          columns: processChemistryColumn,
          height: 200,
          layout: "fitDataStretch",
        })
      );
    }
  },[processChemistryData])


  const validateUser = async (token) => {
    try {
      var plant = "";
      // if (serverDetails.PersonalNo === ``)
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
      var pageName = "SMCS001";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
      );
      // commenting out the screen auth
      if (authDetails) {
        setRestricted(false);
      
        if (authDetails.payload.PS_AUTH_DML == "Z") {
          setRestricted(true);
          setRestricted(false); // Added temp to view screen 
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
        //  }
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
            Promise.all([getProcessChartList(items[0].value,'')]).finally(() => {
              resolve();
            });
          }
        })
        .catch((f) => {
          resolve();
        });
    });
  };

  // get prochart list--
  const getProcessChartList = (Plant,Action) => {
    return new Promise((resolve) => {
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
      
      let data = {
        plant: Plant,
        Action: Action?Action:''
        // adid: serverDetails.PersonalNo,
      };
      var url = "api/smcs001/getProcessChartList";
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
              obj.value = row[0];
              items.push(obj);
            });
            setProcessChartList(items);
            resolve();
          }
        }).catch((f) => {
          resolve();
        });
    });
  })
};

  const handlePlantChange = (value) => {
    setSelectedPlant(value);
    setprocessChartData([]);
    setprocessChemistryData([]);
    /*
    if (value) {
      setProcessList(0);
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([getProcessList(value, token.accessToken), getProductName(value, token.accessToken)]).finally(() => {
          setLoading(false);
        });
      }); 
    } */
  };
  const handleActionChange = (value) => {
        setSelectedAction(value);
    setprocessChartData([]);
    setprocessChemistryData([]);
  //       if (value==='D'){
    getProcessChartList(selectedPlant.value,value.value)
  // }
  }
  const handleProcessChartChange = (value) => {
    setProcessChartNo(value);
    setprocessChartData([]);
    setprocessChemistryData([]);
  }
  
  const getData= () => {
    getProcessData()
    getChemistryData()
  }


  const getProcessData = () => {
    //   getBusinessUnit();
    //If Session(CommonConstants.SPC_BUS_UNIT) = "TUBES" Or Session(CommonConstants.SPC_BUS_UNIT) = "LP" Then
    if (selectedPlant?.value === undefined) {
      alertify.error("Please select Plant");
      return;
    }

    // setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url;
      // var data = {
      //     plant: selectedPlant.value,
      //     // BUnit :value[0]
      // };
      // var ProdDtFrm = document.getElementById("ProdDtFrm").value;
      // var ProdDtTo = document.getElementById("ProdDtTo").value;
      // var SchedDtFrm = document.getElementById("SchedDtFrm").value;
      // var SchedDtTo = document.getElementById("SchedDtTo").value;

      var data = {
        plant: selectedPlant.value ? selectedPlant.value :'',
        Process_ChartNO: selectProcessChartNo?selectProcessChartNo.value:'',
        Version : selectVersion||'',
        Product_Group : '',     //selectProductGroup,
        Product_Group_Description :'',  // selectProductGD,
        Quality_Code : '',      //selectQualityCode,
        Product_Category :'' ,   // selectProductCategory,
        TDC_No : '',        //selectTDCNo,
        Product_Application :'',// selectProductApplication,
        Grade_Description : '', //selectGradeDescription
        Action: selectedAction.value
      };

      console.log(data)

      url = "api/smcs001/getProcessChartData"

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data[1].length !== 0) {
              setprocessChartData(response.data[1]);
            } else {
              alertify.error("No Data Found");
            }
          }
        })
        .catch((error) => {
          setprocessChartData([]);
          // setprocessChartTable(null);
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getChemistryData = () => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url;
      // var data = {
      //     plant: selectedPlant.value,
      //     // BUnit :value[0]
      // };

      var data = {
        Plant: selectedPlant.value ? selectedPlant.value : '',
        Process_ChartNO: selectProcessChartNo?selectProcessChartNo.value:'',
        Version : selectVersion||'',
      };

      url = "api/smcs001/getProcessChartSpec"

      axiosAPI .post(url, data, defaultOptions) .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data[1]) {
              setprocessChemistryData(response.data[1]);
            } else {
              alertify.error("No Data Found");
            }
          }
        })
        .catch((error) => {
          setprocessChemistryData([]);
          // setprocessChartTable(null);
        })
        .finally((f) => {
          setLoading(false);
        });
    });
    //  downloadExcelChemistryTableData();
  }

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


// PCM_PCHART_NO,PCM_VERSION,PCM_QCODE,PCM_TDC_NO,PCM_GRADE_DESC,PCM_GRADE_APPL,
// DECODE(PCM_STATUS,'C','Draft','A','Released','N','Not Active',' ') PCM_STATUS,
// PCM_PROD_GRP,PCM_PROD_SUBGRP,PCM_PROD_VERSION,PGM_PGRP_DESC,PCM_PROD_CATG
  const processChartDataColumn = [

    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    {
      title: "Process Chart No",
      field: "PCM_PCHART_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // frozen: true,
    },
    {
      title: "Version",
      field: "PCM_VERSION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Quality Code",
      field: "PCM_QCODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "TDC No",
      field: "PCM_TDC_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Grade Desc",
      field: "PCM_GRADE_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    
    {
      title: "Grade Appl",
      field: "PCM_GRADE_APPL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Status",
      field: "PCM_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Prod Grp",
      field: "PCM_PROD_GRP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Prod Subgrp",
      field: "PCM_PROD_SUBGRP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Version",
      field: "PCM_PROD_VERSION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Pgrp Desc",
      field: "PGM_PGRP_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod Category",
      field: "PCM_PROD_CATG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    }
  ];

const processChemistryColumn = [
  { title: "PChart No", field: "PCM_PCHART_NO", headerFilter: "input" },
  { title: "Grade Desc", field: "PCM_GRADE_DESC", headerFilter: "input" },
  { title: "%C (MIN_AIM)", field: "%C(MIN_AIM)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%C (MAX_AIM)", field: "%C(MAX_AIM)", headerFilter: "input",  hozAlign: "right" ,formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%Mn (MIN_AIM)", field: "%Mn(MIN_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "%Mn (MAX_AIM)", field: "%Mn(MAX_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "%Si (MIN_AIM)", field: "%Si(MIN_AIM)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%Si (MAX_AIM)", field: "%Si(MAX_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "%S (MIN_AIM)", field: "%S(MIN_AIM)", headerFilter: "input",  hozAlign: "right" ,formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%S (MAX_AIM)", field: "%S(MAX_AIM)", headerFilter: "input",  hozAlign: "right" ,formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "%P (MIN_AIM)", field: "%P(MIN_AIM)", headerFilter: "input",  hozAlign: "right" ,formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "%P (MAX_AIM)", field: "%P(MAX_AIM)", headerFilter: "input",  hozAlign: "right" ,formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "%Cr (MIN_AIM)", field: "%Cr(MIN_AIM)", headerFilter: "input",  hozAlign: "right" ,formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "%Cr (MAX_AIM)", field: "%Cr(MAX_AIM)", headerFilter: "input",  hozAlign: "right" ,formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "%V (MIN_AIM)", field: "%V(MIN_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "%V (MAX_AIM)", field: "%V(MAX_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "N ppm (MIN_AIM)", field: "Nppm(MIN_AIM)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "N ppm (MAX_AIM)", field: "Nppm(MAX_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "Al (MIN_AIM)", field: "Al(MIN_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "Al (MAX_AIM)", field: "Al(MAX_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "Nb (MIN_AIM)", field: "Nb(MIN_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "Nb (MAX_AIM)", field: "Nb(MAX_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "Ti (MIN_AIM)", field: "Ti(MIN_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "Ti (MAX_AIM)", field: "Ti(MAX_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "B (MIN_AIM)", field: "B(MIN_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "B (MAX_AIM)", field: "B(MAX_AIM)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "%C (MIN_ACHV)", field: "%C(MIN_ACHV)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "%C (MAX_ACHV)", field: "%C(MAX_ACHV)", headerFilter: "input",  hozAlign: "right" ,formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%Mn (MIN_ACHV)", field: "%Mn(MIN_ACHV)", headerFilter: "input",  hozAlign: "right" ,formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%Mn (MAX_ACHV)", field: "%Mn(MAX_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%Si (MIN_ACHV)", field: "%Si(MIN_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%Si (MAX_ACHV)", field: "%Si(MAX_ACHV)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%S (MIN_ACHV)", field: "%S(MIN_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%S (MAX_ACHV)", field: "%S(MAX_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%P (MIN_ACHV)", field: "%P(MIN_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%P (MAX_ACHV)", field: "%P(MAX_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%Cr (MIN_ACHV)", field: "%Cr(MIN_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%Cr (MAX_ACHV)", field: "%Cr(MAX_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "%V (MIN_ACHV)", field: "%V(MIN_ACHV)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "%V (MAX_ACHV)", field: "%V(MAX_ACHV)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, },
  { title: "N ppm (MIN_ACHV)", field: "Nppm(MIN_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "N ppm (MAX_ACHV)", field: "Nppm(MAX_ACHV)", headerFilter: "input",  hozAlign: "right" ,formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "Al (MIN_ACHV)", field: "Al(MIN_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "Al (MAX_ACHV)", field: "Al(MAX_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "Nb (MIN_ACHV)", field: "Nb(MIN_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "Nb (MAX_ACHV)", field: "Nb(MAX_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "Ti (MIN_ACHV)", field: "Ti(MIN_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "Ti (MAX_ACHV)", field: "Ti(MAX_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "B (MIN_ACHV)", field: "B(MIN_ACHV)", headerFilter: "input",  hozAlign: "right", formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },},
  { title: "B (MAX_ACHV)", field: "B(MAX_ACHV)", headerFilter: "input",  hozAlign: "right",formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      }, }
];
  const updateActiveDeactive=()=>{
    var selectedRows = processChartTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select process chart table rows");
      return;
    }
    const PCHART=[];
    selectedRows.forEach(function (item) {
      PCHART.push(item._row.data);
    });
    var data={
      Plant: selectedPlant.value,
      Action: selectedAction.value,
      PCHART: PCHART,
    }
    setLoading(true);
    var url = "api/smcs001/updateActiveDeactive";
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
            // if (response.data.toString().startsWith("Y-")) {
            //   msg = "All Data Saved successfully";
            //   alertify.success(msg);
            // } else {
            //   msg = response.data;
            //   alertify.error(msg);
            //   setLoading(false);
            // }
            //
            if (response.data.res_n.length == 0 && response.data.res_y.length>0 ) {
                  msg = "All process chart data updated successfully";
                  setprocessChartData([]);
                } else {
                    setprocessChartData([]);
                  msg += "Process chart : ";
                  response.data.res_n.map((val) => {
                    msg +=val[0]+"-"+val[1]+"-"+ val.toString() + ", ";
                  });
                  if (response.data.res_y.length == 0) {
                    msg += "failed.";
                  } else {
                    msg += " failed and rest are successful.";
                  }
                }
                alertify.success(msg);
          }
        })
        .catch(() => {
          setLoading(false);
        }).finally(() => { setLoading(false); })
    });
  }
  const InsertProcChartData=()=>{
    var data = {
      Plant: selectedPlant.value ,
      Action : selectedAction.value ,
      ProcessChart : selectProcessChartNoI,
      Version: selectVersionI,
      Prod_Version :selectProdVersion,
      QualityCode : selectQualityCode ,
      TDCNo : selectTDCNo,
      ProductGroup : selectProductGroup,
      GradeDesc : selectGradeDescription ,
      ProductApplication : selectProductApplication,
      ProductCategory : selectProductCategory ,
      Remarks : selectRemarks,      
    };
    if (selectedPlant?.value === undefined) {
      alertify.error("Please select Plant");
      return;
    }
    // setLoading(true);
    if (data.ProcessChart === '' || data.ProcessChart ===undefined) {
      alertify.error(
        "Process chart number can not be blank"
      );
      return;
    }
    setLoading(true);
    var url = "api/smcs001/InsertProcChartData";
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
            if (response.data.toString().startsWith("Y-")) {
              msg = "All Data Saved successfully";
              alertify.success(msg);
              setProcessChartNoI('');
              setVersionI('');
              setProdVersion('');
              setProductGroup('');
              setProductGD('');
              setQualityCode('');
              setProductCategory('');
              setTDCNo('');
              setProductApplication('');
              setGradeDescription('');
              setRemarks('');
            } else {
              msg = response.data;
              alertify.error(msg);
              setLoading(false);
            }
          }
        })
        .catch(() => {
          setLoading(false);
        })
        // .finally((f) => {
        //   setFinalnetWtAllotD(0);
        //   setFinalnetWtAllotM(0);
        //   netWtAllotD = 0;
        //   netWtAllotM = 0;
        //   setBtpAllot(0);
        // });
    });
  }


  const clearFilter = () => {
    setProcessChartNo(null);
    setVersion(null);
    setProductGroup(null);
    setProductGD(null);
    setQualityCode(null);
    setProductCategory(null);
    setTDCNo(null);
    setProductApplication(null);
    setGradeDescription(null);
    setprocessChartData([]);
    setprocessChemistryData([]);
  };

  const downloadExcelprocessChartTableData = () => {
    if (processChartData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "SMCS001 " + date.toString() + ".xlsx";
    processChartTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelChemistryTableData =() => {
    // if (processChemistryData) {
    //   setprocessChemistryTable(
    //     new Tabulator(document.createElement("div"), {
    //       //   pagination: "local", //enable local pagination.
    //       data: processChemistryData,
    //       columns: processChemistryColumn,
    //       height: 400,
    //       layout: "fitDataStretch",
    //     })
    //   );
    // }
    if (processChemistryData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var date = new Date();
    var fileName = "SMCS001-Chemistry_Spec" + date.toString() + ".xlsx";
    processChemistryTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  }

  // const getProductName = (value, accessToken) => {
  //   return new Promise((resolve) => {
  //     var defaultOptions = {
  //       headers: {
  //         Authorization: "Bearer " + accessToken,
  //       },
  //     };

  //     var url = "api/ttsm005/getpphProductName";
  //     let data = {
  //       plant: value.value,
  //     };
  //     axiosAPI
  //       .post(url, data, defaultOptions)
  //       .then((response) => {
  //         if (response.statusText != "" && response.statusText != "OK") {
  //           //reject(response.statusText);
  //         } else {
  //           var items = [];
  //           response.data.map((row) => {
  //             var obj = new Object();
  //             obj.label = row[0];
  //             obj.value = row[0];
  //             items.push(obj);
  //           });
  //           setPname(items);
  //         }
  //       })
  //       .finally((f) => {
  //         resolve();
  //       });
  //   });
  // };

  // const handlePnameChange = (value) => {
  //   if (value) {
  //     setSelectPname(value);
  //     setProdInquiryData([]);
  //   } else {
  //     setSelectPname([]);
  //   }
  // };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Scrap Management"
        page="Process Chart Display"
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
                    // py={0.25}
                    // px={1}
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
                      <Grid item xs={0.9}>
                        {/* for clearing the data of the filter */}
                        <Tooltip title="Clear" arrow>
                          <IconButton
                            color="white"
                            onClick={() => clearFilter()}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Plant *
                        </MDTypography>
                        <ReactSelect
                          id="plant"
                          options={plant}
                          onChange={handlePlantChange}
                          value={selectedPlant}
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
                          Action *
                        </MDTypography>
                        <ReactSelect
                          id="action"
                          options={action}
                           onChange={handleActionChange}
                          value={selectedAction}
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
                          Process Chart No
                        </MDTypography>
                        <ReactSelect
                          id="processChartNo"
                          options={ProcessChartList}
                          onChange={handleProcessChartChange}
                          value={selectProcessChartNo}
                        />
                        {/* <MDInput
                          id="processChartNo"
                          options={ProcessChartList}
                          onChange={(e) => {setProcessChartNo(e.target.value)}}
                          value={selectProcessChartNo || ""}
                        /> */}
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
                          Version
                        </MDTypography>
                        <MDInput
                          id="version"
                          onChange={(e) => {setVersion(e.target.value)}}
                          value={selectVersion || ""}
                          />
                      </Grid>
                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getData(true)}
                          // onClick={() => getBusinessUnit(true)}
                          >
                          Submit
                        </MDButton>
                      </Grid>
                    </Grid> 
                    {selectedAction.value ==='INSERT' && ( <> 
                    <hr style={{ border: 'none', height: '2px', backgroundColor: '#333', margin: '20px 0' }} />
                    <Grid container spacing={2}>
                        {/* Product Group */}
                      <Grid item xs={1.2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Process Chart No
                        </MDTypography>
                        {/* <ReactSelect
                          id="processChartNo"
                          options={ProcessChartList}
                          onChange={handleActionChange}
                          value={selectProcessChartNo || ""}
                        /> */}
                        <MDInput
                          id="processChartNoI"
                          // options={ProcessChartList}
                          onChange={(e) => {setProcessChartNoI(e.target.value)}}
                          value={selectProcessChartNoI || ""}
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
                          Version
                        </MDTypography>
                        <MDInput
                          id="versionI"
                          onChange={(e) => { setVersionI(e.target.value) }}
                          value={selectVersionI || ""}
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
                          Prod Version
                        </MDTypography>
                        <MDInput
                          id="prodVersion"
                          onChange={(e) => { setProdVersion(e.target.value) }}
                          value={selectProdVersion || ""}
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
                          Product Group
                        </MDTypography>
                        <MDInput
                          name="PRD_Grp"
                          value={selectProductGroup}
                          onChange={(e) => setProductGroup(e.target.value)}
                        />
                      </Grid>

                        {/* Product Group Description
                      <Grid item xs={1.6}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Product Group Description
                        </MDTypography>
                        <MDInput
                          name="GRP_DESC"
                          value={selectProductGD || ""}
                          onChange={(e) => setProductGD(e.target.value)}
                        />
                      </Grid> */}

                      {/* Quality Code */}
                      <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Quality Code
                        </MDTypography>

                        <MDInput
                          name="Quality_Code"
                          value={selectQualityCode || ""}
                          onChange={(e) => setQualityCode(e.target.value)}
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
                          Product Category
                        </MDTypography>
                        <MDInput
                        id="productCategory"
                          value={selectProductCategory || ""}
                          onChange={(e) => setProductCategory(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          TDC No
                        </MDTypography>
                        <MDInput
                          name="TDC_No"
                          value={selectTDCNo || ""}
                          onChange={(e) => setTDCNo(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={1.4}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Product Application
                        </MDTypography>

                        <MDInput
                          name="PRD_APPL"
                          value={selectProductApplication || ""}
                          onChange={(e) => setProductApplication(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => InsertProcChartData()}
                        >
                          Insert
                        </MDButton>
                      </Grid> 
                      <Grid items xs={1.5}></Grid> 
                      <Grid item xs={1.5}>
                        <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                        >
                            Grade Description{" "}
                        </MDTypography>
                        <MDInput
                            id="gradeDescription"
                            onChange={(e) => setGradeDescription(e.target.value)}
                            value={selectGradeDescription}
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
                            Remarks{" "}
                        </MDTypography>
                        <MDInput
                            id="remarks"
                          onChange={(e) => setRemarks(e.target.value)}
                            value={selectRemarks}
                        />
                        </Grid>
                    </Grid>
                    </>)} 
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
                          Process Chart Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={6} direction="row" style={{ display: "flex", justifyContent: "flex-end" }}> 
                      <Grid item xs={1} >
                      <Tooltip title="Save" arrow>
                        <IconButton
                          color="white"
                          // disabled={isReadWriteAccess}
                          onClick={() => updateActiveDeactive()}
                        >
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                      </Grid>
                      <Grid item xs={1} >
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelprocessChartTableData()}
                          >
                            <DownloadForOfflineIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
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
                        <div id="processChartTable" />
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {processChartData.length} of{" "}
                          {processChartData.length} entries
                        </p>
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
                          Process Chemistry Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Download Chemistry">
                          <IconButton
                            color="white"
                            // onClick={() => getChemistryData()}
                            onClick={() => downloadExcelChemistryTableData()}
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
                        <div id="processChemistryTable" />
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {processChartData.length} of{" "}
                          {processChartData.length} entries
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
