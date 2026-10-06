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
import ReactMultiSelect from "components/Select/ReactMultiSelect";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import ReactSelect from "components/Select/ReactSelect";
import MonthPicker from "components/DateTime/DatePicker";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FormControl, { useFormControl } from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

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
import MaxWidthDialogCH    from "./Modal/LDCR001ModalCH";
import MaxWidthDialogIP    from "./Modal/LDCR001ModalIP";
import MaxWidthDialogMER   from "./Modal/LDCR001ModalMER";
import MaxWidthDialogUST   from  "./Modal/LDCR001ModalUST";
import MaxWidthDialogUSTB  from "./Modal/LDCR001ModalUSTB";
import MaxWidthDialogVDI   from "./Modal/LDCR001ModalVDI";
import MaxWidthDialogVDIR  from "./Modal/LDCR001ModalVDIR";
import MaxWidthDialogVDIRS  from "./Modal/LDCR001ModalVDIRS";
import MaxWidthDialogMRR   from "./Modal/LDCR001ModalMRR";
import MaxWidthDialogMRRS   from "./Modal/LDCR001ModalMRRS";
import MaxWidthDialogMGER  from "./Modal/LDCR001ModalMGER";
import MaxWidthDialogFRBT  from "./Modal/LDCR001ModalFRBT";
import MaxWidthDialogHRD   from "./Modal/LDCR001ModalHRD";
import MaxWidthDialogHYS   from "./Modal/LDCR001ModalHYS";
import MaxWidthDialogMGN   from "./Modal/LDCR001ModalMGN";
import MaxWidthDialogMRP   from "./Modal/LDCR001ModalMRP";
import MaxWidthDialogMRPWTWT from "./Modal/LDCR001ModalMRPWTWT";
import MaxWidthDialogDROP  from "./Modal/LDCR001ModalDROP";
import MaxWidthDialogMTRR  from "./Modal/LDCR001ModalMTRR";

// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";

export default function LDCR001() {
  const [state, setState] = React.useState({
    checkedA: true,
  });
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [repType, setrepType] = useState([]);
  const [selectedrepType, setSelectrepType] = React.useState([]);

  const [inspector, setinspector] = useState([]);
  const [selectedinspector, setselectedinspector] = React.useState([]);

  const [pipelist, setpipelist] = useState([]);
  const [slitlist, setSlitlist] = useState([]);
  const [selectedpipelist, setselectedpipelist] = React.useState([]);
  const [selectedSlitlist, setselectedSlitlist] = React.useState([]);

  const [customerDesc, setCustomerDesc] = useState([]);
  const [pCat, setProdCat] = useState([]);
  const [selectedPcat, setSelectPcat] = React.useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [selectCustomerDesc, setSelectCustomerDesc] = useState([]);
  const [inventoryData, setInventoryData] = React.useState([]);
  const [inventoryDataTable, setInventoryDataTable] = useState(null);
  const [bUnit, setBunit] = useState([]);

  const [reviewedBy, setReviewedBy] = useState("");
  const [mpiinput, setmpiinput] = useState("");
  

  const [GainA, setGainA] = useState("");
  const [GainM, setGainM] = useState("");

  const [GainATR, setGainATR] = useState("");
  const [GainMTR, setGainMTR] = useState("");

  const [odiaFrmList, setOdiaFrmList] = useState([]);
  const [odiaToList, setOdiaToList] = useState([]);
  const [selectedOdiaFrm, setSelectedOdiaFrm] = useState([]);
  const [selectedOdiaTo, setSelectedOdiaTo] = useState([]);
  const [selectedStockType, setSelectedStockType] = useState([]);

  const [orderNo, setOrderNo] = useState("");
  const [item, setitem] = useState("");
  const [matno, setmatno] = useState("");
  const [crdate, setcrdate] = useState("");
  const [heatno, setheatno] = useState("");
  const [pipeno, setpipeno] = useState("");
  const [rmno, setrmno] = useState("");
  const [pipeValue, setpipeValue] = useState([]);
  const [pipeData, setpipeData] = useState([]);



  const handlerepTypeChange = (value) => {

    setSelectedSpecimen(null);
    setselectedtestmethod(null);
    setSampleOrientation(null);
    setselectedmutverification(null);
    setselectedshift(null);

    setmpiinput("");
    setGainA("");
    setGainM("");

    setGainATR("");
    setGainMTR("");

    setysyl("0.5% EUL");
    setValueRadio("1");
    setPrintoptionTWT("With");
    setSelectrepType(value);
    setOrderNo("");
    setitem("");
    setcrdate("");
    setmatno("");
    setheatno("");
    // setReviewedBy("");
    setpipeno("");
    setpipeValue({
      from: []
    });
    setValueRadiohrd("ASTM E92 Latest Edition");
    setprintoption("R");
  };

  const handleinspectorchange = (value) => {
    setselectedinspector(value);
  };

  const handleOrderNoChange = (e) => {
    setOrderNo(e.target.value);
    setpipeValue({
      from: []
    });
  };

  const handleitemChange = (e) => {
    setitem(e.target.value);
    setpipeValue({
      from: []
    });
  };

  const handlematnoChange = (e) => {
    setmatno(e.target.value);
  };

  const handlecrdateChange = (e) => {
    setcrdate(e.target.value);
    setpipeValue({
      from: []
    });
  };

  const handleheatnoChange = (e) => {
    setheatno(e.target.value);
  };

  const handlepipenoChange = (e) => {
    setpipeno(e.target.value);
  };

    const handlermnoChange = (e) => {
      setrmno(e.target.value);
  };




  //const [selectedStockType, setSelectStockType] = React.useState({ label: "RM", value: "1" });

  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const defaultHrForm = {
    runit: "P",
    ctype: "",
    rcode: "",
  };

  const [filter, setFilter] = useState(defaultHrForm);
  const [getCustomerTable, setCustomerTable] = React.useState([]);
  const [valueRadio, setValueRadio] = React.useState("1");
  const [valueRadiohrd, setValueRadiohrd] = React.useState("ASTM E92 Latest Edition");
  const [valueRadioaut, setvalueRadioaut] = React.useState("GE");

  const [RESULT, setRESULT] = useState([]);
  const [printoption, setprintoption] = React.useState("R");

  const [creationdt, setcreationdt] = useState(null);
  const [despFrmDt, setDespFrmDt] = useState(null);
  const [despToDt, setDespToDt] = useState(null);

  var customerTable = React.createRef();
  const [allValues, setAllValues] = useState({
    process: "",
    batch: "",
    mbatch: "",
    order: "",
    item: "",
    materialNo: "",
    status: "",
    thikFrm: "",
    thikTo: "",
    // widthFrm: "",
    // widthTo: "",
  });

  const [allValuesMerg, setAllValuesMerg] = useState({
    batchMerg: "",
    mergedBatchMerg: "",
  });

  const [allValuesRev, setAllValuesRev] = useState({
    batchId: "",
    mergeBatch: "",
  });

  const [selectedPlantMerg, setSelectedPlantMerg] = useState([]);
  const [selectedMergedTypeMerg, setSelectedMergedTypeMerg] = useState({
    label: "COIL",
    value: "B",
  });
  const [fromDtMerg, setFromDtMerg] = useState(null);
  const [toDtMerg, setToDtMerg] = useState(null);
  const [mergedInvData, setMergedInvData] = useState([]);
  const [mergedInvTableData, setMergedInvTableData] = useState(null);

  const [reversedInfoData, setreversedInfoData] = useState([]);
  const [reversedInfoTableData, setReversedInfoTableData] = useState(null);

  const [selectedSampleOrientation, setSampleOrientation] = useState(null);
  const SampleOrientation = [
    { label: "Longitudinal", value: "1" },
    { label: "Transverse", value: "2" },
  ];

  const [selectedmutverification, setselectedmutverification] = useState(null);
  const mutverification = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
    { label: "NA", value: "NA" },
  ];

  const [selectedshift, setselectedshift] = useState(null);
  const shiftList = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" }
  ];

  const [selectedtestmethod, setselectedtestmethod] = useState(null);
  const testmethod = [
    { label: "ASTM A 370 Latest Edition", value: "1" },
    { label: "ASTM A 23 Latest Edition", value: "2" },
    { label: "ISO 148 Pt-1 Latest Edition", value: "3" },
  ];

  const [selectedSpecimen, setSelectedSpecimen] = useState(null);
  const Specimen = [
    { label: "10 X 10 X 55", value: "1" },
    { label: "10 X 7.5 X 55", value: "2" },
    { label: "10 X 6.7 X 55", value: "3" },
    { label: "10 X 5 X 55",   value: "4" },
  ];





  const handleChangeMerg = (e) => {
    if (e.target.name == "batchMerg" && e.target.value?.length > 10) {
      alertify.error("Batch Size can not be greater than 10");
    } else if (
      e.target.name == "mergedBatchMerg" &&
      e.target.value?.length > 10
    ) {
      alertify.error("Merged Batch Size can not be greater than 10");
    } else {
      setAllValuesMerg({ ...allValuesMerg, [e.target.name]: e.target?.value });
    }
  };

  const handleChangeRev = (e) => {
    setAllValuesRev({ ...allValuesRev, [e.target.name]: e.target?.value });
  };

  const toInputUppercase = (e) => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const handleReviewedByChange = (e) => {
    setReviewedBy(e.target.value);
  };


  const handlempiinputChange = (e) => {
    setmpiinput(e.target.value);
  };

  const handleGainA = (e) => {
    setGainA(e.target.value);
  };

  const handleGainATR = (e) => {
    setGainATR(e.target.value);
  };

  const handleGainM = (e) => {
    setGainM(e.target.value);
  };

  const handleGainMTR = (e) => {
    setGainMTR(e.target.value);
  };

  const mergedTypeList = [
    { label: "ALL", value: "ALL" },
    { label: "COIL", value: "B" },
    { label: "SFG", value: "S" },
    { label: "FG", value: "F" },
  ];

  const StockType = [
    { label: "RM", value: "RM" },
    { label: "WIP", value: "WIP" },
    { label: "SCRAP", value: "SCRAP" },
    { label: "FG", value: "FG" },
  ];//

  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [printoptionTWT, setPrintoptionTWT] = React.useState("With");
  const [ysyl, setysyl] = React.useState("0.5% EUL");



  const handleOpenModal = () => {
    if  (selectedrepType.value === null || selectedrepType.value === undefined) {
      alertify.error("Please choose a Report Type");
    }

    if (serverDetails.PersonalNo !== '436077') {
    if (!orderNo ) {
      alertify.error("Please select Order No");
      return;
    }

    if ( !item) {
      alertify.error("Please select  Item");
      return;
    }

    if ( !crdate) {
      alertify.error("Please select  Date");
      return;
    }

    if ( !reviewedBy) {
      alertify.error("Please Fill Revieved By");
      return;
    }
  };


    console.log('selectedrepType.value TEST PRD :',selectedrepType.value);
    if (selectedrepType.value === '18' && printoption === "S") {
      setModalType('VDIRS');
    } else if  (selectedrepType.value === '1') {
      setModalType('IP');
    } else if (selectedrepType.value === '2') {
      // setModalType('MRP');
      setModalType(printoptionTWT === "With" ? 'MRP' : 'MRPWTWT');
    } else if (selectedrepType.value === '2' && printoptionTWT !== "S" ) {
      setModalType('MRPWTWT');
    } else if (selectedrepType.value === '3') {
      setModalType('MTRR');
    } else if (selectedrepType.value === '4') {
      setModalType('IP');
    } else if (selectedrepType.value === '5') {
      setModalType('DROP');
    } else if (selectedrepType.value === '6') {
      setModalType('MGER');
    } else if (selectedrepType.value === '7') {
      setModalType('HRD');
    } else if (selectedrepType.value === '8') {
      setModalType('CH');
    } else if (selectedrepType.value === '9' && printoption !== "S") {
      setModalType('MRR');
    } else if (selectedrepType.value === '9' && printoption === "S") {
      setModalType('MRRS');
    } else if (selectedrepType.value === '10') {
      setModalType('FRBT');
    } else if (selectedrepType.value === '11') {
      setModalType('HYS');
    }else if (selectedrepType.value === '12') {
      setModalType('MGN');
    } else if (selectedrepType.value === '13') {
      setModalType('USTB');
    } else if (selectedrepType.value === '14') {
      setModalType('UST');
    } else if (selectedrepType.value === '17') {
      setModalType('VDI');
    } else if (selectedrepType.value === '18' && printoption !== "S") {
      setModalType('VDIR');
    } 
    // else if (selectedrepType.value === '19') {
    //    setModalType('VDIRS');
    // } else if (selectedrepType.value === '20') {
    //  setModalType('MRRS');
    // }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  const handlePrintOptionTWTChange = (event) => {
    setPrintoptionTWT(event.target.value);
  };
  

  const handleysylChange = (event) => {
    setysyl(event.target.value);
  };

  //page load
  useEffect(() => {
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      setLoading(true);
      GetAuthorization().then((token) => {
        validateUser(token);
        //page load functions here
        Promise.all([
          getGroupPlantId(token.accessToken),
          getProdCat(token.accessToken),
          GetreportTyp(token.accessToken),
          getinspectorlist(token.accessToken),
          // GetPipenomill(token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (crdate || orderNo || item) {
      GetAuthorization().then(token => {
        GetPipenomill(token.accessToken);
        GetPipenomulti(token.accessToken);
      });
    }
  }, [crdate, orderNo, item]);

  useEffect(() => {
    if (selectedrepType.value) {
      GetAuthorization().then((token) => {
        getinspectorlist(token.accessToken);
      });
    }
  }, [selectedrepType]);

  useEffect(() => {
    if (inventoryData && inventoryData.length > 0) {
      setInventoryDataTable(
        new Tabulator("#inventoryTable", {
          data: inventoryData,
          columns: inventoryInfoColumn,
          height: 400,
          layout: "fitDataFill",
          pagination: "local",
          paginationSize: 10,
        //   paginationSizeSelector: [10, 20, 40, 60],
        })
      );
    }
  }, [inventoryData]);

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
      var pageName = "LDCR001";

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

            //page_load plant setup for ground inventory
            setSelectedPlant(items[0]);
            Promise.all([
              GetreportTyp(items[0], accessToken),
              // GetPipenomill(items[0], accessToken),
            ]).finally(() => {
              resolve();
            });

            //page_load plant setup for merged inventory
            setSelectedPlantMerg(items[0]);
          }
        })
        .catch((f) => {
          resolve();
        });
    });
  };

  const getBusinessCd = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM007/getBUnitCd";
      let data = {
        plant: value?.value,
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
        .finally((f) => {
          resolve();
        });
    });
  };

  const getCustDesc = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM007/GetCustDesc";
      let data = {
        plant: value?.value,
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

  const GetreportTyp = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDCR001/GetreportTyp";
      let data = {
        plant: value?.value,
        
      };
      console.log('plant',plant);
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
            setrepType(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };


  const getinspectorlist = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDCR001/getinspectorlist";
      let processvalue = ''; 

      if (selectedrepType.value === '12' ) {
        processvalue = '40';
      } else if (selectedrepType.value === '13' ) {
        processvalue = '60';
      }
     else if (selectedrepType.value === '14' ) {
      processvalue = '50';
    }

      let data = {
        process: processvalue,
      };
      console.log('process', data);
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          console.log(response.data)
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);//
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[0]; 
              obj.value = row[0];
              items.push(obj);
            });
            setinspector(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const GetPipenomill = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
  
      var url = "api/LDCR001/GetPipenomillround";
      let roundsectionmillValue = ""; // Initialize with an empty string or null if no default is desired
  
      // Apply the conditional logic for roundsectionmill
      if (selectedrepType.value === '9' && printoption !== "S") {
        roundsectionmillValue = '1';
      } else if (selectedrepType.value === '9' && printoption === "S") {
        roundsectionmillValue = '2';
      }
  
      let data = {
        plant: '0780',
        crdate: crdate
          ? crdate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).replace(/ /g, "-").replace("Sept", "Sep")
          : "",
        item: item,
        orderNo: orderNo,
        roundsectionmill: roundsectionmillValue // Add the new parameter here
      };
  
      axiosAPI.post(url, data, defaultOptions)
        .then(response => {
          // Handling response here
          var items = [];
          response.data.map(row => {
            var obj = new Object();
            obj.label = row[0]; // Convert as necessary
            obj.value = row[0]; // Convert as necessary
            items.push(obj);
          });
          setpipelist(items); // Assuming we need to set this state
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const getSlitnomill = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
  
      var url = "api/LDCR001/GetSlitnomill";
      let roundsectionmillValue = ""; // Initialize with an empty string or null if no default is desired
  
      // Apply the conditional logic for roundsectionmill
      if (selectedrepType.value === '9' && printoption !== "S") {
        roundsectionmillValue = '1';
      } else if (selectedrepType.value === '9' && printoption === "S") {
        roundsectionmillValue = '2';
      }
  
      let data = {
        plant: '0780',
        crdate: crdate
          ? crdate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).replace(/ /g, "-").replace("Sept", "Sep")
          : "",
        item: item,
        orderNo: orderNo,
        rm: value,
        roundsectionmill: roundsectionmillValue // Add the new parameter here
      };
  
      axiosAPI.post(url, data, defaultOptions)
        .then(response => {
          // Handling response here
          var items = [];
          response.data.map(row => {
            var obj = new Object();
            obj.label = row[0]; // Convert as necessary
            obj.value = row[0]; // Convert as necessary
            items.push(obj);
          });
          setSlitlist(items); // Assuming we need to set this state
        })
        .finally(() => {
          resolve();
        });
    });
  };
  

  const GetPipenomulti = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDCR001/GetPipenomulti";
      let roundsectionmillValue = ""; // Initialize with an empty string or null if no default is desired

      // Apply the conditional logic for roundsectionmill
      if (selectedrepType.value === '12') {
        roundsectionmillValue = '4';
      }
      else if (selectedrepType.value === '13') {
        roundsectionmillValue = '6';
      }
      else if (selectedrepType.value === '14') {
        roundsectionmillValue = '5';
      }
      else if (selectedrepType.value === '11') {
        roundsectionmillValue = '3';
      }
      else if (selectedrepType.value === '18' && printoption !== "S") {
        roundsectionmillValue = '7';
      }
      else if (selectedrepType.value === '18' && printoption === "S") {
        roundsectionmillValue = '8';
      }

      let data = {
        plant: '0780',
        crdate: crdate
          ? crdate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).replace(/ /g, "-").replace("Sept", "Sep")
          : "",
        item: item,
        orderNo: orderNo,
        roundsectionmill: roundsectionmillValue // Add the new parameter here
      };

      axiosAPI.post(url, data, defaultOptions)
        .then(response => {
   
          let varData1 = [];
          response.data?.map((x) => 
            x ? varData1.push(x) : null
          );
          setpipeData(varData1);
        })
        .finally(() => {
          resolve();
        });
    });
  };


  const getProdCat = (accessToken) => {
    return new Promise((resolve) => {
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
        .finally((f) => {
          resolve();
        });
    });
  };

  const handlePlantChange = (value) => {
    //clear prefilled data
    setSelectCustomerDesc([]);
    setSelectrepType([]);
    setselectedinspector([]);
    setselectedpipelist([]);
    setAllValues({});
    setProdFrmDt(null);
    setProdToDt(null);
    setDespFrmDt(null);
    setDespToDt(null);
    setpipeValue({
      from: []
    });
    setpipeData([]);

    setSelectedOdiaFrm([]);
    setSelectedOdiaTo([]);
    setSelectedStockType([]);

    setInventoryDataTable(null);
    setInventoryData([,]);
    //clear filter end

    setSelectedPlant(value);
    //     alert( setSelectedPlant(value));
    if (value) {
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([
          // getCustDesc(value, token.accessToken),
          // getOrdTyp(value, token.accessToken),
          // getBusinessCd(value, token.accessToken),
          // getOdiaFrm(value, token.accessToken),
          // getOdiaTo(value, token.accessToken),
          GetreportTyp(value, token.accessToken),
          // GetPipenomill(value, token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const getOdiaFrm = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM003/odiafrm";
      let data = {
        plant: value?.value,
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
              obj.label = row.toFixed(3);
              obj.value = row.toFixed(3);
              items.push(obj);
            });
            setOdiaFrmList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getOdiaTo = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM003/odiato";
      let data = {
        plant: value?.value,
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
              obj.label = row.toFixed(3);
              obj.value = row.toFixed(3);
              items.push(obj);
            });
            setOdiaToList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handleCustomerChange = (value) => {
    setSelectCustomerDesc(value);
  };



  const handlepipelistChange = (value) => {
    setselectedpipelist(value);
    GetAuthorization().then((token) => {
      Promise.all([
        // getCustDesc(value, token.accessToken),
        // getOrdTyp(value, token.accessToken),
        // getBusinessCd(value, token.accessToken),
        // getOdiaFrm(value, token.accessToken),
        // getOdiaTo(value, token.accessToken),
        getSlitnomill(value?.value, token.accessToken),
        // GetPipenomill(value, token.accessToken),
      ]).finally(() => {
        setLoading(false);
      });
    })
  };
  const handleSlitlistChange = (value) => {
    setselectedSlitlist(value);
  };

  const handlePCatChange = (value) => {
    setSelectPcat(value);
  };

  //get date helper
  const getProdFromDate = () => {
    var dt = document.getElementById("OrddtFrDate")?.value;
    return dt;
  };

  const getProdToDate = () => {
    var dt = document.getElementById("OrddtToDate")?.value;
    return dt;
  };

  const getDespFromDate = () => {
    var dt = document.getElementById("DespFrDate")?.value;
    return dt;
  };

  const getDespToDate = () => {
    var dt = document.getElementById("DespToDate")?.value;
    return dt;
  };

  const getData = () => {
    //If Session(CommonConstants.SPC_BUS_UNIT) = "TUBES" Or Session(CommonConstants.SPC_BUS_UNIT) = "LP" Then

    if (selectedPlant?.value === undefined) {
      alertify.error("Please select Plant");
      return;
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url;
      var data = {
        plant: selectedPlant?.value,
        // orderType: selectedOrderType?.label,
        customer: selectCustomerDesc?.value,
        widthFrm: selectedOdiaFrm?.value ? selectedOdiaFrm.value : "",
        widthTo: selectedOdiaTo?.value ? selectedOdiaTo.value : "",

        ProdFromDate: prodFrmDt
          ? prodFrmDt
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/ /g, "-")
              .replace("Sept", "Sep")
          : "",
        ProdToDate: prodToDt
          ? prodToDt
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/ /g, "-")
              .replace("Sept", "Sep")
          : "",
        DespFromDate: despFrmDt
          ? despFrmDt
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/ /g, "-")
              .replace("Sept", "Sep")
          : "",
        DespToDate: despToDt
          ? despToDt
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/ /g, "-")
              .replace("Sept", "Sep")
          : "",
        stockType: selectedStockType?.value ? selectedStockType.value : "",
      };

      data = { ...data, ...allValues };

      if (bUnit.label === "TUBES") {
        url = "api/LDCR001/getInventoryData";
      }

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            // setInventoryData(response.data);
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setInventoryData([,]);
            } else {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];

                rows.push({
                  CREATION_DATE: rowdata.CREATION_DATE,
                  PLANT: rowdata.PLANT,
                  STORAGE_LOC: rowdata.STORAGE_LOC,
                  CURRENT_WORK_CENTER: rowdata.CURRENT_WORK_CENTER,
                  PLANNED_WORK_CENTER: rowdata.PLANNED_WORK_CENTER,
                  NEXT_WORK_CENTER: rowdata.NEXT_WORK_CENTER,
                  PLANNED_CUST_NAME: rowdata.PLANNED_CUST_NAME,
                  BATCH_ID: rowdata.BATCH_ID,
                  THICK: rowdata.THICK,
                  WIDTH: rowdata.WIDTH,
                  IDIA: rowdata.IDIA,
                  LENGTH: rowdata.LENGTH,
                  NET_WT: rowdata.NET_WT,
                  CUST_ORDER: rowdata.CUST_ORDER,
                  CUST_ITEM: rowdata.CUST_ITEM,
                  ENC_ORDER_TYPE: rowdata.ENC_ORDER_TYPE,
                  ROLLING_LENGTH: rowdata.ROLLING_LENGTH,
                  NA: rowdata.NA,
                  SO_THICK: rowdata.SO_THICK,
                  SO_ODIA: rowdata.SO_ODIA,
                  SO_IDIA: rowdata.SO_IDIA,
                  SO_LENGTH: rowdata.SO_LENGTH,
                  SO_OD_TOL: rowdata.SO_OD_TOL,
                  SO_THICK_TOL: rowdata.SO_THICK_TOL,
                  SO_LENGTH_TOL: rowdata.SO_LENGTH_TOL,
                  SO_GRADE: rowdata.SO_GRADE,
                  ACTUAL_TDC: rowdata.ACTUAL_TDC,
                  PROD_CD: rowdata.PROD_CD,
                  QLTY: rowdata.QLTY,
                  PLANNED_ROUTE: rowdata.PLANNED_ROUTE,
                  SURFASE_SIZE: rowdata.SURFASE_SIZE,
                  SO_FINISH: rowdata.SO_FINISH,
                  FG_MATERIAL_NO: rowdata.FG_MATERIAL_NO,
                  FG_MATERIAL_DESC: rowdata.FG_MATERIAL_DESC,
                  PLANNED_STAGE_REMARK: rowdata.PLANNED_STAGE_REMARK,
                  PLANNED_HEADER_REMARK: rowdata.PLANNED_HEADER_REMARK,
                  UNRESTRICTED_STOCK: rowdata.UNRESTRICTED_STOCK,
                  GROSS_WT: rowdata.GROSS_WT,
                  MATERIAL_DESC: rowdata.MATERIAL_DESC,
                  STOCK_IN_QINSP: rowdata.STOCK_IN_QINSP,
                  BLOCKED_STOCK: rowdata.BLOCKED_STOCK,
                  BATCH_AGE: rowdata.BATCH_AGE,
                  STOCK_IN_TRANSIT: rowdata.STOCK_IN_TRANSIT,
                  MATERIAL_GROUP: rowdata.MATERIAL_GROUP,
                  MATERIAL_TYPE: rowdata.MATERIAL_TYPE,
                  SOURCE: rowdata.SOURCE,
                  CAST_NO: rowdata.CAST_NO,
                  DIVISON: rowdata.DIVISON,
                  HSN_CODE: rowdata.HSN_CODE,
                  PLAN_QUANTITY: rowdata.PLAN_QUANTITY,
                  NO_OF_PIECES: rowdata.NO_OF_PIECES,
                  PHYSICAL_LOC: rowdata.PHYSICAL_LOC,
                  UOM: rowdata.UOM,
                  PREV_PROC: rowdata.PREV_PROC,
                  CURR_PROC: rowdata.CURR_PROC,
                  NEXT_PROC: rowdata.NEXT_PROC,
                  STATUS: rowdata.STATUS,
                  PARENT_BATCH: rowdata.PARENT_BATCH,
                  MOTHER_BATCH: rowdata.MOTHER_BATCH,
                  MOTHER_BATCH_AGE: rowdata.MOTHER_BATCH_AGE,
                  MOTHER_BATCH_WT: rowdata.MOTHER_BATCH_WT,
                  RM_MATRL_NO: rowdata.RM_MATRL_NO,
                  RM_MATERIAL_DESC: rowdata.RM_MATERIAL_DESC,
                  ACTUAL_ROUTE: rowdata.ACTUAL_ROUTE,
                  PLANT_NM: rowdata.PLANT_NM,
                  SCRAP_WT: rowdata.SCRAP_WT,
                  MERGED_BATCH: rowdata.MERGED_BATCH,
                  PROD_STRT_TM: rowdata.PROD_STRT_TM,
                  PROD_END_TM: rowdata.PROD_END_TM,
                  PROCESSING_FLAG: rowdata.PROCESSING_FLAG,
                  STATUS_DESC: rowdata.STATUS_DESC,
                  LOM_SCRAP_REMARKS: rowdata.LOM_SCRAP_REMARKS,
                  FG_MAT_NO: rowdata.FG_MAT_NO,
                  FG_MAT_DESC: rowdata.FG_MAT_DESC,
                });
              }

              setInventoryData(rows);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const handleChangeSwitch = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleOdiaFrmChange = (e) => {
    setSelectedOdiaFrm(e);
  };

  const handleOdiaToChange = (e) => {
    setSelectedOdiaTo(e);
  };

  const handleStockTypeChange = (e) => {
    setSelectedStockType(e);
    setInventoryDataTable(null);
    setInventoryData([,]);
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

  const inventoryInfoColumn = [
    {
      title: "Creation Date",
      field: "CREATION_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Batch",
      field: "BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
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
    },

    //{ title: "Plant", field: "PLANT", headerFilter: "input", headerFilterPlaceholder: "search...", frozen: true, },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status Desc",
      field: "STATUS_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt",
      field: "NET_WT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 120,
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
      title: "UOM",
      field: "UOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thickness",
      field: "THICK",
      headerFilter: "input",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "Width/OD",
      field: "WIDTH",
      headerFilter: "input",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "Length",
      field: "LENGTH",
      headerFilter: "input",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "Grade/TDC",
      field: "ACTUAL_TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qcode",
      field: "QLTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Customer Name",
      field: "PLANNED_CUST_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Idia",
      field: "IDIA",
      headerFilter: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Planned Route",
      field: "PLANNED_ROUTE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Actual Route",
      field: "ACTUAL_ROUTE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prev Proc ",
      field: "PREV_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cur Proc",
      field: "CURR_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Nxt Proc",
      field: "NEXT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order NO",
      field: "CUST_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Item",
      field: "CUST_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Type",
      field: "ENC_ORDER_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No(FG)",
      field: "FG_MATERIAL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Desc(FG)",
      field: "FG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "No of Pipe",
      field: "NO_OF_PIECES",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ord Thickness",
      field: "SO_THICK",
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
      title: "Ord Odia",
      field: "SO_ODIA",
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
      title: "Ord Idia",
      field: "SO_IDIA",
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
      title: "Ord Length",
      field: "SO_LENGTH",
      headerFilter: "input",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Pcode",
      field: "PROD_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch Age(Days)",
      field: "BATCH_AGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          // return value;
          //  return parseFloat(value).toFixed(3);
        }
        if (value >= 0 && value <= 30) {
          cell.getElement().style["background-color"] = "#04FF00";
          cell.getElement().style["color"] = "black";
        } else if (value > 30 && value <= 60) {
          cell.getElement().style["background-color"] = "#FFFF00";
          cell.getElement().style["color"] = "black";
        } else if (value > 61 && value <= 90) {
          cell.getElement().style["background-color"] = "#FFA500";
          cell.getElement().style["color"] = "black";
        } else if (value > 60) {
          cell.getElement().style["background-color"] = "#FF0000";
          cell.getElement().style["color"] = "black";
        }
        return parseFloat(value).toFixed(0);
      },
    },
    {
      title: "Material Group",
      field: "MATERIAL_GROUP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Cast Number",
      field: "CAST_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod Date",
      field: "CREATION_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mother Batch Age(Days)",
      field: "MOTHER_BATCH_AGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mother Batch Wt(Ton)",
      field: "MOTHER_BATCH_WT",
      headerFilter: "input",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM material no",
      field: "RM_MATRL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Material Desc",
      field: "RM_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Merge Batch",
      field: "MERGED_BATCH",
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
      title: "Batch Stor Loc",
      field: "STORAGE_LOC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status Age(Days)",
      field: "STATUSAGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Plant",
      field: "PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant NM",
      field: "PLANT_NM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Remarks",
      field: "LOM_SCRAP_REMARKS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const handlePlantChangeMerg = (e) => {
    //handle clear all
    setAllValuesMerg({});
    setFromDtMerg(null);
    setToDtMerg(null);
    setSelectedMergedTypeMerg([]);
    setMergedInvData([,]);
    setMergedInvTableData(null);
    //end handle clear all
    setSelectedPlantMerg(e);
  };

  const handleMergedTypeChangeMerg = (e) => {
    setSelectedMergedTypeMerg(e);
  };

  const getMergedInventory = async (newToken = false) => {
    //If Session(CommonConstants.SPC_BUS_UNIT) = "TUBES" Or Session(CommonConstants.SPC_BUS_UNIT) = "LP" Then

    if (selectedPlantMerg?.value === undefined) {
      alertify.error("Please select Plant");
      return;
    }

    var fromDt = fromDtMerg
      ? fromDtMerg
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-")
          .replace("Sept", "Sep")
      : "";

    var toDt = toDtMerg
      ? toDtMerg
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-")
          .replace("Sept", "Sep")
      : "";

    if (fromDt > toDt) {
      alertify.error("From Date should be less than To Date");
      return;
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url;
      var data = {
        plant: selectedPlantMerg?.value,
        mergedType: selectedMergedTypeMerg?.value,
        fromDt: fromDt,
        toDt: toDt,
      };

      data = { ...data, ...allValuesMerg };

      // if (bUnit.label === "TUBES") {
      url = "api/LDCR001/mergedinv";
      // }

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setMergedInvData([,]);
            } else {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];

                rows.push({
                  rowId: i,
                  FG_MATERIAL_DESC: rowdata.FG_MATERIAL_DESC,
                  FG_MATERIAL_NO: rowdata.FG_MATERIAL_NO,
                  MERGED_BATCH: rowdata.MERGED_BATCH,
                  MERGED_BATCH_QTY: rowdata.MERGED_BATCH_QTY,
                  MERGED_BY_USER: rowdata.MERGED_BY_USER,
                  MERGE_DT: rowdata.MERGE_DT,
                  PLANT: rowdata.PLANT,
                  SLIT_COIL: rowdata.SLIT_COIL,
                  SLIT_COIL_QTY: rowdata.SLIT_COIL_QTY,
                  MERGED_TYPE: rowdata.MERGED_TYPE,
                });
              }
              setMergedInvData(rows);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getReversedBatchInformation = async () => {
    if (selectedPlantMerg?.value === undefined) {
      alertify.error("Please select Plant");
      return;
    }

    // if (allValuesRev?.batchId == "" || allValuesRev?.mergeBatch == "") {
    //   alertify.error("Please select batch Or Mother Batch");
    //   return;
    // }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var data = {
        plant: selectedPlantMerg?.value,
        batchId: allValuesRev.batchId,
        mergeBatch: allValuesRev.mergeBatch,
      };

      var url = "api/LDCR001/getReversedBatchInfo";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setreversedInfoData([,]);
            } else {
              setreversedInfoData(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };
  const pdfdata = () => {
    alertify.error("Hello");
  }

//   const printpdfdata = () => {
//     const input = document.getElementById('inventoryTable');
//     if (!input) {
//       alertify.error("No data available to download");
//       return;
//     }

//     html2canvas(input).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF();
//       const imgWidth = 210; // A4 width in mm
//       const pageHeight = 297; // A4 height in mm
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save('table-data.pdf');
//     });
//   };

  // const downloadExcelcustomerTableData = () => {
  //   // var table = customerTable.table;
  //   // let date = new Date();
  //   // table.download(
  //   //     "xlsx",
  //   //     "customerTable" + date.toString() + ".xlsx",
  //   //     { sheetName: "MyData" }
  //   // );

  //   if (inventoryDataTable == null) {
  //     alertify.error("No Data exists in table for Downloading");
  //     return;
  //   }

  //   var len = inventoryDataTable.getData();
  //   if (len == 0) {
  //     alertify.error("No Data exists in table for Downloading");
  //     return;
  //   }

  //   var date = new Date();
  //   var fileName = "LDCR001_GroundInventory " + ".xlsx";
  //   inventoryDataTable.download("xlsx", fileName, {
  //     sheetName: "Sheet1",
  //   });
  // };

  // const downloadExcelMergedInv = () => {
  //   if (mergedInvTableData == null) {
  //     alertify.error("No Data exists in table for Downloading");
  //     return;
  //   }

  //   var len = mergedInvTableData.getData();
  //   if (len == 0) {
  //     alertify.error("No Data exists in table for Downloading");
  //     return;
  //   }

  //   var date = new Date();
  //   var fileName = "LDCR001_MergedInventory " + date.toString() + ".xlsx";
  //   mergedInvTableData.download("xlsx", fileName, {
  //     sheetName: "Sheet1",
  //   });
  // };

  // const downloadExcelReversedInfo = () => {
  //   if (reversedInfoTableData == null) {
  //     alertify.error("No Data exists in table for Downloading");
  //     return;
  //   }

  //   var len = reversedInfoTableData.getData();
  //   if (len == 0) {
  //     alertify.error("No Data exists in table for Downloading");
  //     return;
  //   }

  //   var date = new Date();
  //   var fileName = "LDCR001_ReversedInfo " + date.toString() + ".xlsx";
  //   reversedInfoTableData.download("xlsx", fileName, {
  //     sheetName: "Sheet1",
  //   });
  // };

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
    // setPipeCreationTableData([]);
    if (event.target.value === "2") ;
    // selectedEndFacingTable([]);
  };

  const handleRadioautChange = (event) => {
    setvalueRadioaut(event.target.value);
    // setPipeCreationTableData([]);
    // if (event.target.value === "2") ;
    // selectedEndFacingTable([]);
  };

  const handleRadioChangehrd = (event) => {
    setValueRadiohrd(event.target.value);
    // setPipeCreationTableData([]);
    if (event.target.value === "2") ;
    // selectedEndFacingTable([]);
  };

  // handleprintoptionchange

  const handleprintoptionchange = (event) => {
    setprintoption(event.target.value);
    setpipeValue({
      from: [],
    });
    setpipeValue([]);
    // setPipeCreationTableData([]);
    if (event.target.value === "S");
    // selectedEndFacingTable([]);
  };

  const handleClearAll = () => {
    setSelectCustomerDesc([]);
    // setSelectedPlant([]);
    setSelectrepType([]);
    setselectedinspector([]);
    setselectedpipelist([]);
    setAllValues({});
    setProdFrmDt(null);
    setProdToDt(null);
    setDespFrmDt(null);
    setDespToDt(null);
    setpipeValue({
      from: [],
    });
    setpipeData([]);

    setSelectedOdiaFrm([]);
    setSelectedOdiaTo([]);

    setInventoryDataTable(null);
    setInventoryData([,]);
  };

  const handleClearAllMerg = () => {
    setSelectedPlantMerg([]);
    setAllValuesMerg({});
    setFromDtMerg(null);
    setToDtMerg(null);
    setSelectedMergedTypeMerg([]);
    setMergedInvData([,]);
    setMergedInvTableData(null);
  };

  const handleClearAllRev = () => {
    setreversedInfoData([,]);
    setReversedInfoTableData(null);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Compliance" page="Lab Report - Bare" />
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
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
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
                    <Grid container spacing={1.5}>
                      <Grid item xs={1.75} style={{ zIndex: 3 }}>
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

                      <Grid item xs={2.4} style={{ zIndex: 3 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Report Type
                        </MDTypography>
                        <ReactSelect
                          id="plant"
                          options={repType}
                          value={selectedrepType}
                          onChange={handlerepTypeChange}
                        />
                      </Grid>

                      <Grid item xs={1.4} style={{ zIndex: 3 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Order No<span style={{ color: "red" }}>*</span>
                        </MDTypography>
                        <MDInput
                          name="orderNo"
                          iseditable="false"
                          value={orderNo}
                          onChange={handleOrderNoChange}
                          // value={SHIFT}
                        />
                      </Grid>

                      <Grid item xs={.5} style={{ zIndex: 3 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Item<span style={{ color: "red" }}>*</span>
                        </MDTypography>
                        <MDInput
                          name="ItemNo"
                          iseditable="false"
                                                    value={item}
                          onChange={handleitemChange}
                          // value={SHIFT}
                        />
                      </Grid>

                      <Grid item xs={1.4} style={{ zIndex: 3 }}>
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
                        <MDInput
                          name="MaterialNo"
                          iseditable="false"
                                                    value={matno}
                          onChange={handlematnoChange}
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
       Date<span style={{ color: "red" }}>*</span>
     </MDTypography>
     <MonthPicker
       name="crdate"
       value={crdate}
       onChange={(date) => setcrdate(date)}
     />
   </Grid>


                      <Grid item xs={1.5} style={{ zIndex: 3 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Heat No
                        </MDTypography>
                        <MDInput
                          name="HeatNo"
                          iseditable="false"
                                                    value={heatno}
                          onChange={handleheatnoChange}
                          // value={SHIFT}
                        />
                      </Grid>

                      {(selectedrepType.value !== '9' && selectedrepType.value !== '11'
                      && selectedrepType.value !== '12' && selectedrepType.value !== '13'
                      && selectedrepType.value !== '14' && selectedrepType.value !== '18')
                      && (
                      <Grid  item xs={1.75} style={{ zIndex: 2 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Pipe No
                        </MDTypography>
                        <MDInput
                          name="Pipeno"
                          iseditable="false"
                          value={pipeno}
                          onChange={handlepipenoChange}
                          // value={SHIFT}
                        />
                      </Grid>
                      )}

                      {/* <Grid item xs={1} style={{ zIndex: 3 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          RM No
                        </MDTypography>
                        <MDInput
                          name="RMNo"
                          iseditable="false"
                                                    value={rmno}
                          onChange={handlermnoChange}
                          // value={SHIFT}
                        />
                      </Grid> */}

                      {selectedrepType.value === '2' && (
                      <Grid item xs={5}>
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label-Test-Method">
                          Test Method
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label-Test-Method"
                            name="row-radio-buttons-group-Test-Method"
                            value={valueRadio}
                            onChange={handleRadioChange}
                            noWrap
                          >
                            <FormControlLabel
                              value="1"
                              control={<Radio />}
                              label="ASTM A 370 Latest Edition"
                              sx={{
                                '& .MuiTypography-root': {
                                    fontSize: '0.8rem', // Adjust as needed
                                },
                            }}
                            />
                            <FormControlLabel
                              value="2"
                              control={<Radio />}
                              label="IS 1608-1 Latest Edition"
                              sx={{
                                '& .MuiTypography-root': {
                                    fontSize: '0.8rem', // Adjust as needed
                                },
                            }}
                            />
                            <FormControlLabel
                              value="3"
                              control={<Radio />}
                              label="ISO 6892-1 Latest Edition"
                              sx={{
                                '& .MuiTypography-root': {
                                    fontSize: '0.8rem', // Adjust as needed
                                },
                            }}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      )}

{selectedrepType.value === '7' && (
                      <Grid item xs={5.5}>
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label-Test-Method" 
                          >
                          Test Method
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label-Test-Method"
                            name="row-radio-buttons-group-Test-Method"
                            value={valueRadiohrd}
                            onChange={handleRadioChangehrd}
                            noWrap
                          >
                            <FormControlLabel
                              value="ASTM E92 Latest Edition"
                              control={<Radio />}
                              label="ASTM E92 Latest Edition"
                            />
                            <FormControlLabel
                              value="ISO 6507-1 Latest Edition"
                              control={<Radio />}
                              label="ISO 6507-1 Latest Edition"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      )}

                      {selectedrepType.value === '4' && (
                       <Grid item xs={2}>
                         <MDTypography
                           fontWeight="regular"
                           fontSize="small"
                           textTransform="capitalize"
                           variant="h6"
                           color={"dark"}
                           noWrap
                         >
                           Specimen Size
                         </MDTypography>
                         <ReactSelect
                           id="Specimen"
                           options={Specimen}
                           value={selectedSpecimen}
                           onChange={setSelectedSpecimen}
                         />
                       </Grid>
                     )}

{selectedrepType.value === '4' && (
                       <Grid item xs={2}>
                         <MDTypography
                           fontWeight="regular"
                           fontSize="small"
                           textTransform="capitalize"
                           variant="h6"
                           color={"dark"}
                           noWrap
                         >
Sample Orientation
                         </MDTypography>
                         <ReactSelect
                           id="sampleorientation"
                           options={SampleOrientation}
                           value={selectedSampleOrientation}
                           onChange={setSampleOrientation}
                         />
                       </Grid>
                     )}

{selectedrepType.value === '4' && (
                       <Grid item xs={2}>
                         <MDTypography
                           fontWeight="regular"
                           fontSize="small"
                           textTransform="capitalize"
                           variant="h6"
                           color={"dark"}
                           noWrap
                         >
Test Method
                         </MDTypography>
                         <ReactSelect
                           id="testmethod"
                           options={testmethod}
                           value={selectedtestmethod}
                           onChange={setselectedtestmethod}
                         />
                       </Grid>
                     )}

                     {(selectedrepType.value === '9')
                      && (
                        <Grid item xs={1.7} style={{ zIndex: 2 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          RM No
                        </MDTypography>
                        <ReactSelect
                          id="pipeno1"
                          options={pipelist}
                          value={selectedpipelist}
                          onChange={handlepipelistChange}
                        />
                      </Grid>
                      )}
                     {(selectedrepType.value === '9')
                      && (
                        <Grid item xs={3} style={{ zIndex: 2 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Slit No
                        </MDTypography>
                        <ReactSelect
                          id="pipeno1"
                          options={slitlist}
                          value={selectedSlitlist}
                          onChange={handleSlitlistChange}
                        />
                      </Grid>
                      )}







{(selectedrepType.value === '2') && (
                      <Grid item xs={2.75}>
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label-TWT">
                        Tensile Weld Test
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label-TWT"
                        name="row-radio-buttons-group-TWT"
                        value={printoptionTWT}
                        onChange={handlePrintOptionTWTChange}
                      >
                        <FormControlLabel value="With" control={<Radio />} label="With Weld Tensile"  sx={{
                                '& .MuiTypography-root': {
                                    fontSize: '0.8rem', // Adjust as needed
                                },
                            }}/>
                        <FormControlLabel value="Without" control={<Radio />} label="Without Weld Tensile"  sx={{
                                '& .MuiTypography-root': {
                                    fontSize: '0.8rem', // Adjust as needed
                                },
                            }}/>
                        
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  )}

{(selectedrepType.value === '2') && (
                      <Grid item xs={2}>
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label-TWT">
                        YL / YS
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label-TWT"
                        name="row-radio-buttons-group-TWT"
                        value={ysyl}
                        onChange={handleysylChange}
                      >
                        <FormControlLabel value="0.5% EUL" control={<Radio />} label="0.5% EUL" sx={{
                                '& .MuiTypography-root': {
                                    fontSize: '0.8rem', // Adjust as needed
                                },
                            }} />
                        <FormControlLabel value="0.2% PS" control={<Radio />} label="0.2% PS"  sx={{
                                '& .MuiTypography-root': {
                                    fontSize: '0.8rem', // Adjust as needed
                                },
                            }}/>
                        
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  )}

                  


                  


{(selectedrepType.value === '11' || selectedrepType.value === '12' 
|| selectedrepType.value === '13' || selectedrepType.value === '14'||selectedrepType.value === '18')
&& (
<Grid item xs={1.7} style={{ zIndex: 2 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Pipe No Multiple Selection{" "}
                          </MDTypography>
                          <MultipleSelect
                            value={pipeValue.from}
                            setValue={(val) => {
                              // if (getCustomerTable?.length > 0) {
                              //   setCustomerTable([]);
                              // }
                              setpipeValue({ ...pipeValue, from: val });
                            }}
                            data={pipeData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                        )}

{(selectedrepType.value === '9' || selectedrepType.value === '18')
                      && (
                      <Grid item xs={4}>
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label-Printing-Option">
                          Printing Option
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label-Printing-Option"
                            name="row-radio-buttons-group-Printing-Option"
                            value={printoption}
                            onChange={handleprintoptionchange}
                            noWrap
                          >
                            <FormControlLabel
                              value="R"
                              control={<Radio />}
                              label="Round Pipe"
                            />
                            <FormControlLabel
                              value="S"
                              control={<Radio />}
                              label="Section Pipe"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      )}

                      {(selectedrepType.value === '12') && (
                      <Grid item xs={1.5} >
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Observation
                        </MDTypography>
                        <MDInput
                          name="Obrsevation"
                          iseditable="false"
                          onChange = {handlempiinputChange}
                          // value={SHIFT}//
                        />
                      </Grid>
                      )}

                      
{(selectedrepType.value === '14' )&&(
                      <Grid item xs={2.3}>
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label-Test-Method">
                          Equipment Machine
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label-Test-Method"
                            name="row-radio-buttons-group-Test-Method"
                            value={valueRadioaut}
                            onChange={handleRadioautChange}
                            noWrap
                          >
                            <FormControlLabel
                              value="GE"
                              control={<Radio />}
                              label="GE"
                            />
                            <FormControlLabel
                              value="BSEEL"
                              control={<Radio />}
                              label="BSEEL"
                            />
                            <FormControlLabel
                              value="HAZ"
                              control={<Radio />}
                              label="HAZ"
                            />

                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      )}

{( selectedrepType.value === '13')&&(
                      <Grid item xs={2.3}>
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label-Test-Method">
                          Equipment Machine
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label-Test-Method"
                            name="row-radio-buttons-group-Test-Method"
                            value={valueRadioaut}
                            onChange={handleRadioautChange}
                            noWrap
                          >
                            <FormControlLabel
                              value="GE"
                              control={<Radio />}
                              label="GE"
                            />
                            <FormControlLabel
                              value="BSEEL"
                              control={<Radio />}
                              label="BSEEL"
                            />

                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      )}

                      
{(selectedrepType.value === '13' || selectedrepType.value === '14') && (
                      <Grid item xs={1.2} >
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Gain (AUT-Angle Probe)  
                        </MDTypography>
                        <MDInput
                          name="GainA"
                          iseditable="false"
                          onChange = {handleGainA}
                          // value={SHIFT}//
                        />
                      </Grid>
                      
                      )}

{( selectedrepType.value === '14') && (
                      <Grid item xs={1.2} >
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Gain (AUT - TR Probe)  
                        </MDTypography>
                        <MDInput
                          name="GainATR"
                          iseditable="false"
                          onChange = {handleGainATR}
                          // value={SHIFT}//
                        />
                      </Grid>
                      
                      )}

{( selectedrepType.value === '14') && (
                       <Grid item xs={1.3}>
                       <MDTypography
                         fontWeight="regular"
                         fontSize="small"
                         textTransform="capitalize"
                         variant="h6"
                         color={"dark"}
                         noWrap
                       >
                         Result*
                       </MDTypography>
                       <ReactSelect
                         options={[
                          { label: "OK", value: "OK" },
                          { label: "NOT OK", value: "NOT OK" },
                          { label: "HOLD", value: "HOLD" },
                        ]}
                         onChange={(e) => {
                          setRESULT(e);
                           setTableNull();
                         }}
                         value={RESULT}
                       />
                     </Grid>
                      
                      )}

{(selectedrepType.value === '13' || selectedrepType.value === '14') && (
                      <Grid item xs={1.3} >
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Gain (MUT-Angle Probe) 
                        </MDTypography>
                        <MDInput
                          name="GainM"
                          iseditable="false"
                          onChange = {handleGainM}
                          // value={SHIFT}//
                        />
                      </Grid>
                      )}

{( selectedrepType.value === '14') && (
                      <Grid item xs={1.3} >
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Gain (MUT - TR Probe)  
                        </MDTypography>
                        <MDInput
                          name="GainMTR"
                          iseditable="false"
                          onChange = {handleGainMTR}
                          // value={SHIFT}//
                        />
                      </Grid>
                      
                      )}


  {/* {(selectedrepType.value === '13' || selectedrepType.value === '14') && ( */}
  {(selectedrepType.value === '101' || selectedrepType.value === '100') && (
<Grid item xs={2} style={{ zIndex: 3 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Verification by MUT
                        </MDTypography>
                        <ReactSelect
                          id="mutverification"
                          options={mutverification}
                          value={selectedmutverification}
                          onChange={setselectedmutverification}
                        />
                      </Grid>
                      )}


<Grid item xs={1.2} >
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Revieved By<span style={{ color: "red" }}>*</span>  
                        </MDTypography>
                        <MDInput
                          name="RevievedBy"
                          iseditable="false"
                          onChange = {handleReviewedByChange}
                          // value={SHIFT}//
                        />
                      </Grid>

                      {(selectedrepType.value === '13' || selectedrepType.value === '14'
                     || selectedrepType.value === '17' || selectedrepType.value === '18'
                     || selectedrepType.value === '11' || selectedrepType.value === '12'
                     || selectedrepType.value === '9' || selectedrepType.value === '10'
                     ) && (
<Grid item xs={1.1} style={{ zIndex: 2 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Shift
                        </MDTypography>
                        <ReactSelect
                          id="shift"
                          options={shiftList}
                          value={selectedshift}
                          onChange={setselectedshift}
                        />
                      </Grid>
                      )} 

                      {(selectedrepType.value === '12' || selectedrepType.value === '14'
                     || selectedrepType.value === '13' || selectedrepType.value === '14'
                     ) && (
<Grid item xs={1.6} style={{ zIndex: 1 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Inspector
                        </MDTypography>
                        <ReactSelect
                          id="inspector"
                          options={inspector}
                          value={selectedinspector}
                          onChange={handleinspectorchange}
                        />
                      </Grid>
                      )}  

                      <Grid item xs={0.75}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          // onClick={() => getData(true)}
                          onClick={handleOpenModal}
                        >
                          Display
                        </MDButton>
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
                          Lab Report
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Download PDF" arrow>
                          <IconButton
                            color="white"
                            onClick={handleOpenModal}
                          >
                            <PictureAsPdfIcon />
                          </IconButton>
                        </Tooltip>

                        {/* <MaxWidthDialogMRR
        open={isModalOpen}
        close={handleCloseModal}
        type="FG-MD" // or any other type you need
        // inputValues={}
        plant={selectedPlant} // or any other relevant prop
      /> */}

                    
      {modalType === 'CH' && (
        <MaxWidthDialogCH open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio}         orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={pipeno} 
        rmno={rmno} 
        shift= {selectedshift?.label}
        crdate={crdate}/>
        
      )}
      {modalType === 'IP' && (
        <MaxWidthDialogIP open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={selectedtestmethod?.label}   specimen={selectedSpecimen?.label}  SampleOrientation={selectedSampleOrientation?.label}        orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={pipeno} 
        rmno={rmno} 
        shift= {selectedshift?.label}
        crdate={crdate}/>
      )}
      {modalType === 'MRR' && (
        <MaxWidthDialogMRR open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio} ysyl={ysyl}   selectedpipelist={selectedpipelist ? selectedpipelist.value : null} 
        orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={selectedpipelist} 
        rmno={rmno} 
        slitNo={selectedSlitlist}
        shift= {selectedshift?.label}
        crdate={crdate} />
      )}     
            {modalType === 'MRRS' && (
        <MaxWidthDialogMRRS open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio} ysyl={ysyl}   selectedpipelist={selectedpipelist ? selectedpipelist.value : null} 
        orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={selectedpipelist} 
        rmno={rmno} 
        shift= {selectedshift?.label}
        crdate={crdate} />
      )}    
      {modalType === 'UST' && (
        <MaxWidthDialogUST open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  GainA={GainA} GainM={GainM}
        GainATR={GainATR} GainMTR={GainMTR}
        reviewedBy={reviewedBy}   testMethod={valueRadio}         orderNo={orderNo} 
        equipmentmachine = {valueRadioaut}
        inspector = {selectedinspector?.label}
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={pipeValue} 
        rmno={rmno} 
        crdate={crdate} 
        shift= {selectedshift?.label}
        mutverification={selectedmutverification?.label} 
        result={RESULT?.value?.length > 0 ?RESULT.value: ''}
        />
      )} 
      {modalType === 'USTB' && (
        <MaxWidthDialogUSTB open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}   GainA={GainA} GainM={GainM}
        reviewedBy={reviewedBy}   testMethod={valueRadio}orderNo={orderNo} 
        equipmentmachine = {valueRadioaut}
        inspector = {selectedinspector?.label}
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={pipeValue} 
        rmno={rmno} 
        crdate={crdate} 
        shift= {selectedshift?.label}
        mutverification={selectedmutverification?.label} 
        />
      )}
      {modalType === 'VDI' && (
        <MaxWidthDialogVDI open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio}orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={pipeno} 
        rmno={rmno} 
        shift= {selectedshift?.label}
        crdate={crdate} 
        />
      )} 
      {modalType === 'MGER' && (
        <MaxWidthDialogMGER open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio}orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={pipeno} 
        rmno={rmno} 
        shift= {selectedshift?.label}
        crdate={crdate} 
        />
      )} 
      {modalType === 'VDIR' && (
        <MaxWidthDialogVDIR open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio}orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        shift= {selectedshift?.label}
        // pipeno={pipeno} 
        pipeno={pipeValue} 
        rmno={rmno} 
        crdate={crdate} 
        // mutverification={selectedmutverification?.label} 
        />
      )} 
      {modalType === 'VDIRS' && (
        <MaxWidthDialogVDIRS open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio}orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        // pipeno={pipeno} 
        pipeno={pipeValue} 
        shift= {selectedshift?.label}
        rmno={rmno} 
        crdate={crdate} 
        // mutverification={selectedmutverification?.label} 
        />
      )} 
      {modalType === 'DROP' && (
        <MaxWidthDialogDROP open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio}         orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={pipeno} 
        rmno={rmno} 
        shift= {selectedshift?.label}
        crdate={crdate}/>
      )} 
      {modalType === 'FRBT' && (
        <MaxWidthDialogFRBT open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio}orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={pipeno} 
        rmno={rmno} 
        shift= {selectedshift?.label}
        crdate={crdate} 
        />
      )} 
      {modalType === 'HRD' && (
        <MaxWidthDialogHRD open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio}orderNo={orderNo}  testMethodhrd={valueRadiohrd} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={pipeno} 
        rmno={rmno} 
        shift= {selectedshift?.label}
        crdate={crdate} 
        />
      )} 
      {modalType === 'HYS' && (
        <MaxWidthDialogHYS open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio}orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        // pipeno={pipeno} 
        pipeno={pipeValue} 
        rmno={rmno} 
        shift= {selectedshift?.label}
        crdate={crdate} 
        />
      )} 
      {modalType === 'MGN' && (
        <MaxWidthDialogMGN open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio}orderNo={orderNo} mpiinput={mpiinput} 
        item={item} 
        inspector = {selectedinspector?.label}
        matno={matno} 
        heatno={heatno} 
        pipeno={pipeValue} 
        rmno={rmno} 
        shift= {selectedshift?.label}
        crdate={crdate} 
        />
      )} 
      {modalType === 'MRP' && (
        <MaxWidthDialogMRP open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio} ysyl={ysyl}
        orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={pipeno} 
        rmno={rmno} 
        shift= {selectedshift?.label}
        crdate={crdate} 
        />
      )} 
            {modalType === 'MRPWTWT' && (
        <MaxWidthDialogMRPWTWT open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio} ysyl={ysyl}
        orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={pipeno} 
        rmno={rmno} 
        shift= {selectedshift?.label}
        crdate={crdate} 
        />
      )} 
      {modalType === 'MTRR' && (
        <MaxWidthDialogMTRR open={isModalOpen} close={handleCloseModal}  type="FG-MD" plant={selectedPlant}  reviewedBy={reviewedBy}   testMethod={valueRadio}orderNo={orderNo} 
        item={item} 
        matno={matno} 
        heatno={heatno} 
        pipeno={pipeno} 
        rmno={rmno} 
        shift= {selectedshift?.label}
        crdate={crdate} 
        />
      )} 

                        {/* <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelcustomerTableData()}
                          >
                            <DownloadForOfflineIcon />
                          </IconButton>
                        </Tooltip> */}
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
                        <div id="inventoryTable" />
                        <br />
                        {/* <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {inventoryData.length} of{" "}
                          {inventoryData.length} entries
                        </p> */}
                      </Grid>
                      {/* <Grid container spacing={3}>
                        <Grid item xs={1.2}>
                          <Box display="flex">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: "#04FF00",
                                "&:hover": {
                                  backgroundColor: "#70FF6E",
                                  opacity: [0.9, 0.8, 0.7],
                                },
                              }}
                            />
                            <MDTypography fontSize={15}>
                              &nbsp;{" 0 to 30 Days"}
                            </MDTypography>
                          </Box>
                        </Grid>

                        <Grid item xs={1.2}>
                          <Box display="flex">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: "#FFFF00",
                                "&:hover": {
                                  backgroundColor: "#FFFF63",
                                  opacity: [0.9, 0.8, 0.7],
                                },
                              }}
                            />
                            <MDTypography fontSize={15}>
                              &nbsp;{" 31 to 60 Days"}
                            </MDTypography>
                          </Box>
                        </Grid>
                        <Grid item xs={1.2}>
                          <Box display="flex">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: "#FFA500",
                                "&:hover": {
                                  backgroundColor: "#FFA500",
                                  opacity: [0.9, 0.8, 0.7],
                                },
                              }}
                            />
                            <MDTypography fontSize={15}>
                              &nbsp;{" 61 to 90 Days"}
                            </MDTypography>
                          </Box>
                        </Grid>
                        <Grid item xs={1.2}>
                          <Box display="flex">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: "#FF0000",
                                "&:hover": {
                                  backgroundColor: "#FA4949",
                                  opacity: [0.9, 0.8, 0.7],
                                },
                              }}
                            />
                            <MDTypography fontSize={15}>
                              &nbsp;{"> 90 Days"}
                            </MDTypography>
                          </Box>
                        </Grid>
                      </Grid> */}
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
