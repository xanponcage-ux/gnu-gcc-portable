import React, { useEffect, useState } from "react";
import axios from "axios";
//import soap from "jquery.soap";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import MDButton from "components/MDButton";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import ReactSelect from "components/Select/ReactSelect";
import ReactMultiSelect from "components/Select/ReactMultiSelect";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import AppsIcon from "@mui/icons-material/Apps";
// Data
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import "../../tabulatorCss.scss";

import TSMCSSFSHEMatrixDetails from "./Modals/TSMCSSFSHEMatrixDetails";
import TSMCSSFSHEMatrixDetailsfoRef from "./Modals/TSMCSSFSHEMatrixDetailsfoRef";
import TSMCSSFSHEMatrixDetailsFileUpload from "./Modals/TSMCSSFSHEMatrixDetailsFileUpload";
import TSMCSSFChartSHEMatrixDetails from "./Modals/TSMCSSFChartSHEMatrixDetails";
import DeleteIcon from "@mui/icons-material/Delete";
import { type } from "os";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
// import "table fro mui";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CurrentDateOnly from "../CommonModule/CurrentDateOnly";
import "./TSMCSSF001.css";
export default function TSMCSSF001() {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  const [open, setOpen] = React.useState(false);

  const [coilModalOpen, setCoilModalOpen] = useState(false);
  const [allcoilModalOpen, setALLCoilModalOpen] = useState(false);
  const [division, setDivision] = useState([]);

  const [divisionMaster, setDivisionMaster] = useState([]);
  const [selectedDivison, setSelectedDivison] = React.useState("");
  const [selectedDivisonMaster, setSelectedDivisonMaster] = React.useState();
  const [department, setDepartment] = useState([]);
  const [departmentMaster, setDepartmentMaster] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = React.useState("");
  const [selectedDepartmentMaster, setSelectedDepartmentMaster] =
    React.useState("");
  const [section, setSection] = useState([]);

  const [sectionMaster, setSectionMaster] = useState([]);
  const [selectedSection, setSelectedSection] = React.useState("");
  const [selectedSectionMaster, setSelectedSectionMaster] = React.useState("");
  const [sHEMATRIXListDetails, setSHEMATRIXListDetails] = React.useState([]);

  const [sheMatrixTable, setSheMatrixTable] = React.useState(null);
  const [employeeDetails, setEmployeeDetails] = React.useState({
    EmployeeName: "",
    EmployeeEmail: "",
  });

  const [sHEMATRIXListPendingDetails, setSHEMATRIXListPendingDetails] =
    React.useState([]);
  const [sheMatrixPendingTable, setSheMatrixPendingTable] =
    React.useState(null);
  const [sHEMATRIXPendingListDetails, setSHEMATRIXPendingListDetails] =
    React.useState([]);

  const [
    sHEMATRIXResidualListPendingDetails,
    setSHEMATRIXResidualListPendingDetails,
  ] = React.useState([]);
  const [sheMatrixResidualPendingTable, setSheMatrixResidualPendingTable] =
    React.useState(null);
  const [
    sHEMATRIXResidualPendingListDetails,
    setSHEMATRIXResidualPendingListDetails,
  ] = React.useState([]);
  const [pendingSectionMaster, setPendingSectionMaster] = useState([]);
  const [selectedPendingSectionMaster, setSelectedPendingSectionMaster] =
    React.useState("");
  const [selectedApproverType, setSelectedApproverType] = React.useState("");
  const ConsequencesList = [
    { label: "C1", value: "C1" },
    { label: "C2", value: "C2" },
    { label: "C3", value: "C3" },
    { label: "C4", value: "C4" },
    { label: "C5", value: "C5" },
  ];
  const probablityOccuranceList = [
    { label: "L1", value: "L1" },
    { label: "L2", value: "L2" },
    { label: "L3", value: "L3" },
    { label: "L4", value: "L4" },
    { label: "L5", value: "L5" },
  ];
  const riskList = [
    { label: "R1", value: "R1" },
    { label: "R2", value: "R2" },
    { label: "R3", value: "R3" },
    { label: "R4", value: "R4" },
  ];
  const residualriskList = [
    { label: "R1", value: "R1" },
    { label: "R2", value: "R2" },
    { label: "R3", value: "R3" },
    { label: "R4", value: "R4" },
  ];
  const residualprobabilityList = [
    { label: "L1", value: "L1" },
    { label: "L2", value: "L2" },
    { label: "L3", value: "L3" },
    { label: "L4", value: "L4" },
    { label: "L5", value: "L5" },
  ];
  const residualconsequenceList = [
    { label: "C1", value: "C1" },
    { label: "C2", value: "C2" },
    { label: "C3", value: "C3" },
    { label: "C4", value: "C4" },
    { label: "C5", value: "C5" },
  ];
  ///
  const assetdataList = [
    { label: "People", value: "People" },
    { label: "Asset", value: "Asset" },
    { label: "Community", value: "Community" },
    { label: "Environment", value: "Environment" },
  ];
  //setSelectedDepartment
  const ApproverOptions = [
    { label: "Approve", value: "Approve" },
    { label: "Return", value: "Return" },
    { label: "Reject", value: "Reject" },
  ];
  const FilterApproverOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Return", value: "Return" },
    { label: "Reject", value: "Reject" },
  ];
  const ResApproverOptions = [
    { label: "Approve", value: "Approve" },
    { label: "Reject", value: "Reject" },
  ];
  const [coilBatchWeight, setCoilBatchWeight] = React.useState("");
  const [riskID, setRiskID] = React.useState("");
  const [chartCoilModalOpen, setChartCoilModalOpen] = useState(false);
  const [labelNewDialogData, setLabelNewDialogData] = useState([]);
  const [hrChemData, setHrChemData] = React.useState([]);
  const [hrChemTable, setHrChemTable] = React.useState(null);
  const [riskOwnerList, setRiskOwnerList] = React.useState([]);
  const [riskOwnerListselect, setRiskOwnerListselect] = React.useState([]);
  const [riskOwnerListselected, setRiskOwnerListselected] = React.useState("");
  const [riskOwnerListselectChart, setRiskOwnerListselectChart] =
    React.useState([]);
  const [riskOwnerListselectedChart, setRiskOwnerListselectedChart] =
    React.useState("");
  const updateCoilNumber = (coil, weight) => {
    setRiskID(coil);
  };
  const [selectedRisk, setSelectedRisk] = React.useState("");
  const [riskdataList, setRiskdataList] = React.useState([]);

  const [selectedPeopleAsset, setSelectedPeopleAsset] = React.useState("");
  const [selectedConsequences, setSelectedConsequences] = React.useState("");
  const [selectedProbablityOccurance, setSelectedProbablityOccurance] =
    React.useState("");
  const [selectedhandlerisk, setSelectedhandlerisk] = React.useState("");
  const [selectedResidualProbability, setSelectedResidualProbability] =
    React.useState("");
  const [selectedResidualConsequence, setSelectedResidualConsequence] =
    React.useState("");
  const [selectedResidualRisk, setSelectedResidualRisk] = React.useState("");
  const [shematrixMasterData, setShematrixMasterData] = React.useState({
    Line_Area: "",
    Job: "",
    Activity: "",
    Hazard: "",
    HAZARDOUSEVENT: "",
    CAUSE: "",
    CONSEQUNCEIMPACT: "",
    EXISTINGSAFEGUARD: "",
    RECOMMENDATIONREDUCING: "",
    RISKCOMMUNICATION: "",
    RISKF: "",
    RISKR: "",
    RISKOWNER: "",
    RISKID: "",
  });
  const [divisionChart, setDivisionChart] = useState([]);
  const [selectedDivisonChart, setSelectedDivisonChart] = React.useState("");
  const [departmentChart, setDepartmentChart] = useState([]);
  const [selectedDepartmentChart, setSelectedDepartmentChart] =
    React.useState("");
  const [selectedSectionChart, setSelectedSectionChart] = React.useState("");
  const [sectionChart, setSectionChart] = React.useState([]);
  const [sHEMATRIXChartDetails, setSHEMATRIXChartDetails] = useState([
    { coln: "C1L1", colval: 0 },
    { coln: "C1L2", colval: 0 },
    { coln: "C1L3", colval: 0 },
    { coln: "C1L4", colval: 0 },
    { coln: "C1L5", colval: 0 },
    { coln: "C2L1", colval: 0 },
    { coln: "C2L2", colval: 0 },
    { coln: "C2L3", colval: 0 },
    { coln: "C2L4", colval: 0 },
    { coln: "C2L5", colval: 0 },
    { coln: "C3L1", colval: 0 },
    { coln: "C3L2", colval: 0 },
    { coln: "C3L3", colval: 0 },
    { coln: "C3L4", colval: 0 },
    { coln: "C3L5", colval: 0 },
    { coln: "C4L1", colval: 0 },
    { coln: "C4L2", colval: 0 },
    { coln: "C4L3", colval: 0 },
    { coln: "C4L4", colval: 0 },
    { coln: "C4L5", colval: 0 },
    { coln: "C5L1", colval: 0 },
    { coln: "C5L2", colval: 0 },
    { coln: "C5L3", colval: 0 },
    { coln: "C5L4", colval: 0 },
    { coln: "C5L5", colval: 0 },
  ]);
  const [sHEMATRIXResidualChartDetails, setSHEMATRIXResidualChartDetails] =
    useState([
      { coln: "C1L1", colval: 0 },
      { coln: "C1L2", colval: 0 },
      { coln: "C1L3", colval: 0 },
      { coln: "C1L4", colval: 0 },
      { coln: "C1L5", colval: 0 },
      { coln: "C2L1", colval: 0 },
      { coln: "C2L2", colval: 0 },
      { coln: "C2L3", colval: 0 },
      { coln: "C2L4", colval: 0 },
      { coln: "C2L5", colval: 0 },
      { coln: "C3L1", colval: 0 },
      { coln: "C3L2", colval: 0 },
      { coln: "C3L3", colval: 0 },
      { coln: "C3L4", colval: 0 },
      { coln: "C3L5", colval: 0 },
      { coln: "C4L1", colval: 0 },
      { coln: "C4L2", colval: 0 },
      { coln: "C4L3", colval: 0 },
      { coln: "C4L4", colval: 0 },
      { coln: "C4L5", colval: 0 },
      { coln: "C5L1", colval: 0 },
      { coln: "C5L2", colval: 0 },
      { coln: "C5L3", colval: 0 },
      { coln: "C5L4", colval: 0 },
      { coln: "C5L5", colval: 0 },
    ]);
  const [tripType, setTripType] = useState("new");
  const [selectedMstPeopleAsset, setSelectedMstPeopleAsset] =
    React.useState("");
  const [selectedMstConsequences, setSelectedMstConsequences] =
    React.useState("");
  const [selectedMstProbablityOccurance, setSelectedMstProbablityOccurance] =
    React.useState("");
  const [selectedMsthandlerisk, setSelectedMsthandlerisk] = React.useState("");
  const [selectedMstResidualProbability, setSelectedMstResidualProbability] =
    React.useState("");
  const [selectedMstResidualConsequence, setSelectedMstResidualConsequence] =
    React.useState("");
  const [selectedMstResidualRisk, setSelectedMstResidualRisk] =
    React.useState("");
  const [labelWIPModalOpen, setLabelWIPModalOpen] = useState(false);
  const [labelDialogData, setLabelDialogData] = useState([]);
  const [selectedDefaultOwner, setSelectedDefaultOwner] = React.useState("");
  //page load
  useEffect(() => {
    async function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      if (initialLoad == false) {
        const response = await getAuthorization();
        if (response) {
          setInitialLoad(true);
          validateUser();

          //page load functions here
          DivisonList();
          OwnersList();

          // chart
          // showSHEMatrixChartData();
        }
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    ApproverSectionList();
    getPendingResidualSHEmatrixmasterData();
  }, [serverDetails.Company])

  //get Authorization
  const getAuthorization = () =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };
      var url = serverDetails.baseURL + serverDetails.RefreshTokenAPI;
      axiosAPI
        .post(
          url,
          { refreshToken: localStorage.getItem("tmm_refreshToken") },
          defaultOptions
        )
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else {
            localStorage.setItem("tmm_accessToken", response.data.accessToken);
            localStorage.setItem(
              "tmm_refreshToken",
              response.data.refreshToken
            );
            resolve(response.data);
          }
        });
    });

  // user validation
  const validateUser = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    setLoading(true);
    try {
      var plant = "";
      //if (serverDetails.PersonalNo === ``)
      {
        var userDetails = jwt.verify(
          localStorage.getItem("tmm_refreshToken"),
          serverDetails.REFRESH_KEY
        );

        
        plant = userDetails.payload.plant;
        serverDetails.PersonalNo = userDetails.payload.id;
      }

      if (
        serverDetails.PersonalNo == null ||
        serverDetails.PersonalNo == undefined ||
        serverDetails.PersonalNo === ``
      ) {
        window.location.href = "#/signin";
      }

      var userId = serverDetails.PersonalNo;
      var pageName = "LDSC011";
      var authDetails = await getScreenAuth(plant, userId, pageName);
      if (authDetails) {
        setRestricted(false);
        if (authDetails.payload.PS_AUTH_DML == "Z") {
          setRestricted(true);
          setAdmin(false);
        } else if (authDetails.payload.PS_AUTH_DML == "Y") {
          setAdmin(true);
          alertify.success("You are authorized to make changes from this page");
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
    } finally {
      setLoading(false);
    }

    if (serverDetails.devMode == true) {
      setRestricted(false);
      setAdmin(true);
    }
  };
  //Screen Authentication
  const getScreenAuth = (plantCd, userId, pageName) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
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

  //api call - get stage list
  //Owners list
  // for SHE Matrix Details  Page Start
  const OwnersList = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var companyCd = serverDetails.Company;
    var plantCd = serverDetails.Plant;

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    var url = "api/tsmcssf001/ownersList";
    var data = {
      companyCd: companyCd,
      plantCd: plantCd,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          setRiskOwnerList([]);
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            var rowArr = row.split(":");
            obj.label = rowArr[1] + "-" + rowArr[0];
            obj.value = rowArr[1];

            items.push(obj);
          });

          setRiskOwnerList(items);
          setRiskOwnerListselect(items);
          setRiskOwnerListselectChart(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  // for SHE Matrix Details  Page Start
  const getEmployeePersonalDetailsByPNO = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var personalno = serverDetails.PersonalNo;

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    var url = "api/tsmcssf001/getEmployeeDetailsByPersonalNumber";
    var data = {
      personalno: personalno,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          setEmployeeDetails({});
        } else {
          var EmpObj = { EmployeeName: "", EmployeeEmail: "" };
          EmpObj.EmployeeName = JSON.parse(
            response.data.verifySoapUserDetails.EmployeeName
          );
          EmpObj.EmployeeEmail = JSON.parse(
            response.data.verifySoapUserDetails.EmployeeEmail
          );
          setEmployeeDetails(EmpObj);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  //division list
  const DivisonList = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var companyCd = serverDetails.Company;
    var plantCd = serverDetails.PersonalNo;

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "api/tsmcssf001/divisonList";
    var data = {
      companyCd: companyCd,
      plantCd: plantCd,
    };

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          setDivision([]);
          setDivisionMaster([]);
          setDivisionChart([]);
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row[0];
            obj.value = row;
            items.push(obj);
          });
          setDivision(items);
          setDivisionMaster(items);
          setDivisionChart(items);

        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  const ApproverSectionList = async (value, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    //vendor List api call
    var url = "api/tsmcssf001/getApproverSectionList";
    var data = {
      plantCd: serverDetails.Plant,
      companyCd: serverDetails.Company,
      personalno: serverDetails.PersonalNo,
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
            var rowArr = row;
            obj.label = row;
            obj.value = row;
            items.push(obj);
          });
          setPendingSectionMaster(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  const handleDivisonChange = async (value) => {
    setSelectedDivison(value);
    console.log(value);
    if (value) {
      serverDetails.Plant = value.value[1];
      serverDetails.Company = value.value[2];
      const rsp = await getAuthorization();
      getDepartmentList(value.value[0]);
      getRiskDataList(value.value[0]); //Changed for handling refresh token by Ravi Rajput 26-07-2023
    }
  };
  const getDepartmentList = async (value, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    //vendor List api call
    var url = "api/tsmcssf001/getDepartmentList";
    var data = {
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
      Division: value,
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
            var rowArr = row;
            obj.label = row;
            obj.value = row;
            items.push(obj);
          });
          setDepartment(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  const handleDepartmentChange = async (value) => {
    setSelectedDepartment(value);
    if (value) {
      const rsp = await getAuthorization();
      getSectionList(value.value, selectedDivison.value[0]);
    }
  };
  const getSectionList = async (value, division, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    //vendor List api call
    var url = "api/tsmcssf001/getSectionList";
    var data = {
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
      Department: value,
      Division: division,
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
            var rowArr = row;
            obj.label = row;
            obj.value = row;
            items.push(obj);
          });
          setSection(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  const handleSectionChange = async (value) => {
    setSelectedSection(value);
  };

  const handleRiskOwnerList = async (value) => {
    setRiskOwnerListselected(value);
  };

  // chart risk owner handle change event
  const handleRiskOwnerListChart = async (value) => {
    setRiskOwnerListselectedChart(value);
  };
  // get pending SHE Matrix Master Data

  const getPendingSHEmatrixmasterData = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    var url = "api/tsmcssf001/getPendingSHEMatrixDetails";
    var data = {
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
      ApproverID: serverDetails.PersonalNo,
      section:
        selectedPendingSectionMaster.value != null
          ? selectedPendingSectionMaster.value
          : "",
      Actiontype:
        selectedApproverType.value != null ? selectedApproverType.value : "",
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else if (response.data.length === 0) {
          alertify.error("No data found !");
          setSHEMATRIXListPendingDetails([,]);
        } else {
          var rows = [];
          for (var i in response.data) {
            var rowdata = response.data[i];
            rows.push({
              T_DIVISION: rowdata.T_DIVISION,
              T_DEPARTMENT: rowdata.T_DEPARTMENT,
              T_SECTION: rowdata.T_SECTION,
              T_LINE_AREA: rowdata.T_LINE_AREA,
              T_JOB: rowdata.T_JOB,
              T_ACTIVITY: rowdata.T_ACTIVITY,
              T_RISKID: rowdata.T_RISKID,
              T_HAZARD: rowdata.T_HAZARD,
              T_RISK_OWNER: rowdata.T_RISK_OWNER,
              T_HAZARDOUS_EVENT: rowdata.T_HAZARDOUS_EVENT,
              T_CAUSE: rowdata.T_CAUSE,
              T_CONSEQUNCE_IMPACT: rowdata.T_CONSEQUNCE_IMPACT,
              T_PEOPLE_ASSET: rowdata.T_PEOPLE_ASSET,
              T_EXISTING_SAFEGUARD: rowdata.T_EXISTING_SAFEGUARD,
              T_CONSEQUENCES: rowdata.T_CONSEQUENCES,
              T_PROBABILITY_OCCURANCE: rowdata.T_PROBABILITY_OCCURANCE,
              T_RISK: rowdata.T_RISK,
              T_RECOMMENDATION_REDUCING: rowdata.T_RECOMMENDATION_REDUCING,
              T_RESIDUAL_PROBABILITY: rowdata.T_RESIDUAL_PROBABILITY,
              T_RESIDUAL_CONSEQUENCES: rowdata.T_RESIDUAL_CONSEQUENCES,
              T_RESIDUAL_RISK: rowdata.T_RESIDUAL_RISK,
              T_RISK_COMMUNICATION: rowdata.T_RISK_COMMUNICATION,
              T_VERSION: rowdata.T_VERSION,
              T_REVIEWER_ONE: rowdata.T_REVIEWER_ONE,
              T_REVIEWER_TWO: rowdata.T_REVIEWER_TWO,
              T_RISK_APPRV_STATUS: rowdata.T_RISK_APPRV_STATUS,
              T_RISK_APPRV_COMMENT: rowdata.T_RISK_APPRV_COMMENT,
              IL3OFFICER: rowdata.IL3OFFICER,
            });
          }
          setSHEMATRIXListPendingDetails(rows);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (sHEMATRIXListPendingDetails && sHEMATRIXListPendingDetails.length > 0) {
      if (tabValue == 3) {
        setSheMatrixPendingTable(
          new Tabulator("#SHEMatrixPendingTables", {
            data: sHEMATRIXListPendingDetails, //link data to table
            columns: SHEMatrixPendingDetailsColumn,
            // rowClickPopup:rowPopupFormatter, //add click popup to row
            height: 600,
            // layout: "fitColumns",
            layout: "fitDataFill",
            pagination: "local",
            paginationSize: 15,
          })
        );
      }
    }
  }, [tabValue, sHEMATRIXListPendingDetails]);
  //column definition for Matrix details Table

  //custom formatter definition
  var openIcon = function (value, data, cell, row, options) {
    //plain text value
    var riskstatus = value._cell.row.data.T_RISK_APPRV_STATUS;
    var IL3Officer = value._cell.row.data.IL3OFFICER;
    if (riskstatus != null) {
      if (riskstatus.length > 0 && riskstatus == "Returned") {
        if (serverDetails.PersonalNo != IL3Officer) {
          return "<span style='color:blue;'>Edit</sapn>";
        }
      } else {
        return "";
      }
    }
  };
  const SHEMatrixPendingDetailsColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      frozen: true,
      download: false,
    },
    {
      title: "IL3 Officer",
      field: "IL3OFFICER",
      frozen: true,
      visible: false,
    },
    {
      title: "",
      headerSort: false,
      frozen: true,
      formatter: openIcon,
      cellClick: function (e, cell, value, data) {
        setTabValue(0);
        var riskstatus = cell.getRow().getData().T_RISK_APPRV_STATUS; //T_RISK_APPRV_STATUS
        if (riskstatus != null) {
          if (riskstatus.length > 0 && riskstatus == "Returned") {
            updateInputValuesFromRejected(cell.getRow().getData());
          } else {
            alertify.error("not editable");
          }
        }
      },
    },
    {
      title: "Risk ID",
      field: "T_RISKID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },

    {
      title: "Division",
      field: "T_DIVISION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Department",
      field: "T_DEPARTMENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Section",
      field: "T_SECTION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Line Area",
      field: "T_LINE_AREA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Job",
      field: "T_JOB",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
      formatter: "textarea",
    },
    {
      title: "Activity",
      field: "T_ACTIVITY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
      formatter: "textarea",
    },
    {
      title: "Hazard",
      field: "T_HAZARD",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
      formatter: "textarea",
    },
    {
      title: "Hazardous Event",
      field: "T_HAZARDOUS_EVENT",
      width: 300,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cause",
      field: "T_CAUSE",
      width: 300,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Consequence Impact",
      field: "T_CONSEQUNCE_IMPACT",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
    },
    {
      title: "People Asset",
      field: "T_PEOPLE_ASSET",
      width: 150,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Existing Safeguard",
      field: "T_EXISTING_SAFEGUARD",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Consequences",
      field: "T_CONSEQUENCES",
      width: 120,
      editor: "select",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Probability Occurance",
      field: "T_PROBABILITY_OCCURANCE",
      width: 200,

      editor: "select",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Risk",
      field: "T_RISK",
      headerFilter: "input",
      width: 80,
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Recommendation Reducing",
      field: "T_RECOMMENDATION_REDUCING",
      width: 300,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Residual Probability",
      field: "T_RESIDUAL_PROBABILITY",
      width: 160,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Residual Consequences",
      field: "T_RESIDUAL_CONSEQUENCES",
      width: 160,
      editor: "select",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Residual Risk",
      field: "T_RESIDUAL_RISK",
      headerFilter: "input",
      width: 80,
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Risk Communication",
      field: "T_RISK_COMMUNICATION",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Owner",
      field: "T_RISK_OWNER",
      editor: "select",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Reviewer1",
      field: "T_REVIEWER_ONE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Reviewer2",
      field: "T_REVIEWER_TWO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Action",
      field: "T_RISK_APPRV_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "select",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: ApproverOptions,
      },
      formatter: "lookup",
      formatterParams: ApproverOptions,
    },
    {
      title: "Approver Remarks",
      field: "T_RISK_APPRV_COMMENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      width: 200,
      editorParams: {
        search: true,
        selectContents: true,
        elementAttributes: {
          maxlength: "250",
        },
      },
      formatter: "textarea",
    },
  ];

  const handlependingSectionMasterChange = async (value) => {
    if (value) {
      setSelectedPendingSectionMaster(value);
    } else {
      setSelectedPendingSectionMaster("");
    }
  };
  const handleApproverOptionsChange = async (value) => {
    if (value) {
      setSelectedApproverType(value);
    } else {
      setSelectedApproverType("");
    }
  };
  //end for pending SHE Matrix Master data
  // for pending residual risk

  // get pending SHE Matrix Master Data

  const getPendingResidualSHEmatrixmasterData = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    var url = "api/tsmcssf001/getPendingResidualSHEMatrixDetails";
    var data = {
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
      ApproverID: serverDetails.PersonalNo,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else if (response.data.length === 0) {
          setSHEMATRIXResidualListPendingDetails([]);
          alertify.error("No data found !");
        } else {
          var rows = [];
          for (var i in response.data) {
            var rowdata = response.data[i];
            rows.push({
              T_DIVISION: rowdata.T_DIVISION,
              T_DEPARTMENT: rowdata.T_DEPARTMENT,
              T_SECTION: rowdata.T_SECTION,
              T_LINE_AREA: rowdata.T_LINE_AREA,
              T_JOB: rowdata.T_JOB,
              T_ACTIVITY: rowdata.T_ACTIVITY,
              T_RISKID: rowdata.T_RISKID,
              T_HAZARD: rowdata.T_HAZARD,
              T_RISK_OWNER: rowdata.T_RISK_OWNER,
              T_HAZARDOUS_EVENT: rowdata.T_HAZARDOUS_EVENT,
              T_CAUSE: rowdata.T_CAUSE,
              T_CONSEQUNCE_IMPACT: rowdata.T_CONSEQUNCE_IMPACT,
              T_PEOPLE_ASSET: rowdata.T_PEOPLE_ASSET,
              T_EXISTING_SAFEGUARD: rowdata.T_EXISTING_SAFEGUARD,
              T_CONSEQUENCES: rowdata.T_CONSEQUENCES,
              T_PROBABILITY_OCCURANCE: rowdata.T_PROBABILITY_OCCURANCE,
              T_RISK: rowdata.T_RISK,
              T_RECOMMENDATION_REDUCING: rowdata.T_RECOMMENDATION_REDUCING,
              T_RESIDUAL_PROBABILITY: rowdata.T_RESIDUAL_PROBABILITY,
              T_RESIDUAL_CONSEQUENCES: rowdata.T_RESIDUAL_CONSEQUENCES,
              T_RESIDUAL_RISK: rowdata.T_RESIDUAL_RISK,
              T_RISK_COMMUNICATION: rowdata.T_RISK_COMMUNICATION,
              T_VERSION: rowdata.T_VERSION,
              T_REVIEWER_ONE: rowdata.T_REVIEWER_ONE,
              T_REVIEWER_TWO: rowdata.T_REVIEWER_TWO,
              T_RISK_APPRV_STATUS: rowdata.T_RISK_APPRV_STATUS,
              T_RISK_APPRV_COMMENT: rowdata.T_RISK_APPRV_COMMENT,
              T_SHE_RISK_FILE: rowdata.T_SHE_RISK_FILE,
            });
          }
          setSHEMATRIXResidualListPendingDetails(rows);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  var callDownloadFunction = function (e, row, onRendered) {
    var rowdata = row.getData();
    var newToken = true;
    var filedata = rowdata.T_SHE_RISK_FILE;
    if (newToken) {
      const rsp = getAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
      responseType: "blob",
    };

    var data = { filename: filedata };
    var url = "api/tsmcssf001/filedownload";

    setLoading(true);
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // IE variant
          window.navigator.msSaveOrOpenBlob(
            new Blob([response.data], {
              type: "application/pdf",
              encoding: "UTF-8",
            }),
            filedata
          );
        } else {
          const url = window.URL.createObjectURL(
            new Blob([response.data], {
              type: "application/pdf",
              encoding: "UTF-8",
            })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filedata);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      })
      // if there is any error occured in backend
      .catch((error) => {
        // console.log(error);
        alertify.error(error?.response?.data?.message);
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (
      sHEMATRIXResidualListPendingDetails &&
      sHEMATRIXResidualListPendingDetails.length > 0
    ) {
      if (tabValue == 4) {
        setSheMatrixResidualPendingTable(
          new Tabulator("#SHEMatrixResidualPendingTables", {
            data: sHEMATRIXResidualListPendingDetails, //link data to table
            columns: SHEMatrixResidualPendingDetailsColumn,
            // rowClickPopup:rowPopupFormatter, //add click popup to row
            height: 600,
            // layout: "fitColumns",
            layout: "fitDataFill",
            pagination: "local",
            paginationSize: 15,
          })
        );
      }
    }
  }, [tabValue, sHEMATRIXResidualListPendingDetails]);

  const SHEMatrixResidualPendingDetailsColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      frozen: true,
      download: false,
    },
    {
      title: "File",
      field: "T_SHE_RISK_FILE",
      frozen: true,
      formatter: function (cell, formatterParams) {
        // var value = "Show";
        var value = cell.getValue();
        var stringpathe = "";
        if (value != null) {
          stringpathe = "Show";
        } else {
          stringpathe = " ";
        }

        cell.getElement().style.color = "blue";
        return stringpathe;
      },
      clickPopup: callDownloadFunction,
    },
    {
      title: "Risk ID",
      field: "T_RISKID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },

    {
      title: "Division",
      field: "T_DIVISION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Department",
      field: "T_DEPARTMENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Section",
      field: "T_SECTION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Line Area",
      field: "T_LINE_AREA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Job",
      field: "T_JOB",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
      formatter: "textarea",
    },
    {
      title: "Activity",
      field: "T_ACTIVITY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
      formatter: "textarea",
    },
    {
      title: "Hazard",
      field: "T_HAZARD",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
      formatter: "textarea",
    },
    {
      title: "Hazardous Event",
      field: "T_HAZARDOUS_EVENT",
      width: 300,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cause",
      field: "T_CAUSE",
      width: 300,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Consequence Impact",
      field: "T_CONSEQUNCE_IMPACT",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
    },
    {
      title: "People Asset",
      field: "T_PEOPLE_ASSET",
      width: 150,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Existing Safeguard",
      field: "T_EXISTING_SAFEGUARD",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Consequences",
      field: "T_CONSEQUENCES",
      width: 120,
      editor: "select",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Probability Occurance",
      field: "T_PROBABILITY_OCCURANCE",
      width: 200,

      editor: "select",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Risk",
      field: "T_RISK",
      headerFilter: "input",
      width: 80,
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Recommendation Reducing",
      field: "T_RECOMMENDATION_REDUCING",
      width: 300,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Residual Probability",
      field: "T_RESIDUAL_PROBABILITY",
      width: 160,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Residual Consequences",
      field: "T_RESIDUAL_CONSEQUENCES",
      width: 160,
      editor: "select",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Residual Risk",
      field: "T_RESIDUAL_RISK",
      headerFilter: "input",
      width: 80,
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Risk Communication",
      field: "T_RISK_COMMUNICATION",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Owner",
      field: "T_RISK_OWNER",
      editor: "select",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Reviewer1",
      field: "T_REVIEWER_ONE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Reviewer2",
      field: "T_REVIEWER_TWO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Action",
      field: "T_RISK_APPRV_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "select",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: ResApproverOptions,
      },
      formatter: "lookup",
      formatterParams: ApproverOptions,
    },
    {
      title: "Approver Remarks",
      field: "T_RISK_APPRV_COMMENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      width: 200,
      editorParams: {
        search: true,
        selectContents: true,
        elementAttributes: {
          maxlength: "250",
        },
      },
      formatter: "textarea",
    },
  ];
  // get risk data list
  const getRiskDataList = async (value, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    //vendor List api call
    var url = "api/tsmcssf001/getRiskDataList";
    var data = {
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
      Division: value,
      // Department: selectedDepartment.value,
      // Section: value,
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
            var rowArr = row;
            obj.label = row;
            obj.value = row;
            items.push(obj);
          });

          setRiskdataList(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  //SHE MATRIX DETAILS
  const getSHERiskMatrixDetailsData = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);

    if (selectedSection != "" || selectedSection == null) {
    }
    var division =
      selectedDivison != null && selectedDivison.length != 0
        ? selectedDivison.value[0]
        : "";
    var department =
      selectedDepartment != null && selectedDepartment.length != 0
        ? selectedDepartment.value
        : "";
    var section =
      selectedSection != null && selectedSection.length != 0
        ? selectedSection.value
        : "";
    var selected_RiskID = "";

    selectedRisk &&
      selectedRisk.forEach(function (item) {
        if (selected_RiskID == "") {
          selected_RiskID += item.value;
        } else {
          selected_RiskID += "," + item.value;
        }
      });

    var url = "api/tsmcssf001/getSHEMatrixDetails";
    var data = {
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
      division: division,
      depart: department,
      sect: section,
      RiskID: selected_RiskID,
      PeopleAsset:
        selectedPeopleAsset != null && selectedPeopleAsset.length != 0
          ? selectedPeopleAsset.value
          : "",

      Consequences:
        selectedConsequences != null && selectedConsequences.length != 0
          ? selectedConsequences.value
          : "",
      ProbablityOccurance:
        selectedProbablityOccurance != null &&
          selectedProbablityOccurance.length != 0
          ? selectedProbablityOccurance.value
          : "",
      Risk:
        selectedhandlerisk != null && selectedhandlerisk.length != 0
          ? selectedhandlerisk.value
          : "",
      ResidualProbability:
        selectedResidualProbability != null &&
          selectedResidualProbability.length != 0
          ? selectedResidualProbability.value
          : "",
      ResidualConsequence:
        selectedResidualConsequence != null &&
          selectedResidualConsequence.length != 0
          ? selectedResidualConsequence.value
          : "",
      ResidualRisk:
        selectedResidualRisk != null && selectedResidualRisk.length != 0
          ? selectedResidualRisk.value
          : "",
      Riskowner:
        riskOwnerListselected != null && riskOwnerListselected.length != 0
          ? riskOwnerListselected.value
          : "",
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else if (response.data.length === 0) {
          alertify.error("No data found !");
          setSHEMATRIXListDetails([,]);
        } else {
          var rows = [];
          for (var i in response.data) {
            var rowdata = response.data[i];
            rows.push({
              T_DIVISION: rowdata.T_DIVISION,
              T_DEPARTMENT: rowdata.T_DEPARTMENT,
              T_SECTION: rowdata.T_SECTION,
              T_LINE_AREA: rowdata.T_LINE_AREA,
              T_JOB: rowdata.T_JOB,
              T_ACTIVITY: rowdata.T_ACTIVITY,
              T_RISKID: rowdata.T_RISKID,
              T_HAZARD: rowdata.T_HAZARD,
              T_RISK_OWNER: rowdata.T_RISK_OWNER,
              T_RISK_OWNERSELE: rowdata.T_RISK_OWNER,
              T_HAZARDOUS_EVENT: rowdata.T_HAZARDOUS_EVENT,
              T_CAUSE: rowdata.T_CAUSE,
              T_CONSEQUNCE_IMPACT: rowdata.T_CONSEQUNCE_IMPACT,
              T_PEOPLE_ASSET: rowdata.T_PEOPLE_ASSET,
              T_EXISTING_SAFEGUARD: rowdata.T_EXISTING_SAFEGUARD,
              T_CONSEQUENCES: rowdata.T_CONSEQUENCES,
              T_PROBABILITY_OCCURANCE: rowdata.T_PROBABILITY_OCCURANCE,
              T_RISK: rowdata.T_RISK,
              T_RECOMMENDATION_REDUCING: rowdata.T_RECOMMENDATION_REDUCING,
              T_RESIDUAL_PROBABILITY: rowdata.T_RESIDUAL_PROBABILITY,
              T_RESIDUAL_CONSEQUENCES: rowdata.T_RESIDUAL_CONSEQUENCES,
              T_RESIDUAL_RISK: rowdata.T_RESIDUAL_RISK,
              T_RISK_COMMUNICATION: rowdata.T_RISK_COMMUNICATION,
              T_VERSION: rowdata.T_VERSION,
              T_CHANGE_COLUMN: rowdata.T_CHANGE_COLUMN,
              T_REVIEWER_ONE: rowdata.T_REVIEWER_ONE,
              T_REVIEWER_ONE_COMMENT: rowdata.T_REVIEWER_ONE_COMMENT,
              T_REVIEWER_TWO: rowdata.T_REVIEWER_TWO,
              T_REVIEWER_TWO_COMMENT: rowdata.T_REVIEWER_TWO_COMMENT,
              T_SHE_RISK_FILE: rowdata.T_SHE_RISK_FILE,
              IL3OFFICER: rowdata.IL3OFFICER,
              SAFETYOFFICER: rowdata.SAFETYOFFICER,
            });
          }
          setSHEMATRIXListDetails(rows);
        }
      })

      .finally((f) => {
        setLoading(false);
      });
  };

  // for she matrix details Grid binding
  useEffect(() => {
    if (sHEMATRIXListDetails && sHEMATRIXListDetails.length > 0) {
      if (tabValue == 1) {
        setSheMatrixTable(
          new Tabulator("#SHEMatrixTable", {
            data: sHEMATRIXListDetails, //link data to table
            columns: SHEMatrixDetailsColumn,
            // rowClickPopup:rowPopupFormatter, //add click popup to row
            height: 600,
            // layout: "fitColumns",
            layout: "fitDataFill",
            pagination: "local",
            paginationSize: 15,
          })
        );
      }
    }
  }, [tabValue, sHEMATRIXListDetails]);

  var rowPopupFormatter = function (e, row, onRendered) {
    var data = row.getData();
    setRiskID(data.T_RISKID);
    setCoilModalOpen(true);
    //return;
  };
  // for chart matrix number count button click variable

  var handleChartMatrixview = function (consprob) {
    if (consprob) {
      setChartCoilModalOpen(true);
      setLabelNewDialogData(consprob);
    } else {
      alertify.error("No risk available");
      return;
    }
    //return;
  };

  const accessLabelNewDialogData = () => {
    return labelNewDialogData;
  };


  var CalculateRisk = (cell) => {
    var data = cell.getData();
    var res = "";
    if (data.T_CONSEQUENCES == "C1" && data.T_PROBABILITY_OCCURANCE == "L1") {
      res = "R4";
    } else if (
      data.T_CONSEQUENCES == "C1" &&
      data.T_PROBABILITY_OCCURANCE == "L2"
    ) {
      res = "R4";
    } else if (
      data.T_CONSEQUENCES == "C1" &&
      data.T_PROBABILITY_OCCURANCE == "L3"
    ) {
      res = "R4";
    } else if (
      data.T_CONSEQUENCES == "C1" &&
      data.T_PROBABILITY_OCCURANCE == "L4"
    ) {
      res = "R3";
    } else if (
      data.T_CONSEQUENCES == "C1" &&
      data.T_PROBABILITY_OCCURANCE == "L5"
    ) {
      res = "R3";
    } else if (
      data.T_CONSEQUENCES == "C2" &&
      data.T_PROBABILITY_OCCURANCE == "L1"
    ) {
      res = "R4";
    } else if (
      data.T_CONSEQUENCES == "C2" &&
      data.T_PROBABILITY_OCCURANCE == "L2"
    ) {
      res = "R3";
    } else if (
      data.T_CONSEQUENCES == "C2" &&
      data.T_PROBABILITY_OCCURANCE == "L3"
    ) {
      res = "R3";
    } else if (
      data.T_CONSEQUENCES == "C2" &&
      data.T_PROBABILITY_OCCURANCE == "L4"
    ) {
      res = "R3";
    } else if (
      data.T_CONSEQUENCES == "C2" &&
      data.T_PROBABILITY_OCCURANCE == "L5"
    ) {
      res = "R2";
    } else if (
      data.T_CONSEQUENCES == "C3" &&
      data.T_PROBABILITY_OCCURANCE == "L1"
    ) {
      res = "R4";
    } else if (
      data.T_CONSEQUENCES == "C3" &&
      data.T_PROBABILITY_OCCURANCE == "L2"
    ) {
      res = "R3";
    } else if (
      data.T_CONSEQUENCES == "C3" &&
      data.T_PROBABILITY_OCCURANCE == "L3"
    ) {
      res = "R3";
    } else if (
      data.T_CONSEQUENCES == "C3" &&
      data.T_PROBABILITY_OCCURANCE == "L4"
    ) {
      res = "R2";
    } else if (
      data.T_CONSEQUENCES == "C3" &&
      data.T_PROBABILITY_OCCURANCE == "L5"
    ) {
      res = "R2";
    } else if (
      data.T_CONSEQUENCES == "C4" &&
      data.T_PROBABILITY_OCCURANCE == "L1"
    ) {
      res = "R3";
    } else if (
      data.T_CONSEQUENCES == "C4" &&
      data.T_PROBABILITY_OCCURANCE == "L2"
    ) {
      res = "R3";
    } else if (
      data.T_CONSEQUENCES == "C4" &&
      data.T_PROBABILITY_OCCURANCE == "L3"
    ) {
      res = "R2";
    } else if (
      data.T_CONSEQUENCES == "C4" &&
      data.T_PROBABILITY_OCCURANCE == "L4"
    ) {
      res = "R1";
    } else if (
      data.T_CONSEQUENCES == "C4" &&
      data.T_PROBABILITY_OCCURANCE == "L5"
    ) {
      res = "R1";
    } else if (
      data.T_CONSEQUENCES == "C4" &&
      data.T_PROBABILITY_OCCURANCE == "L4"
    ) {
      res = "R1";
    } else if (
      data.T_CONSEQUENCES == "C5" &&
      data.T_PROBABILITY_OCCURANCE == "L1"
    ) {
      res = "R3";
    } else if (
      data.T_CONSEQUENCES == "C5" &&
      data.T_PROBABILITY_OCCURANCE == "L2"
    ) {
      res = "R2";
    } else if (
      data.T_CONSEQUENCES == "C5" &&
      data.T_PROBABILITY_OCCURANCE == "L3"
    ) {
      res = "R1";
    } else if (
      data.T_CONSEQUENCES == "C5" &&
      data.T_PROBABILITY_OCCURANCE == "L4"
    ) {
      res = "R1";
    } else if (
      data.T_CONSEQUENCES == "C5" &&
      data.T_PROBABILITY_OCCURANCE == "L5"
    ) {
      res = "R1";
    }
    var row = cell.getRow();
    row.update({
      T_RISK: res,
    });
  };

  var CalculateResidualRisk = (cell) => {
    var data = cell.getData();

    var res = "";
    if (
      data.T_RESIDUAL_CONSEQUENCES == "C1" &&
      data.T_RESIDUAL_PROBABILITY == "L1"
    ) {
      res = "R4";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C1" &&
      data.T_RESIDUAL_PROBABILITY == "L2"
    ) {
      res = "R4";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C1" &&
      data.T_RESIDUAL_PROBABILITY == "L3"
    ) {
      res = "R4";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C1" &&
      data.T_RESIDUAL_PROBABILITY == "L4"
    ) {
      res = "R3";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C1" &&
      data.T_RESIDUAL_PROBABILITY == "L5"
    ) {
      res = "R3";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C2" &&
      data.T_RESIDUAL_PROBABILITY == "L1"
    ) {
      res = "R4";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C2" &&
      data.T_RESIDUAL_PROBABILITY == "L2"
    ) {
      res = "R3";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C2" &&
      data.T_RESIDUAL_PROBABILITY == "L3"
    ) {
      res = "R3";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C2" &&
      data.T_RESIDUAL_PROBABILITY == "L4"
    ) {
      res = "R3";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C2" &&
      data.T_RESIDUAL_PROBABILITY == "L5"
    ) {
      res = "R2";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C3" &&
      data.T_RESIDUAL_PROBABILITY == "L1"
    ) {
      res = "R4";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C3" &&
      data.T_RESIDUAL_PROBABILITY == "L2"
    ) {
      res = "R3";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C3" &&
      data.T_RESIDUAL_PROBABILITY == "L3"
    ) {
      res = "R3";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C3" &&
      data.T_RESIDUAL_PROBABILITY == "L4"
    ) {
      res = "R2";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C3" &&
      data.T_RESIDUAL_PROBABILITY == "L5"
    ) {
      res = "R2";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C4" &&
      data.T_RESIDUAL_PROBABILITY == "L1"
    ) {
      res = "R3";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C4" &&
      data.T_RESIDUAL_PROBABILITY == "L2"
    ) {
      res = "R3";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C4" &&
      data.T_RESIDUAL_PROBABILITY == "L3"
    ) {
      res = "R2";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C4" &&
      data.T_RESIDUAL_PROBABILITY == "L4"
    ) {
      res = "R1";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C4" &&
      data.T_RESIDUAL_PROBABILITY == "L5"
    ) {
      res = "R1";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C4" &&
      data.T_RESIDUAL_PROBABILITY == "L4"
    ) {
      res = "R1";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C5" &&
      data.T_RESIDUAL_PROBABILITY == "L1"
    ) {
      res = "R3";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C5" &&
      data.T_RESIDUAL_PROBABILITY == "L2"
    ) {
      res = "R2";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C5" &&
      data.T_RESIDUAL_PROBABILITY == "L3"
    ) {
      res = "R1";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C5" &&
      data.T_RESIDUAL_PROBABILITY == "L4"
    ) {
      res = "R1";
    } else if (
      data.T_RESIDUAL_CONSEQUENCES == "C5" &&
      data.T_RESIDUAL_PROBABILITY == "L5"
    ) {
      res = "R1";
    }
    var row = cell.getRow();
    row.update({
      T_RESIDUAL_RISK: res,
    });
  };
  //column definition for Matrix details Table
  const SHEMatrixDetailsColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      frozen: true,
      download: false,
    },
    {
      title: "Change Column",
      field: "T_CHANGE_COLUMN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      visible: false,
    },
    {
      title: "IL3 Officer",
      field: "IL3OFFICER",
      frozen: true,
      visible: false,
    },
    {
      title: "Safety officer",
      field: "SAFETYOFFICER",
      frozen: true,
      visible: false,
    },
    {
      title: "File",
      field: "T_SHE_RISK_FILE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,

      formatter: function (cell, formatterParams) {
        // var value = "Show";
        var value = cell.getValue();
        var stringpathe = "";
        if (value != null) {
          stringpathe = "Show";
        } else {
          stringpathe = " ";
        }

        cell.getElement().style.color = "blue";
        return stringpathe;
      },
      clickPopup: callDownloadFunction,
    },
    {
      title: "Risk ID",
      field: "T_RISKID",
      clickPopup: rowPopupFormatter,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style.color = "blue";
        return value;
      },
    },
    {
      title: "Ver No",
      field: "T_VERSION",
      width: 80,

      frozen: true,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value == null) {
          value = 1;
        }
        return value;
      },
    },
    {
      title: "Division",
      field: "T_DIVISION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Department",
      field: "T_DEPARTMENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Section",
      field: "T_SECTION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Line Area",
      field: "T_LINE_AREA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Job",
      field: "T_JOB",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
      formatter: "textarea",
    },
    {
      title: "Activity",
      field: "T_ACTIVITY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
      formatter: "textarea",
    },
    {
      title: "Hazard",
      field: "T_HAZARD",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
      formatter: "textarea",
    },
    {
      title: "Hazardous Event",
      field: "T_HAZARDOUS_EVENT",
      width: 300,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      editable: function (cell) {
        var data = cell.getRow().getData();
        if (data.IL3OFFICER != null) {
          if (data.IL3OFFICER == serverDetails.PersonalNo) {
            return true;
          } else {
            return false;
          }
        } else if (data.SAFETYOFFICER != null) {
          if (data.SAFETYOFFICER == serverDetails.PersonalNo) {
            return true;
          } else {
            return false;
          }
        }
      },
      editorParams: {
        search: true,
        selectContents: true,
        elementAttributes: {
          maxlength: "250",
        },
      },
      formatter: "textarea",
      formatterParams: function (cell, formatterParams) {
        var value = cell.getValue();
        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;
        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_HAZARDOUS_EVENT") {
              cell.getElement().style.color = "orange";
            }
          }
        }
        return value;
      },
    },
    {
      title: "Cause",
      field: "T_CAUSE",
      width: 300,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      editable: function (cell) {
        var data = cell.getRow().getData();
        if (data.IL3OFFICER != null) {
          if (data.IL3OFFICER == serverDetails.PersonalNo) {
            return true;
          } else {
            return false;
          }
        } else if (data.SAFETYOFFICER != null) {
          if (data.SAFETYOFFICER == serverDetails.PersonalNo) {
            return true;
          } else {
            return false;
          }
        }
      },
      editorParams: {
        search: true,
        selectContents: true,
        elementAttributes: {
          maxlength: "250",
        },
      },
      formatter: "textarea",
      formatterParams: function (cell, formatterParams) {
        var value = cell.getValue();
        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;
        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_CAUSE") {
              cell.getElement().style.color = "orange";
            }
          }
        }
        return value;
      },
    },
    {
      title: "Consequence Impact",
      field: "T_CONSEQUNCE_IMPACT",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
      editor: "input",
      editable: function (cell) {
        var data = cell.getRow().getData();
        if (data.IL3OFFICER != null) {
          if (data.IL3OFFICER == serverDetails.PersonalNo) {
            return true;
          } else {
            return false;
          }
        } else if (data.SAFETYOFFICER != null) {
          if (data.SAFETYOFFICER == serverDetails.PersonalNo) {
            return true;
          } else {
            return false;
          }
        }
      },
      editorParams: {
        search: true,
        selectContents: true,
        elementAttributes: {
          maxlength: "250",
        },
      },
      formatter: "textarea",
      formatterParams: function (cell, formatterParams) {
        var value = cell.getValue();
        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;
        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_CONSEQUNCE_IMPACT") {
              cell.getElement().style.color = "orange";
            }
          }
        }
        return value;
      },
    },
    {
      title: "People Asset",
      field: "T_PEOPLE_ASSET",
      width: 150,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "select",
      editable: function (cell) {
        var data = cell.getRow().getData();
        if (data.IL3OFFICER != null) {
          if (data.IL3OFFICER == serverDetails.PersonalNo) {
            return true;
          } else {
            return false;
          }
        } else if (data.SAFETYOFFICER != null) {
          if (data.SAFETYOFFICER == serverDetails.PersonalNo) {
            return true;
          } else {
            return false;
          }
        }
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: assetdataList,
      },
      formatter: "lookup",
      formatterParams: assetdataList,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;

        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_PEOPLE_ASSET") {
              cell.getElement().style.color = "orange";
            }
          }
        }
        return value;
      },
    },
    {
      title: "Existing Safeguard",
      field: "T_EXISTING_SAFEGUARD",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
      editor: "input",
      editable: function (cell) {
        var data = cell.getRow().getData();
        if (data.IL3OFFICER != null) {
          if (data.IL3OFFICER == serverDetails.PersonalNo) {
            return true;
          } else {
            return false;
          }
        } else if (data.SAFETYOFFICER != null) {
          if (data.SAFETYOFFICER == serverDetails.PersonalNo) {
            return true;
          } else {
            return false;
          }
        }
      },
      editorParams: {
        search: true,
        selectContents: true,
        elementAttributes: {
          maxlength: "500",
        },
      },
      formatter: "textarea",
      formatterParams: function (cell, formatterParams) {
        var value = cell.getValue();

        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;

        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_EXISTING_SAFEGUARD") {
              cell.getElement().style.color = "orange";
            }
          }
        }
        return value;
      },
    },
    {
      title: "Consequences",
      field: "T_CONSEQUENCES",
      width: 120,
      // editor: "select",
      // editor: (serverDetails.PersonalNo == "147850" ||serverDetails.PersonalNo == "158524"  ||serverDetails.PersonalNo == "221805") ? "select" : "", //147850
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: ConsequencesList,
      },
      formatter: "lookup",
      formatterParams: ConsequencesList,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;
        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_CONSEQUENCES") {
              cell.getElement().style.color = "orange";
            }
          }
        }
        return value;
      },
      cellEdited: CalculateRisk,
    },
    {
      title: "Probability Occurance",
      field: "T_PROBABILITY_OCCURANCE",
      width: 200,
      // editor: "select",
      // editor: (serverDetails.PersonalNo == "147850" ||serverDetails.PersonalNo == "158524"  ||serverDetails.PersonalNo == "221805") ? "select" : "", //147850
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: probablityOccuranceList,
      },
      formatter: "lookup",
      formatterParams: probablityOccuranceList,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;
        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_PROBABILITY_OCCURANCE") {
              cell.getElement().style.color = "orange";
            }
          }
        }
        return value;
      },
      cellEdited: CalculateRisk,
    },
    {
      title: "Risk",
      field: "T_RISK",
      headerFilter: "input",
      width: 80,
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value == "R1") {
          cell.getElement().style.backgroundColor = "red";
        } else if (value == "R2") {
          cell.getElement().style.backgroundColor = "yellow";
        } else if (value == "R3") {
          cell.getElement().style.backgroundColor = "blue";
        } else if (value == "R4") {
          cell.getElement().style.backgroundColor = "green";
        }
        return value;
      },
    },
    {
      title: "Recommendation Reducing",
      field: "T_RECOMMENDATION_REDUCING",
      width: 300,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      editable: function (cell) {
        var data = cell.getRow().getData();
        if (data.IL3OFFICER != null) {
          if (data.IL3OFFICER == serverDetails.PersonalNo) {
            return true;
          } else {
            return false;
          }
        } else if (data.SAFETYOFFICER != null) {
          if (data.SAFETYOFFICER == serverDetails.PersonalNo) {
            return true;
          } else {
            return false;
          }
        }
      },
      editorParams: {
        search: true,
        selectContents: true,
        elementAttributes: {
          maxlength: "500",
        },
      },
      formatter: "textarea",
      formatterParams: function (cell, formatterParams) {
        var value = cell.getValue();

        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;

        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_RECOMMENDATION_REDUCING") {
              cell.getElement().style.color = "orange";
            }
          }
        }
        return value;
      },
    },
    {
      title: "Residual Probability",
      field: "T_RESIDUAL_PROBABILITY",

      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "select",
      editable: function (cell) {
        var data = cell.getRow().getData();
        if (data.T_RISK_OWNER != null) {
          return data.T_RISK_OWNER == serverDetails.PersonalNo;
        } else {
          return false;
        }
      },
      // editor: (serverDetails.PersonalNo == "147850" ||serverDetails.PersonalNo == "158524"  ||serverDetails.PersonalNo == "221805") ? "select" : "", //147850
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: residualprobabilityList,
      },
      formatter: "lookup",
      formatterParams: residualprobabilityList,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;

        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_RESIDUAL_PROBABILITY") {
              cell.getElement().style.color = "orange";
            }
          }
        }
        return value;
      },
      cellEdited: CalculateResidualRisk,
    },
    {
      title: "Residual Consequences",
      field: "T_RESIDUAL_CONSEQUENCES",

      editor: "select",
      editable: function (cell) {
        var data = cell.getRow().getData();
        if (data.T_RISK_OWNER != null) {
          return data.T_RISK_OWNER == serverDetails.PersonalNo;
        } else {
          return false;
        }
      },
      // editor: (serverDetails.PersonalNo == "147850" ||serverDetails.PersonalNo == "158524"  ||serverDetails.PersonalNo == "221805") ? "select" : "", //147850
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: residualconsequenceList,
      },
      formatter: "lookup",
      formatterParams: residualconsequenceList,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;

        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_RESIDUAL_CONSEQUENCES") {
              cell.getElement().style.color = "orange";
            }
          }
        }
        return value;
      },
      cellEdited: CalculateResidualRisk,
    },
    {
      title: "Residual Risk",
      field: "T_RESIDUAL_RISK",
      headerFilter: "input",

      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value == "R1") {
          cell.getElement().style.backgroundColor = "red";
        } else if (value == "R2") {
          cell.getElement().style.backgroundColor = "yellow";
        } else if (value == "R3") {
          cell.getElement().style.backgroundColor = "blue";
        } else if (value == "R4") {
          cell.getElement().style.backgroundColor = "green";
        }
        return value;
      },
    },
    {
      title: "Risk Communication",
      field: "T_RISK_COMMUNICATION",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
      editor: "input",
      editable: function (cell) {
        var data = cell.getRow().getData();
        if (data.T_RISK_OWNER != null) {
          return data.T_RISK_OWNER == serverDetails.PersonalNo;
        } else {
          return false;
        }
      },
      editorParams: {
        search: true,
        selectContents: true,
        elementAttributes: {
          maxlength: "250",
        },
      },
      formatter: "textarea",
      formatterParams: function (cell, formatterParams) {
        var value = cell.getValue();
        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;
        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_RISK_COMMUNICATION") {
              cell.getElement().style.color = "orange";
            }
          }
        }
        return value;
      },
    },
    {
      title: "Owner",
      field: "T_RISK_OWNER",
      editor: "select",
      editable: function (cell) {
        var data = cell.getRow().getData();
        var IL3Off = data.IL3OFFICER;
        if (data.IL3OFFICER != null) {
          if (data.IL3OFFICER == serverDetails.PersonalNo) {
            return true;
          } else {
            return false;
          }
        }
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: riskOwnerList,
      },
      formatter: "lookup",
      formatterParams: riskOwnerList,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;
        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_RISK_OWNER") {
              cell.getElement().style.color = "orange";
            }
          }
        }
        return value;
      },
    },
    {
      title: "Reviewer1",
      field: "T_REVIEWER_ONE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Reviewer1 Comment",
      field: "T_REVIEWER_ONE_COMMENT",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
      editor: serverDetails.PersonalNo == "147850" ? "input" : "", //147850
      editorParams: {
        search: true,
        selectContents: true,
        elementAttributes: {
          maxlength: "250",
        },
      },
      formatter: "textarea",
      formatterParams: function (cell, formatterParams) {
        var value = cell.getValue();
        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;
        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_REVIEWER_ONE_COMMENT") {
              cell.getElement().style.color = "orange";
            }
          }
        }
        return value;
      },
    },
    {
      title: "Reviewer2",
      field: "T_REVIEWER_TWO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Reviewer2 Comment",
      field: "T_REVIEWER_TWO_COMMENT",
      headerFilter: "input",
      width: 300,
      headerFilterPlaceholder: "search...",
      editor: serverDetails.PersonalNo == "158524" ? "input" : "", //147850
      editorParams: {
        search: true,
        selectContents: true,
        elementAttributes: {
          maxlength: "250",
        },
      },
      formatter: "textarea",
      formatterParams: function (cell, formatterParams) {
        var value = cell.getValue();
        var T_CHANGE_COLUMN = cell.getData().T_CHANGE_COLUMN;
        if (T_CHANGE_COLUMN != null) {
          var rowArr = T_CHANGE_COLUMN.split(",");
          for (var i = 0; i < rowArr.length; i++) {
            if (rowArr[i] == "T_REVIEWER_TWO_COMMENT") {
              cell.getElement().style.backgroundColor = "yellow";
            }
          }
        }
        return value;
      },
    },
  ];

  const updateSHEMatrixDetailsData = async (RiskID) => {
    var selectedRows = sheMatrixTable.getSelectedRows();
    var newData = [];
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      return;
    }
    selectedRows.forEach(function (item) {
      if (item._row.data.fromTab != 1) {
        newData.push(item._row.data);
      }
    });
    var negitems = [];
    if (newData.length == 0) {
      alertify.error("No valid rows selected");
      return;
    } else if (newData.length > 0) {
      newData.forEach(function (item) {
        if (!item.T_HAZARDOUS_EVENT) {
          negitems.push(item.T_HAZARDOUS_EVENT);
          alertify.error("Hazardous Event is required !");
        } else if (item.T_HAZARDOUS_EVENT.length > 250) {
          negitems.push(item.T_HAZARDOUS_EVENT);
          alertify.error(
            "more than 250 character's are not allowed in Hazardous Event !"
          );
        }
        if (!item.T_CAUSE) {
          negitems.push(item.T_CAUSE);
          alertify.error("Cause is required !");
        } else if (item.T_CAUSE.length > 250) {
          negitems.push(item.T_CAUSE);
          alertify.error(
            "more than 250 character's are not allowed in Cause !"
          );
        }
        if (!item.T_CONSEQUNCE_IMPACT) {
          negitems.push(item.T_CONSEQUNCE_IMPACT);
          alertify.error("Consequence Impact is required !");
        } else if (item.T_CONSEQUNCE_IMPACT.length > 250) {
          negitems.push(item.T_CONSEQUNCE_IMPACT);
          alertify.error(
            "more than 250 character's are not allowed in Consequence Impact !"
          );
        }
        if (!item.T_PEOPLE_ASSET) {
          negitems.push(item.T_PEOPLE_ASSET);
          alertify.error("People Asset is required !");
        } else if (item.T_PEOPLE_ASSET.length > 250) {
          negitems.push(item.T_PEOPLE_ASSET);
          alertify.error(
            "more than 250 character's are not allowed in People Asset !"
          );
        }
        if (!item.T_EXISTING_SAFEGUARD) {
          negitems.push(item.T_EXISTING_SAFEGUARD);
          alertify.error("Existing Safeguard is required !");
        } else if (item.T_EXISTING_SAFEGUARD.length > 499) {
          negitems.push(item.T_EXISTING_SAFEGUARD);
          alertify.error(
            "more than 500 character's are not allowed in Existing Safeguard !"
          );
        }
        if (!item.T_CONSEQUENCES) {
          negitems.push(item.T_CONSEQUENCES);
          alertify.error("Consequences is required !");
        }
        if (!item.T_PROBABILITY_OCCURANCE) {
          negitems.push(item.T_PROBABILITY_OCCURANCE);
          alertify.error("Probability Occurance is required !");
        }
        if (!item.T_PROBABILITY_OCCURANCE) {
          negitems.push(item.T_PROBABILITY_OCCURANCE);
          alertify.error("Probability Occurance is required !");
        }
        if (!item.T_RISK) {
          negitems.push(item.T_RISK);
          alertify.error(" Risk is required ! ");
        }
        if (item.T_REVIEWER_ONE_COMMENT != null) {
          if (item.T_REVIEWER_ONE_COMMENT.length > 250) {
            negitems.push(item.T_REVIEWER_ONE_COMMENT);
            alertify.error(
              "more than 250 character's are not allowed in Reviwer 1 comment  !"
            );
          }
        }
        if (item.T_REVIEWER_TWO_COMMENT != null) {
          if (item.T_REVIEWER_TWO_COMMENT.length > 250) {
            negitems.push(item.T_REVIEWER_TWO_COMMENT);
            alertify.error(
              " more than 250 character's are not allowed in Reviwer 2 comment  ! "
            );
          }
        }
      });
    }
    if (negitems.length == 0) {
      getUpdateAuthoritySHEMatrixForLoggeduser(newData);
    }
  };
  const updtSHEMatrixDetailData = async (newData, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "api/tsmcssf001/updateshematrixdetailsdata";
    var data = {
      newData: newData,
      userId: serverDetails.PersonalNo,
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var resp = response.data;
          if (resp && Number(resp) > 0) {
            alertify.success("Data updated");
          } else {
            alertify.errror("Data not updated");
          }

          setLabelDialogData(newData);
          handleLabelWIPModalOpen(newData);
          getSHERiskMatrixDetailsData();
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  const callSheMatrixDetail = () => {
    getSHERiskMatrixDetailsData(true);
  };
  const accessLabelDialogData = () => {
    return labelDialogData;
  };
  const handleLabelWIPModalOpen = (newData) => {
    setLabelWIPModalOpen(true);
  };
  const checkownerauthorization = (value, newToken = false) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };
      setLoading(true);

      var url = "api/tsmcssf001/getAuthUserForSHEMatrix";
      var data = {
        plantCode: serverDetails.Plant,
        compCode: serverDetails.Company,
        userId: value.T_RISK_OWNER,
        RiskID: value.T_RISKID,
      };

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else {
            resolve(response.data);
          }
        })
        .catch((e) => {
          alertify.error(
            "Error in retriving data, please try again! " + e.message
          );
          resolve(null);
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  const getUpdateAuthoritySHEMatrixForLoggeduser = async (newData) => {
    const rsp = await getAuthorization();

    setLoading(true);

    var dataArray = [];
    for (var t = 0; t < newData.length; t++) {
      //newData.forEach(function (item) {

      // if (item.T_RISK_OWNER ) {
      var data = {
        plantCode: serverDetails.Plant,
        compCode: serverDetails.Company,
        userId: newData[t].T_RISK_OWNER,
        RiskID: newData[t].T_RISKID,
      };
      var result = await checkownerauthorization(data);
      if (result.length > 0) {
        dataArray.push(newData[t]);
      } else {
        alertify.error(
          newData[t].T_RISK_OWNER +
          " is not authorized for RiskID  " +
          newData[t].T_RISKID
        );
      }
    }
    if (dataArray.length > 0) {
      updtSHEMatrixDetailData(dataArray);
    }
  };

  // download she matrix details data
  const downloadSHEMatrixDataList = () => {
    var date = new Date();
    var fileName = "SHE MATRIX Details  " + date.toString() + ".xlsx";
    sheMatrixTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };
  const handleriskchange = async (value) => {
    setSelectedRisk(value);
  };
  const handlePeopleAsset = (value) => {
    setSelectedPeopleAsset(value);
  };
  const handleConsequences = (value) => {
    setSelectedConsequences(value);
  };
  const handleProbablityOccurance = (value) => {
    setSelectedProbablityOccurance(value);
  };
  const handleriskf = (value) => {
    setSelectedhandlerisk(value);
  };
  const handleResidualProbability = (value) => {
    setSelectedResidualProbability(value);
  };
  const handleResidualConsequenceL = (value) => {
    setSelectedResidualConsequence(value);
  };
  const handleResidualRiskL = (value) => {
    setSelectedResidualRisk(value);
  };
  // End for handle SHE Matrix Details
  // Start for SHE MATRIX MASTER

  const handleDivisonMasterChange = async (value) => {
    if (value) {
      setSelectedDivisonMaster(value);
      const rsp = await getAuthorization();
      serverDetails.Plant = value.value[1];
      serverDetails.Company = value.value[2];
      getDepartmentMasterList(value.value[0]);
    } else {
      setSelectedDivisonMaster("");
    }
  };
  const handleDepartmentMasterChange = async (value) => {
    if (value) {
      setSelectedDepartmentMaster(value);
      const rsp = await getAuthorization();
      getSectionMasterList(value.value, selectedDivisonMaster.value[0]);
    } else {
      setSelectedDepartmentMaster("");
    }
  };
  const getSectionMasterList = async (value, division, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    //vendor List api call
    var url = "api/tsmcssf001/getSectionList";
    var data = {
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
      Department: value,
      Division: division,
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
            var rowArr = row;
            obj.label = row;
            obj.value = row;
            items.push(obj);
          });
          setSectionMaster(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  const handleSectionMasterChange = async (value) => {
    if (value) {
      setSelectedSectionMaster(value);
      const rsp = await getAuthorization();
      getDefaultRiskOwner(
        selectedDivisonMaster.value[0],
        selectedDepartmentMaster.value,
        value.value
      );
    } else {
      setSelectedSectionMaster("");
    }
  };
  const getDefaultRiskOwner = async (
    division,
    department,
    section,
    newToken = false
  ) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    //vendor List api call
    var url = "api/tsmcssf001/getDefaultRiskOwner";
    var data = {
      Division: division,
      Department: department,
      section: section,
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          shematrixMasterData.RISKOWNER = response.data;
          setSelectedDefaultOwner(response.data);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  const handleMstPeopleAsset = (value) => {
    if (value) {
      setSelectedMstPeopleAsset(value);
    } else {
      setSelectedMstPeopleAsset("");
    }
  };
  const handleMstConsequences = (value) => {
    if (value) {
      setSelectedMstConsequences(value);
      if (value && value.value.length != "") {
        if (
          selectedMstProbablityOccurance &&
          selectedMstProbablityOccurance.value.length != ""
        ) {
          shematrixMasterData.RISKF = CalculateRiskBasedOnInput(
            value.value,
            selectedMstProbablityOccurance.value
          );
        }
      }
    } else {
      setSelectedMstConsequences("");
    }
  };
  const handleMstProbablityOccurance = (value) => {
    if (value) {
      setSelectedMstProbablityOccurance(value);
      if (value && value.value.length != "") {
        if (
          selectedMstConsequences &&
          selectedMstConsequences.value.length != ""
        ) {
          shematrixMasterData.RISKF = CalculateRiskBasedOnInput(
            selectedMstConsequences.value,
            value.value
          );
        }
      }
    } else {
      setSelectedMstProbablityOccurance("");
    }
  };
  const handleMstriskf = (value) => {
    setSelectedMsthandlerisk(value);
  };
  const handleMstResidualProbability = (value) => {
    if (value) {
      setSelectedMstResidualProbability(value);
      if (value && value.value.length != "") {
        if (
          selectedMstResidualConsequence &&
          selectedMstResidualConsequence.value.length != ""
        ) {
          shematrixMasterData.RISKR = CalculateRiskBasedOnInput(
            selectedMstResidualConsequence.value,
            value.value
          );
        }
      }
    } else {
      setSelectedMstResidualProbability("");
    }
  };
  const handleMstResidualConsequenceL = (value) => {
    if (value) {
      setSelectedMstResidualConsequence(value);
      if (value && value.value.length != "") {
        if (
          selectedMstResidualProbability &&
          selectedMstResidualProbability.value.length != ""
        ) {
          shematrixMasterData.RISKR = CalculateRiskBasedOnInput(
            value.value,
            selectedMstResidualProbability.value
          );
        }
      }
    } else {
      setSelectedMstResidualConsequence("");
    }
  };
  const handleMstResidualRiskL = (value) => {
    setSelectedMstResidualRisk(value);
  };

  function CalculateRiskBasedOnInput(conseq, probocr) {
    var res = "";
    if (conseq == "C1" && probocr == "L1") {
      res = "R4";
    } else if (conseq == "C1" && probocr == "L2") {
      res = "R4";
    } else if (conseq == "C1" && probocr == "L3") {
      res = "R4";
    } else if (conseq == "C1" && probocr == "L4") {
      res = "R3";
    } else if (conseq == "C1" && probocr == "L5") {
      res = "R3";
    } else if (conseq == "C2" && probocr == "L1") {
      res = "R4";
    } else if (conseq == "C2" && probocr == "L2") {
      res = "R3";
    } else if (conseq == "C2" && probocr == "L3") {
      res = "R3";
    } else if (conseq == "C2" && probocr == "L4") {
      res = "R3";
    } else if (conseq == "C2" && probocr == "L5") {
      res = "R2";
    } else if (conseq == "C3" && probocr == "L1") {
      res = "R4";
    } else if (conseq == "C3" && probocr == "L2") {
      res = "R3";
    } else if (conseq == "C3" && probocr == "L3") {
      res = "R3";
    } else if (conseq == "C3" && probocr == "L4") {
      res = "R2";
    } else if (conseq == "C3" && probocr == "L5") {
      res = "R2";
    } else if (conseq == "C4" && probocr == "L1") {
      res = "R3";
    } else if (conseq == "C4" && probocr == "L2") {
      res = "R3";
    } else if (conseq == "C4" && probocr == "L3") {
      res = "R2";
    } else if (conseq == "C4" && probocr == "L4") {
      res = "R1";
    } else if (conseq == "C4" && probocr == "L5") {
      res = "R1";
    } else if (conseq == "C5" && probocr == "L1") {
      res = "R3";
    } else if (conseq == "C5" && probocr == "L2") {
      res = "R2";
    } else if (conseq == "C5" && probocr == "L3") {
      res = "R1";
    } else if (conseq == "C5" && probocr == "L4") {
      res = "R1";
    } else if (conseq == "C5" && probocr == "L5") {
      res = "R1";
    }

    return res;
  }

  const handleSHEMatrixmasterData = async (e) => {
    const value = e.target.value;
    if (e.target.name == "Line_Area") {
      if (e.target.value.length <= 100) {
        setShematrixMasterData({
          ...shematrixMasterData,
          [e.target.name]: value,
        });
      } else {
        alertify.error("Area should not greater than 100 characters !");
        return;
      }
    }
    if (e.target.name == "Job") {
      if (e.target.value.length <= 250) {
        setShematrixMasterData({
          ...shematrixMasterData,
          [e.target.name]: value,
        });
      } else {
        alertify.error("job should not greater than 250 characters !");
        return;
      }
    }
    if (e.target.name == "Activity") {
      if (e.target.value.length <= 500) {
        setShematrixMasterData({
          ...shematrixMasterData,
          [e.target.name]: value,
        });
      } else {
        alertify.error("Activity should not greater than 500 characters !");
        return;
      }
    }
    if (e.target.name == "Hazard") {
      if (e.target.value.length <= 250) {
        setShematrixMasterData({
          ...shematrixMasterData,
          [e.target.name]: value,
        });
      } else {
        alertify.error("Hazard should not greater than 250 characters !");
        return;
      }
    }
    if (e.target.name == "HAZARDOUSEVENT") {
      if (e.target.value.length <= 1000) {
        setShematrixMasterData({
          ...shematrixMasterData,
          [e.target.name]: value,
        });
      } else {
        alertify.error(
          "Hazardous event should not greater than 1000 characters !"
        );
        return;
      }
    }
    if (e.target.name == "CAUSE") {
      if (e.target.value.length <= 1000) {
        setShematrixMasterData({
          ...shematrixMasterData,
          [e.target.name]: value,
        });
      } else {
        alertify.error("cause should not greater than 1000 characters !");
        return;
      }
    }
    if (e.target.name == "CONSEQUNCEIMPACT") {
      if (e.target.value.length <= 250) {
        setShematrixMasterData({
          ...shematrixMasterData,
          [e.target.name]: value,
        });
      } else {
        alertify.error(
          "consequence impact should not greater than 250 characters !"
        );
        return;
      }
    }
    if (e.target.name == "EXISTINGSAFEGUARD") {
      if (e.target.value.length <= 500) {
        setShematrixMasterData({
          ...shematrixMasterData,
          [e.target.name]: value,
        });
      } else {
        alertify.error(
          "existing safeguard should not greater than 500 characters !"
        );
        return;
      }
    }
    if (e.target.name == "RECOMMENDATIONREDUCING") {
      if (e.target.value.length <= 500) {
        setShematrixMasterData({
          ...shematrixMasterData,
          [e.target.name]: value,
        });
      } else {
        alertify.error(
          "recommendation reducing should not greater than 500 characters !"
        );
        return;
      }
    }
    if (e.target.name == "RISKCOMMUNICATION") {
      if (e.target.value.length <= 250) {
        setShematrixMasterData({
          ...shematrixMasterData,
          [e.target.name]: value,
        });
      } else {
        alertify.error(
          "risk communication should not greater than 250 characters !"
        );
        return;
      }
    }
    if (e.target.name == "RISKF") {
      if (e.target.value.length <= 2) {
        setShematrixMasterData({
          ...shematrixMasterData,
          [e.target.name]: value,
        });
      } else {
        alertify.error("risk should not greater than 2 characters !");
        return;
      }
    }
    if (e.target.name == "RISKR") {
      if (e.target.value.length <= 2) {
        setShematrixMasterData({
          ...shematrixMasterData,
          [e.target.name]: value,
        });
      } else {
        alertify.error("residual risk should not greater than 2 characters !");
        return;
      }
    }
    if (e.target.name == "RISKOWNER") {
      if (e.target.value.length <= 8) {
        setShematrixMasterData({
          ...shematrixMasterData,
          [e.target.name]: value,
        });
      } else {
        alertify.error("Personal Number not greater that 8 character !");
        return;
      }
    }
  };
  const getDepartmentMasterList = async (value, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    //vendor List api call
    var url = "api/tsmcssf001/getDepartmentList";
    var data = {
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
      Division: value,
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
            var rowArr = row;
            obj.label = row;
            obj.value = row;
            items.push(obj);
          });

          setDepartmentMaster(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  var rx_live = /[*|\":<>[\]{}`\\()';@&$]/;
  //insert SHE Matrix data
  const insertSHEMatrixData = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }

    if (selectedDivisonMaster === undefined) {
      alertify.error("Please select Division !");
      return;
    } else if (selectedDivisonMaster.length == "") {
      alertify.error("Please select Division!");
      return;
    } else if (selectedDepartmentMaster.length == "") {
      alertify.error("Please select department!");
      return;
    } else if (selectedSectionMaster.length == "") {
      alertify.error("Please select section!");
      return;
    } else if (rx_live.test(shematrixMasterData.Line_Area)) {
      alertify.error("No special character's are allowed in Line Area!");
      return;
    } else if (shematrixMasterData.Line_Area.length > 100) {
      alertify.error(
        "more than 100 character's are not allowed in Line / Area !"
      );
      return;
    } else if (
      !shematrixMasterData.Job ||
      shematrixMasterData.Job.length == 0
    ) {
      alertify.error("Please enter job !");
      return;
    } else if (shematrixMasterData.Job.length > 250) {
      ("more than 250 character's are not allowed in Job !");
      return;
    } else if (
      !shematrixMasterData.Activity ||
      shematrixMasterData.Activity.length == 0
    ) {
      alertify.error("Please enter activity !");
      return;
    } else if (shematrixMasterData.Activity.length > 500) {
      ("more than 500 character's are not allowed in Activity !");
      return;
    } else if (
      !shematrixMasterData.Hazard ||
      shematrixMasterData.Hazard.length == 0
    ) {
      alertify.error("Please enter hazard !");
      return;
    } else if (shematrixMasterData.Hazard.length > 250) {
      ("more than 250 character's are not allowed in Hazard !");
      return;
    } else if (
      !shematrixMasterData.HAZARDOUSEVENT ||
      shematrixMasterData.HAZARDOUSEVENT.length == 0
    ) {
      alertify.error("Please enter hazardous event !");
      return;
    } else if (shematrixMasterData.HAZARDOUSEVENT.length > 1000) {
      ("more than 1000 character's are not allowed in Hazardous Event !");
      return;
    } else if (
      !shematrixMasterData.CAUSE ||
      shematrixMasterData.CAUSE.length == 0
    ) {
      alertify.error("Please enter cause !");
      return;
    } else if (shematrixMasterData.CAUSE.length > 1000) {
      ("more than 1000 character's are not allowed in cause !");
      return;
    } else if (
      !shematrixMasterData.CONSEQUNCEIMPACT ||
      shematrixMasterData.CONSEQUNCEIMPACT.length == 0
    ) {
      alertify.error("Please enter consequence impact !");
      return;
    } else if (shematrixMasterData.CONSEQUNCEIMPACT.length > 250) {
      ("more than 250 character's are not allowed in consequence impact !");
      return;
    } else if (
      !shematrixMasterData.EXISTINGSAFEGUARD ||
      shematrixMasterData.EXISTINGSAFEGUARD.length == 0
    ) {
      alertify.error("Please enter existing safeguard !");
      return;
    } else if (shematrixMasterData.EXISTINGSAFEGUARD.length > 499) {
      ("more than 500 character's are not allowed in existing safeguard !");
      return;
    } else if (selectedMstPeopleAsset.length == "") {
      alertify.error("Please select people asset!");
      return;
    } else if (selectedMstConsequences.length == "") {
      alertify.error("Please select consequences!");
      return;
    } else if (selectedMstProbablityOccurance.length == "") {
      alertify.error("Please select probability occurance !");
      return;
    } else if (
      !shematrixMasterData.RISKOWNER ||
      shematrixMasterData.RISKOWNER.length == 0
    ) {
      alertify.error("Please enter risk owner personal number !");
      return;
    } else if (
      !shematrixMasterData.RISKF ||
      shematrixMasterData.RISKF.length == 0
    ) {
      alertify.error("risk not defined !");
      return;
    } else if (shematrixMasterData.RISKF.length > 2) {
      alertify.error("more than 2 character's are not allowed in risk !");
      return;
    } else if (
      selectedMstResidualProbability &&
      selectedMstResidualProbability.value.length != "" &&
      selectedMstResidualConsequence &&
      selectedMstResidualConsequence.value.length != ""
    ) {
      if (!shematrixMasterData.RISKR || shematrixMasterData.RISKR.length == 0) {
        alertify.error("residual risk not defined ! !");
        return;
      } else if (shematrixMasterData.RISKR.length > 2) {
        alertify.error(
          "more than 2 character's are not allowed in residual risk !"
        );
        return;
      }
    } else if (shematrixMasterData.RISKCOMMUNICATION != null) {
      if (shematrixMasterData.RISKCOMMUNICATION.length > 250) {
        alertify.error(
          "more than 250 character's are not allowed in risk communication !"
        );
        return;
      }
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "/api/tsmcssf001/insertSHEMatrixData";
    var data = {
      Division: selectedDivisonMaster.value[0],
      Department: selectedDepartmentMaster.value,
      Section: selectedSectionMaster.value,
      Line:
        shematrixMasterData.Line_Area != null
          ? shematrixMasterData.Line_Area.substring(0, 100)
          : null,
      Job: shematrixMasterData.Job.substring(0, 249),
      Activity: shematrixMasterData.Activity.substring(0, 499),
      Hazard: shematrixMasterData.Hazard.substring(0, 249),
      HAZARDOUSEVENT: shematrixMasterData.HAZARDOUSEVENT.substring(0, 999),
      CAUSE: shematrixMasterData.CAUSE.substring(0, 999),
      CONSEQUNCEIMPACT: shematrixMasterData.CONSEQUNCEIMPACT.substring(0, 249),
      PEOPLEASSET: selectedMstPeopleAsset.value,
      EXISTINGSAFEGUARD: shematrixMasterData.EXISTINGSAFEGUARD.substring(
        0,
        499
      ),
      CONSEQ: selectedMstConsequences.value,
      PROBOCCR: selectedMstProbablityOccurance.value,
      RISK: shematrixMasterData.RISKF,
      RECOMMRED:
        shematrixMasterData.RECOMMENDATIONREDUCING != null
          ? shematrixMasterData.RECOMMENDATIONREDUCING.substring(0, 499)
          : null,
      RESIDPROB: selectedMstProbablityOccurance.value,
      RESDICONSEQ: selectedMstConsequences.value,
      RESDIRISK: shematrixMasterData.RISKF,
      RISKCOMM:
        shematrixMasterData.RISKCOMMUNICATION != null
          ? shematrixMasterData.RISKCOMMUNICATION.substring(0, 249)
          : null,
      RISKOWNER:
        shematrixMasterData.RISKOWNER != null
          ? shematrixMasterData.RISKOWNER.substring(0, 8)
          : null,
      plantcd: serverDetails.Plant,
      Company: serverDetails.Company,
      CreatedBy: serverDetails.PersonalNo,
      RISKID: shematrixMasterData.RISKID,
    };
    if (shematrixMasterData.RISKID.length == 0) {
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var res = response.data;
            var rkid = response.data.RiskID;
            var svdstatus = Number(response.data.SavedStatus);
            if (svdstatus == 1) {
              alertify.success(
                "Risk saved successfully with Risk-ID is : " + rkid
              );
            } else if (svdstatus == 0) {
              alertify.success("Risk not saved !");
            } else if (svdstatus == 99) {
              alertify.error(
                "Risk-ID not generated,please contact with administrator !"
              );
            } else if (svdstatus == 100) {
              alertify.error(
                "Risk already saved with this entry and Risk-ID : " + rkid
              );
            }
            //getPendingSHEmatrixmasterData();
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    }
    if (shematrixMasterData.RISKID.length > 0) {
      url = "/api/tsmcssf001/UpdateSHEMatrixRejectedData";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var res = response.data;
            var rkid = response.data.RiskID;
            var svdstatus = Number(response.data.SavedStatus);
            if (svdstatus == 1) {
              alertify.success(
                "Risk saved successfully with Risk-ID is : " + rkid
              );
            } else if (svdstatus == 0) {
              alertify.success("Risk not saved !");
            } else if (svdstatus == 99) {
              alertify.error(
                "Risk-ID not generated,please contact with administrator !"
              );
            } else if (svdstatus == 100) {
              alertify.error(
                "Risk already saved with this entry and Risk-ID : " + rkid
              );
            }
            // getPendingSHEmatrixmasterData();
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    }
  };

  // const deleteSHEMATRIXMasterData = async (newData, newToken = false) => {
  //   if (newToken) {
  //     const rsp = await getAuthorization();
  //   }
  //   var defaultOptions = {
  //     headers: {
  //       Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
  //     },
  //   };

  //   setLoading(true);
  //   var url = "api/tsmcssf002/deleteSHEMAtrixmasterdata";
  //   var data = {
  //     newData: newData,
  //     userId: serverDetails.PersonalNo,
  //     plantCode: serverDetails.Plant,
  //     compCode: serverDetails.Company,
  //   };
  //   axiosAPI
  //     .post(url, data, defaultOptions)
  //     .then((response) => {
  //       if (response.statusText != "" && response.statusText != "OK") {
  //         //reject(response.statusText);
  //       } else {
  //         var resp = response.data;
  //         if (resp && Number(resp) > 0) {
  //           alertify.success("Data deleted");
  //         } else {
  //           alertify.errror("Data not deleted");
  //         }
  //         getSHEMatrixmasterData(true);
  //       }
  //     })
  //     .finally((f) => {
  //       setLoading(false);
  //     });
  // };

  // End For SHE Matrix Master Data

  // Start SHE Matrix Gross Chart List

  const handleDivisonChartChange = async (value) => {
    if (value) {
      serverDetails.Plant = value.value[1];
      serverDetails.Company = value.value[2]
      setSelectedDivisonChart(value);
      // const rsp = await getAuthorization();  //Changed for handling refresh token by Ravi Rajput 26-07-2023
      getDepartmentChartList(value.value[0]);
    } else {
      setSelectedDivisonChart("");
    }
  };
  const getDepartmentChartList = async (value) => {
    const rsp = await getAuthorization();
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    //vendor List api call
    var url = "api/tsmcssf001/getDepartmentList";
    var data = {
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
      Division: value,
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
            var rowArr = row;
            obj.label = row;
            obj.value = row;
            items.push(obj);
          });
          setDepartmentChart(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  const handleDepartmentChartChange = async (value) => {
    if (value) {
      setSelectedDepartmentChart(value);
      // const rsp = await getAuthorization();  //Changed for handling refresh token by Ravi Rajput 26-07-2023
      getSectionChartList(value.value, selectedDivisonChart.value[0]);
    } else {
      setSelectedDepartmentChart("");
    }
  };
  const getSectionChartList = async (value, division) => {
    const rsp = await getAuthorization();
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    //vendor List api call
    var url = "api/tsmcssf001/getSectionList";
    var data = {
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
      Department: value,
      Division: division,
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
            var rowArr = row;
            obj.label = row;
            obj.value = row;
            items.push(obj);
          });
          setSectionChart(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  const handleSectionChartChange = async (value) => {
    if (value) {
      setSelectedSectionChart(value);
    } else {
      setSelectedSectionChart("");
    }
  };
  const showSHEMatrixChartData = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);

    var division =
      selectedDivisonChart != null && selectedDivisonChart.length != 0
        ? selectedDivisonChart.value[0]
        : "";
    var department =
      selectedDepartmentChart != null && selectedDepartmentChart.length != 0
        ? selectedDepartmentChart.value
        : "";
    var section =
      selectedSectionChart != null && selectedSectionChart.length != 0
        ? selectedSectionChart.value
        : "";
    var riskOwner =
      riskOwnerListselectedChart != null &&
        riskOwnerListselectedChart.length != 0
        ? riskOwnerListselectedChart.value
        : "";
    var url = "api/tsmcssf001/getSHEMatrixChartDetails";
    var data = {
      plantCd: serverDetails.Plant,
      companyCd: serverDetails.Company,
      division: division,
      depart: department,
      sect: section,
      riskOwner: riskOwner,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else if (response.data.length === 0) {
          alertify.error("No data found !");
          setSHEMATRIXChartDetails([]);
        } else {
          var rows = [];
          for (var i in response.data) {
            var rowdata = response.data[i];
            rows.push(rowdata);
          }

          setSHEMATRIXChartDetails(rows);
        }
        showResidualSHEMatrixChartData(); //Changed for handling refresh token by Ravi Rajput 26-07-2023
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  const showResidualSHEMatrixChartData = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);

    var division =
      selectedDivisonChart != null && selectedDivisonChart.length != 0
        ? selectedDivisonChart.value[0]
        : "";
    var department =
      selectedDepartmentChart != null && selectedDepartmentChart.length != 0
        ? selectedDepartmentChart.value
        : "";
    var section =
      selectedSectionChart != null && selectedSectionChart.length != 0
        ? selectedSectionChart.value
        : "";
    var riskOwner =
      riskOwnerListselectedChart != null &&
        riskOwnerListselectedChart.length != 0
        ? riskOwnerListselectedChart.value
        : "";

    var url = "api/tsmcssf001/getSHEMatrixResidualChartDetails";
    var data = {
      plantCd: serverDetails.Plant,
      companyCd: serverDetails.Company,
      division: division,
      depart: department,
      sect: section,
      riskOwner: riskOwner,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else if (response.data.length === 0) {
          alertify.error("No data found !");
          setSHEMATRIXResidualChartDetails([]);
        } else {
          var rows = [];
          for (var i in response.data) {
            var rowdata = response.data[i];
            rows.push(rowdata);
          }

          setSHEMATRIXResidualChartDetails(rows);
        }
      })

      .finally((f) => {
        setLoading(false);
      });
  };
  const updateInputValuesFromRejected = (risk) => {
    if ((risk && risk != null) || risk != undefined) {
      DivisonList(true); //
      setSelectedDivisonMaster({
        label: risk.T_DIVISION[0],
        value: risk.T_DIVISION[0],
      });
      getDepartmentMasterList(risk.T_DIVISION[0]);
      setSelectedDepartmentMaster({
        label: risk.T_DEPARTMENT,
        value: risk.T_DEPARTMENT,
      });
      getSectionMasterList(risk.T_DEPARTMENT, risk.T_DIVISION[0]);
      setSelectedSectionMaster({
        label: risk.T_SECTION,
        value: risk.T_SECTION,
      });

      shematrixMasterData.Line_Area = risk.T_LINE_AREA;
      shematrixMasterData.Job = risk.T_JOB;
      shematrixMasterData.Activity = risk.T_ACTIVITY;
      shematrixMasterData.Hazard = risk.T_HAZARD;
      shematrixMasterData.HAZARDOUSEVENT = risk.T_HAZARDOUS_EVENT;
      shematrixMasterData.CAUSE = risk.T_CAUSE;
      shematrixMasterData.CONSEQUNCEIMPACT = risk.T_CONSEQUNCE_IMPACT;
      shematrixMasterData.EXISTINGSAFEGUARD = risk.T_EXISTING_SAFEGUARD;
      shematrixMasterData.RECOMMENDATIONREDUCING =
        risk.T_RECOMMENDATION_REDUCING;
      shematrixMasterData.RISKCOMMUNICATION = risk.T_RISK_COMMUNICATION;
      shematrixMasterData.RISKF = risk.T_RISK;
      shematrixMasterData.RISKR = risk.T_RESIDUAL_RISK;
      shematrixMasterData.RISKOWNER = risk.T_RISK_OWNER;
      shematrixMasterData.RISKID = risk.T_RISKID;
      setSelectedMstPeopleAsset({
        label: risk.T_PEOPLE_ASSET,
        value: risk.T_PEOPLE_ASSET,
      });
      setSelectedMstConsequences({
        label: risk.T_CONSEQUENCES,
        value: risk.T_CONSEQUENCES,
      });
      setSelectedMstProbablityOccurance({
        label: risk.T_PROBABILITY_OCCURANCE,
        value: risk.T_PROBABILITY_OCCURANCE,
      });
      setSelectedMstResidualProbability({
        label: risk.T_RESIDUAL_PROBABILITY,
        value: risk.T_RESIDUAL_PROBABILITY,
      });
      setSelectedMstResidualConsequence({
        label: risk.T_RESIDUAL_CONSEQUENCES,
        value: risk.T_RESIDUAL_CONSEQUENCES,
      });
    }
  };
  const updateInputValues = (risk) => {
    if ((risk && risk != null) || risk != undefined) {
      DivisonList(true); //
      setSelectedDivisonMaster({
        label: risk.T_DIVISION[0],
        value: risk.T_DIVISION[0],
      });
      getDepartmentMasterList(risk.T_DIVISION[0]);
      setSelectedDepartmentMaster({
        label: risk.T_DEPARTMENT,
        value: risk.T_DEPARTMENT,
      });
      getSectionMasterList(risk.T_DEPARTMENT, risk.T_DIVISION[0]);
      setSelectedSectionMaster({
        label: risk.T_SECTION,
        value: risk.T_SECTION,
      });

      shematrixMasterData.Line_Area = risk.T_LINE_AREA;
      shematrixMasterData.Job = risk.T_JOB;
      shematrixMasterData.Activity = risk.T_ACTIVITY;
      shematrixMasterData.Hazard = risk.T_HAZARD;
      shematrixMasterData.HAZARDOUSEVENT = risk.T_HAZARDOUS_EVENT;
      shematrixMasterData.CAUSE = risk.T_CAUSE;
      shematrixMasterData.CONSEQUNCEIMPACT = risk.T_CONSEQUNCE_IMPACT;
      shematrixMasterData.EXISTINGSAFEGUARD = risk.T_EXISTING_SAFEGUARD;
      shematrixMasterData.RECOMMENDATIONREDUCING =
        risk.T_RECOMMENDATION_REDUCING;
      shematrixMasterData.RISKCOMMUNICATION = risk.T_RISK_COMMUNICATION;
      shematrixMasterData.RISKF = risk.T_RISK;

      setSelectedMstPeopleAsset({
        label: risk.T_PEOPLE_ASSET,
        value: risk.T_PEOPLE_ASSET,
      });
      setSelectedMstConsequences({
        label: risk.T_CONSEQUENCES,
        value: risk.T_CONSEQUENCES,
      });

      setSelectedMstConsequences({
        label: risk.T_CONSEQUENCES,
        value: risk.T_CONSEQUENCES,
      });
      setSelectedMstProbablityOccurance({
        label: risk.T_PROBABILITY_OCCURANCE,
        value: risk.T_PROBABILITY_OCCURANCE,
      });
    }
  };

  const updateApproverSHEMatrixData = async () => {
    var selectedRows = sheMatrixPendingTable.getSelectedRows();
    var newData = [];
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      return;
    }
    selectedRows.forEach(function (item) {
      if (item._row.data.fromTab != 1) {
        newData.push(item._row.data);
      }
    });
    var negitems = [];
    if (newData.length == 0) {
      alertify.error("No valid rows selected");
      return;
    } else if (newData.length > 0) {
      newData.forEach(function (item) {
        if (item.T_RISK_APPRV_STATUS == "Pending") {
          negitems.push(item.T_RISK_APPRV_STATUS);
          alertify.error("Approver Status is required !");
          return;
        }
        if (item.T_RISK_APPRV_STATUS == "Approve") {
          item.T_RISK_APPRV_STATUS == "Y";
        }
        if (item.T_RISK_APPRV_STATUS == "Reject") {
          item.T_RISK_APPRV_STATUS == "R";
          if (item.T_RISK_APPRV_COMMENT == null) {
            negitems.push(item.T_RISK_APPRV_COMMENT);
            alertify.error("Reject remarks is required !");
            return;
          } else if (item.T_RISK_APPRV_COMMENT.length == 0) {
            negitems.push(item.T_RISK_APPRV_COMMENT);
            alertify.error("blank remarks is not allowed !");
            return;
          } else if (item.T_RISK_APPRV_COMMENT.length > 250) {
            negitems.push(item.T_RISK_APPRV_COMMENT);
            alertify.error(
              "more than 250 character's are not allowed in Cause !"
            );
            return;
          }
        }
      });
    }
    if (negitems.length == 0) {
      updateApprovedFinalSHEMatrixData(newData, true); //Changed for handling refresh token by Ravi Rajput 26-07-2023
    }
  };
  const updateApprovedFinalSHEMatrixData = async (
    newData,
    newToken = false
  ) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "api/tsmcssf001/updateapprovalshematrixdetailsdata";
    var data = {
      newData: newData,
      userId: serverDetails.PersonalNo,
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var resp = response.data;
          if (resp && Number(resp) > 0 && Number(resp) < 99) {
            alertify.success("Risk status updated");
          } else if (resp && Number(resp) == 99) {
            alertify.error(
              "you are not authorised to approve or reject the risk ! "
            );
          } else {
            alertify.error("Risk status not updated");
          }
          getPendingSHEmatrixmasterData(); //Changed for handling refresh token by Ravi Rajput 26-07-2023
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  // for DCI action
  const updateDCIApproverSHEMatrixData = async () => {
    var selectedRows = sheMatrixResidualPendingTable.getSelectedRows();
    var newData = [];
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      return;
    }
    selectedRows.forEach(function (item) {
      if (item._row.data.fromTab != 1) {
        newData.push(item._row.data);
      }
    });
    var negitems = [];
    if (newData.length == 0) {
      alertify.error("No valid rows selected");
      return;
    } else if (newData.length > 0) {
      newData.forEach(function (item) {
        if (item.T_RISK_APPRV_STATUS == "Pending") {
          negitems.push(item.T_RISK_APPRV_STATUS);
          alertify.error("Approver Status is required !");
          return;
        }
        if (item.T_RISK_APPRV_STATUS == "Approve") {
          item.T_RISK_APPRV_STATUS == "Y";
        }
        if (item.T_RISK_APPRV_STATUS == "Reject") {
          item.T_RISK_APPRV_STATUS == "R";
          if (item.T_RISK_APPRV_COMMENT == null) {
            negitems.push(item.T_RISK_APPRV_COMMENT);
            alertify.error("Reject remarks is required !");
            return;
          } else if (item.T_RISK_APPRV_COMMENT.length == 0) {
            negitems.push(item.T_RISK_APPRV_COMMENT);
            alertify.error("blank remarks is not allowed !");
            return;
          } else if (item.T_RISK_APPRV_COMMENT.length > 250) {
            negitems.push(item.T_RISK_APPRV_COMMENT);
            alertify.error(
              "more than 250 character's are not allowed in Cause !"
            );
            return;
          }
        }
      });
    }
    if (negitems.length == 0) {
      updateDCIApprovedFinalSHEMatrixData(newData, true); //Changed for handling refresh token by Ravi Rajput 26-07-2023
    }
  };
  const updateDCIApprovedFinalSHEMatrixData = async (
    newData,
    newToken = false
  ) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    var url = "api/tsmcssf001/updateDCIapprovalshematrixdetailsdata";
    var data = {
      newData: newData,
      userId: serverDetails.PersonalNo,
      plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var resp = response.data;
          if (resp && Number(resp) > 0 && Number(resp) < 99) {
            alertify.success("Risk status updated");
          } else if (resp && Number(resp) == 99) {
            alertify.error(
              "you are not authorised to approve or reject the risk ! "
            );
          } else {
            alertify.error("Risk status not updated");
          }
          getPendingResidualSHEmatrixmasterData(); // Changed for handling refresh token by Ravi Rajput 26-07-2023
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  // download she matrix DCI Pending Approval data
  const downloadSHEMatrixResidualPendingDataList = () => {
    var date = new Date();
    var fileName =
      "Pending DCI's approval SHE Matrix  " + date.toString() + ".xlsx";
    sheMatrixResidualPendingTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };
  //End For SHE Matrix Gross Chart List
  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Surround System"
        page="SHE Matrix"
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
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab
                      label="New Risk Entry"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                      icon={<AppsIcon />}
                    />
                    <Tab
                      label="Risk Matrix Details"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                      icon={<AppsIcon />}
                    />
                    <Tab
                      label="Risk Chart"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                      icon={<AppsIcon />}
                    />
                    <Tab
                      label="Pending/Draft New Risk"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                      icon={<AppsIcon />}
                    />
                    <Tab
                      label="Pending for DCI Approval"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                      icon={<AppsIcon />}
                    />
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
                        <Grid item xs={3}>
                          <MDTypography variant="h6" color="white">
                            SHE Risk Entry
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Save Risk" arrow>
                            <IconButton
                              id="insertnewRisk"
                              name="insertnewRisk"
                              color="white"
                              onClick={() => insertSHEMatrixData(true)}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox px={3} py={1} style={{ paddingTop: "18px" }}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <div className="radio-btn-container">
                            <div
                              className="radio-btn"
                              onClick={() => {
                                setTripType("new");
                              }}
                            >
                              <input
                                type="radio"
                                value={tripType}
                                name="tripType"
                                checked={tripType == "new"}
                              />
                              <label for="first">New Entry</label>
                            </div>
                            <div
                              className="radio-btn"
                              onClick={() => {
                                setTripType("newref");
                                setALLCoilModalOpen(true);
                              }}
                            >
                              <input
                                type="radio"
                                value={tripType}
                                name="tripType"
                                checked={tripType == "newref"}
                              />
                              <label for="first">
                                New Entry With Reference
                              </label>
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <TSMCSSFSHEMatrixDetailsfoRef
                            open={allcoilModalOpen}
                            close={setALLCoilModalOpen}
                            updateInputValues={updateInputValues}
                            style={{ width: "120rem" }}
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox px={4} py={6} style={{ minHeight: "50rem" }}>
                      <Grid container spacing={4}></Grid>

                      <Grid container spacing={6} id="Entry-form">
                        <Grid item xs={3} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Division<span class="required_validtion">*</span>
                          </MDTypography>
                          <ReactSelect
                            id="divisionm"
                            options={divisionMaster}
                            onChange={handleDivisonMasterChange}
                            style={{ marginTop: "1rem" }}
                            value={selectedDivisonMaster}
                          />
                        </Grid>
                        <Grid item xs={3} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Department<span class="required_validtion">*</span>
                          </MDTypography>
                          <ReactSelect
                            id="departmentm"
                            options={departmentMaster}
                            onChange={handleDepartmentMasterChange}
                            style={{ marginTop: "1rem" }}
                            value={selectedDepartmentMaster}
                          />
                        </Grid>
                        <Grid item xs={3} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Section<span class="required_validtion">*</span>
                          </MDTypography>

                          <ReactSelect
                            id="sectionm"
                            options={sectionMaster}
                            onChange={handleSectionMasterChange}
                            style={{ marginTop: "1rem" }}
                            value={selectedSectionMaster}
                          />
                        </Grid>
                        <Grid item xs={3} style={{ zIndex: 5 }}></Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={6}
                        style={{ marginTop: "-30px" }}
                      >
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Line / Area
                          </MDTypography>

                          <TextField
                            id="Line_Area"
                            name="Line_Area"
                            onChange={handleSHEMatrixmasterData}
                            value={shematrixMasterData.Line_Area}
                            fullWidth
                            multiline
                            rows={2}
                            maxRows={4}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Job<span class="required_validtion">*</span>
                          </MDTypography>

                          <TextField
                            id="Job"
                            name="Job"
                            onChange={handleSHEMatrixmasterData}
                            value={shematrixMasterData.Job}
                            fullWidth
                            multiline
                            rows={2}
                            maxRows={4}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Activity<span class="required_validtion">*</span>
                          </MDTypography>

                          <TextField
                            id="Activity"
                            name="Activity"
                            onChange={handleSHEMatrixmasterData}
                            value={shematrixMasterData.Activity}
                            fullWidth
                            multiline
                            rows={2}
                            maxRows={4}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Hazard<span class="required_validtion">*</span>
                          </MDTypography>

                          <TextField
                            id="Hazard"
                            name="Hazard"
                            onChange={handleSHEMatrixmasterData}
                            value={shematrixMasterData.Hazard}
                            fullWidth
                            multiline
                            rows={2}
                            maxRows={4}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={6}
                        style={{ marginTop: "-30px" }}
                      >
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Hazardous Event
                            <span class="required_validtion">*</span>
                          </MDTypography>

                          <TextField
                            id="HAZARDOUS_EVENT"
                            name="HAZARDOUSEVENT"
                            onChange={handleSHEMatrixmasterData}
                            value={shematrixMasterData.HAZARDOUSEVENT}
                            fullWidth
                            multiline
                            rows={2}
                            maxRows={4}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Cause<span class="required_validtion">*</span>
                          </MDTypography>

                          <TextField
                            id="MSTRiskCause"
                            name="CAUSE"
                            onChange={handleSHEMatrixmasterData}
                            value={shematrixMasterData.CAUSE}
                            fullWidth
                            multiline
                            rows={2}
                            maxRows={4}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Consequence Impact
                            <span class="required_validtion">*</span>
                          </MDTypography>

                          <TextField
                            id="MSTCONSEQUNCEIMPACT"
                            name="CONSEQUNCEIMPACT"
                            onChange={handleSHEMatrixmasterData}
                            value={shematrixMasterData.CONSEQUNCEIMPACT}
                            fullWidth
                            multiline
                            rows={2}
                            maxRows={4}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Existing Safeguard
                            <span class="required_validtion">*</span>
                          </MDTypography>

                          <TextField
                            id="mstEXISTINGSAFEGUARD"
                            name="EXISTINGSAFEGUARD"
                            onChange={handleSHEMatrixmasterData}
                            value={shematrixMasterData.EXISTINGSAFEGUARD}
                            fullWidth
                            multiline
                            rows={2}
                            maxRows={4}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={6}
                        style={{ marginTop: "-30px" }}
                      >
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            People/Asset
                            <span class="required_validtion">*</span>
                          </MDTypography>
                          <ReactSelect
                            id="mstriskpeopleasset"
                            options={assetdataList}
                            onChange={handleMstPeopleAsset}
                            style={{ marginTop: "1rem" }}
                            value={selectedMstPeopleAsset}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Consequences
                            <span class="required_validtion">*</span>
                          </MDTypography>
                          <ReactSelect
                            id="mstConsequences"
                            options={ConsequencesList}
                            onChange={handleMstConsequences}
                            style={{ marginTop: "1rem" }}
                            value={selectedMstConsequences}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Probablity Occurance
                            <span class="required_validtion">*</span>
                          </MDTypography>
                          <ReactSelect
                            id="probablityOccurance"
                            options={probablityOccuranceList}
                            onChange={handleMstProbablityOccurance}
                            style={{ marginTop: "1rem" }}
                            value={selectedMstProbablityOccurance}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Risk<span class="required_validtion">*</span>
                          </MDTypography>
                          <MDInput
                            id="riskf"
                            name="RISKF"
                            onChange={handleSHEMatrixmasterData}
                            value={shematrixMasterData.RISKF}
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={6}
                        style={{ marginTop: "-30px" }}
                      >
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Residual Probability
                          </MDTypography>
                          <ReactSelect
                            id="mstresidualprobability"
                            name="mstresidualprobability"
                            options={residualprobabilityList}
                            onChange={handleMstResidualProbability}
                            style={{ marginTop: "1rem" }}
                            disabled={true}
                            value={selectedMstResidualProbability}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Residual Consequences
                          </MDTypography>
                          <ReactSelect
                            id="mstresidualconsequenceL"
                            options={residualconsequenceList}
                            onChange={handleMstResidualConsequenceL}
                            style={{ marginTop: "1rem" }}
                            disabled={true}
                            value={selectedMstResidualConsequence}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Residual Risk
                          </MDTypography>

                          <MDInput
                            id="mstresidualriskL"
                            name="RISKR"
                            onChange={handleSHEMatrixmasterData}
                            value={shematrixMasterData.RISKR}
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={6}
                        style={{ marginTop: "-30px" }}
                      >
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Recommendation Reducing
                          </MDTypography>

                          <TextField
                            id="MSTRECOMMENDATIONREDUCING"
                            name="RECOMMENDATIONREDUCING"
                            onChange={handleSHEMatrixmasterData}
                            value={shematrixMasterData.RECOMMENDATIONREDUCING}
                            fullWidth
                            multiline
                            rows={2}
                            maxRows={4}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Risk Communication
                          </MDTypography>
                          <TextField
                            id="MSTRISKCOMMUNICATION"
                            name="RISKCOMMUNICATION"
                            onChange={handleSHEMatrixmasterData}
                            value={shematrixMasterData.RISKCOMMUNICATION}
                            fullWidth
                            multiline
                            rows={2}
                            maxRows={4}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Risk Owner<span class="required_validtion">*</span>
                          </MDTypography>

                          <MDInput
                            id="riskowner"
                            name="RISKOWNER"
                            onChange={handleSHEMatrixmasterData}
                            value={shematrixMasterData.RISKOWNER}
                            fullWidth
                          />
                        </Grid>
                        {/* <Grid item xs={3}>
                          <MDButton
                            size="small"
                            color="info"
                            onClick={() => insertSHEMatrixData(true)}
                            style={{ marginTop: "1.5rem" }}
                          >
                            Create Risk
                          </MDButton>
                        </Grid> */}
                        <Grid item xs={3}>
                          {/* <MDButton
                          size="small"
                          color="info"
                          onClick={() => insertSHEMatrixData(true)}
                          style={{ marginTop: "2rem" }}
                        >
                          Save Risk
                        </MDButton> */}
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
                      py={1}
                      px={2}
                      variant="gradient"
                      bgColor="info"
                      borderRadius="lg"
                      coloredShadow="info"
                    >
                      <MDTypography variant="h6" color="white">
                        Filters
                      </MDTypography>
                    </MDBox>
                    <MDBox px={3} py={1}>
                      <Grid container spacing={1}>
                        <Grid item xs={1.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Division
                          </MDTypography>
                          <ReactSelect
                            options={division}
                            onChange={handleDivisonChange}
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
                            Department
                          </MDTypography>
                          <ReactSelect
                            options={department}
                            onChange={handleDepartmentChange}
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
                            Section
                          </MDTypography>
                          <ReactSelect
                            options={section}
                            onChange={handleSectionChange}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            RiskID
                          </MDTypography>
                          <ReactMultiSelect
                            id="risk"
                            options={riskdataList}
                            onChange={handleriskchange}
                            style={{ marginTop: "1rem" }}
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
                            People/Asset
                          </MDTypography>
                          <ReactSelect
                            id="peopleasset"
                            options={assetdataList}
                            onChange={handlePeopleAsset}
                            style={{ marginTop: "1rem" }}
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
                            Consequences
                          </MDTypography>
                          <ReactSelect
                            id="Consequences"
                            options={ConsequencesList}
                            onChange={handleConsequences}
                            style={{ marginTop: "1rem" }}
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
                            Probablity Occurance
                          </MDTypography>
                          <ReactSelect
                            id="probablityOccurance"
                            options={probablityOccuranceList}
                            onChange={handleProbablityOccurance}
                            style={{ marginTop: "1rem" }}
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
                            Risk
                          </MDTypography>
                          <ReactSelect
                            id="riskf"
                            options={riskList}
                            onChange={handleriskf}
                            style={{ marginTop: "1rem" }}
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
                            Residual Probability
                          </MDTypography>
                          <ReactSelect
                            id="residualprobability"
                            options={residualprobabilityList}
                            onChange={handleResidualProbability}
                            style={{ marginTop: "1rem" }}
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
                            Residual Consequences
                          </MDTypography>
                          <ReactSelect
                            id="residualconsequenceL"
                            options={residualconsequenceList}
                            onChange={handleResidualConsequenceL}
                            style={{ marginTop: "1rem" }}
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
                            Residual Risk
                          </MDTypography>
                          <ReactSelect
                            id="residualriskL"
                            options={residualriskList}
                            onChange={handleResidualRiskL}
                            style={{ marginTop: "1rem" }}
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
                            Risk Owner
                          </MDTypography>
                          <ReactSelect
                            id="riskowner"
                            options={riskOwnerListselect}
                            onChange={handleRiskOwnerList}
                            style={{ marginTop: "1rem" }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <MDButton
                            size="small"
                            color="info"
                            onClick={() => getSHERiskMatrixDetailsData(true)}
                            style={{ marginTop: "1.5rem" }}
                          >
                            Display
                          </MDButton>
                          <TSMCSSFSHEMatrixDetails
                            open={coilModalOpen}
                            close={setCoilModalOpen}
                            RiskID={riskID}
                          />
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
                      py={1}
                      px={2}
                      variant="gradient"
                      bgColor="info"
                      borderRadius="lg"
                      coloredShadow="info"
                    >
                      <MDTypography variant="h6" color="white">
                        Filters
                      </MDTypography>
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
                            Division
                          </MDTypography>
                          <ReactSelect
                            id="divisionchart"
                            options={divisionChart}
                            onChange={handleDivisonChartChange}
                            style={{ marginTop: "1rem" }}
                          />
                        </Grid>
                        <Grid item xs={2.5} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Department
                          </MDTypography>
                          <ReactSelect
                            id="departmentchart"
                            options={departmentChart}
                            onChange={handleDepartmentChartChange}
                            style={{ marginTop: "1rem" }}
                          />
                        </Grid>
                        <Grid item xs={2.5} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Section
                          </MDTypography>

                          <ReactSelect
                            id="sectionchart"
                            options={sectionChart}
                            onChange={handleSectionChartChange}
                            style={{ marginTop: "1rem" }}
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
                            Risk Owner
                          </MDTypography>
                          <ReactSelect
                            id="riskownerchart"
                            options={riskOwnerListselectChart}
                            onChange={handleRiskOwnerListChart}
                            style={{ marginTop: "1rem" }}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <MDButton
                            size="small"
                            color="info"
                            onClick={() => showSHEMatrixChartData(true)}
                            style={{ marginTop: "1.5rem" }}
                          >
                            Display
                          </MDButton>
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
                      py={1}
                      px={2}
                      variant="gradient"
                      bgColor="info"
                      borderRadius="lg"
                      coloredShadow="info"
                    >
                      <MDTypography variant="h6" color="white">
                        Filters
                      </MDTypography>
                    </MDBox>
                    <MDBox px={3} py={1}>
                      <Grid container spacing={1}>
                      <Grid item xs={3} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Division<span class="required_validtion">*</span>
                          </MDTypography>
                          <ReactSelect
                            id="divisionm"
                            options={divisionMaster}
                            onChange={handleDivisonMasterChange}
                            style={{ marginTop: "1rem" }}
                            value={selectedDivisonMaster}
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
                            Section
                          </MDTypography>
                          <ReactSelect
                            id="sectionpending"
                            options={pendingSectionMaster}
                            onChange={handlependingSectionMasterChange}
                            style={{ marginTop: "1rem" }}
                          />
                        </Grid>
                        <Grid item xs={2.5} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Approval Type
                          </MDTypography>
                          <ReactSelect
                            id="ApprovalType"
                            options={FilterApproverOptions}
                            onChange={handleApproverOptionsChange}
                            style={{ marginTop: "1rem" }}
                          />
                        </Grid>

                        <Grid item xs={3}>
                          <MDButton
                            size="small"
                            color="info"
                            onClick={() => getPendingSHEmatrixmasterData(true)}
                            style={{ marginTop: "1.5rem" }}
                          >
                            Display
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
                        <Grid item xs={3}>
                          <MDTypography variant="h6" color="white">
                            SHE Matrix Pending Details For DCI Approval
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="update" arrow>
                            <IconButton
                              color="white"
                              onClick={() => updateDCIApproverSHEMatrixData()}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download" arrow>
                            <IconButton
                              color="white"
                              onClick={() =>
                                downloadSHEMatrixResidualPendingDataList()
                              }
                            >
                              <DownloadForOfflineIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <MDBox px={3} py={3}>
                      <Grid container spacing={12}>
                      <Grid item xs={3} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="medium"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Division<span class="required_validtion">*</span>
                          </MDTypography>
                          <ReactSelect
                            id="divisionm"
                            options={divisionMaster}
                            onChange={handleDivisonMasterChange}
                            style={{ marginTop: "1rem" }}
                            value={selectedDivisonMaster}
                          /> 
                        </Grid>
                        <Grid item xs={3}>
                          <MDButton
                            size="small"
                            color="info"
                            onClick={() => getPendingResidualSHEmatrixmasterData()}
                            style={{ marginTop: "1.5rem" }}
                          >
                            Display
                          </MDButton>
                        </Grid>
                        <Grid item xs={12}>
                          <div id="SHEMatrixResidualPendingTables"></div>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
              </Grid>
              <Grid item xs={12}>
                <>
                  {tabValue == 0 && <Card></Card>}
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
                          <Grid item xs={3}>
                            <MDTypography variant="h6" color="white">
                              SHE Matrix Details
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <Tooltip title="update" arrow>
                              <IconButton
                                color="white"
                                onClick={() => updateSHEMatrixDetailsData()}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download" arrow>
                              <IconButton
                                color="white"
                                onClick={() => downloadSHEMatrixDataList()}
                              >
                                <DownloadForOfflineIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </MDBox>
                      <MDBox px={3} py={3}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <div id="SHEMatrixTable"></div>
                          </Grid>
                        </Grid>
                        <TSMCSSFSHEMatrixDetailsFileUpload
                          open={labelWIPModalOpen}
                          close={setLabelWIPModalOpen}
                          inputValues={accessLabelDialogData}
                          callSheMatrixDetail={callSheMatrixDetail}
                        />
                      </MDBox>
                    </Card>
                  )}
                  {tabValue == 2 && (
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
                          <Grid item xs={3}>
                            <MDTypography variant="h6" color="white">
                              SHE Matrix Gross Risk Chart
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </MDBox>
                      <MDBox px={3} py={3}>
                        <Grid container spacing={1}>
                          <Grid item xs={5}>
                            <TableContainer component={Paper}>
                              <TSMCSSFChartSHEMatrixDetails
                                open={chartCoilModalOpen}
                                close={setChartCoilModalOpen}
                                inputValues={accessLabelNewDialogData}
                                RiskCount={sHEMATRIXChartDetails[4].colval}
                                conseq={sHEMATRIXChartDetails[4].coln.substring(
                                  0,
                                  2
                                )}
                                proboccr={sHEMATRIXChartDetails[4].coln.substring(
                                  2,
                                  4
                                )}
                                division={
                                  selectedDivisonChart != null &&
                                    selectedDivisonChart.length != 0
                                    ? selectedDivisonChart.value[0]
                                    : ""
                                }
                                department={
                                  selectedDepartmentChart != null &&
                                    selectedDepartmentChart.length != 0
                                    ? selectedDepartmentChart.value
                                    : ""
                                }
                                section={
                                  selectedSectionChart != null &&
                                    selectedSectionChart.length != 0
                                    ? selectedSectionChart.value
                                    : ""
                                }
                                riskowner={
                                  riskOwnerListselectedChart != null &&
                                    riskOwnerListselectedChart.length != 0
                                    ? riskOwnerListselectedChart.value
                                    : ""
                                }
                              />
                              <Table
                                sx={{ minWidth: 650, minHeight: 500 }}
                                aria-label="simple1 table1"
                                style={{ border: "1" }}
                              >
                                <TableBody>
                                  <TableRow>
                                    <TableCell
                                      colSpan={6}
                                      align="center"
                                      style={{
                                        fontSize: "1.5rem",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Gross Risk
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      colSpan={6}
                                      align="center"
                                      style={{
                                        fontSize: "1.3rem",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      <CurrentDateOnly></CurrentDateOnly>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      L5
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[4].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[4].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "yellow",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[9].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[9].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "yellow",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[14].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[14].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "red",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[19].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[19].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "red",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[24].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[24].colval}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      L4
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[3].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[3].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[8].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[8].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "yellow",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[13].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[13].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "red",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[18].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[18].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "red",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[23].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[23].colval}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      L3
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#79B220",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[2].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[2].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[7].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[7].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[12].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[12].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "yellow",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[17].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[17].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "red",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[22].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[22].colval}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      L2
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#79B220",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[1].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[1].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[6].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[6].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[11].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[11].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[16].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[16].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "yellow",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[21].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[21].colval}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow sx={{}}>
                                    <TableCell
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      L1
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#79B220",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[0].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[0].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#79B220",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[5].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[5].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#79B220",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[10].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[10].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[15].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[15].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleChartMatrixview(
                                          sHEMATRIXChartDetails[20].coln
                                        )
                                      }
                                    >
                                      {sHEMATRIXChartDetails[20].colval}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow sx={{}}>
                                    <TableCell></TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      C1
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      C2
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      C3
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      C4
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      C5
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                          <Grid item xs={1}></Grid>
                          <Grid item xs={5}>
                            <TableContainer component={Paper}>
                              <Table
                                sx={{ minWidth: 650, minHeight: 500 }}
                                aria-label="simple1 table1"
                                style={{ border: "1" }}
                              >
                                <TableBody>
                                  <TableRow>
                                    <TableCell
                                      colSpan={6}
                                      align="center"
                                      style={{
                                        fontSize: "1.5rem",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Residual Gross Risk
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      colSpan={6}
                                      align="center"
                                      style={{
                                        fontSize: "1.3rem",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      <CurrentDateOnly></CurrentDateOnly>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      L5
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[4].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "yellow",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[9].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "yellow",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[14].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "red",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[19].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "red",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[24].colval}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      L4
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[3].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[8].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "yellow",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[13].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "red",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[18].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "red",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[23].colval}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      L3
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#79B220",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[2].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[7].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[12].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "yellow",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[17].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "red",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[22].colval}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      L2
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#79B220",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[1].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[6].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[11].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[16].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "yellow",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[21].colval}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow sx={{}}>
                                    <TableCell
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      L1
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#79B220",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[0].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#79B220",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[5].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#79B220",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[10].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[15].colval}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        backgroundColor: "#1A73E8",
                                        fontSize: "1rem",
                                        minHeight: "5rem",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sHEMATRIXResidualChartDetails[20].colval}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow sx={{}}>
                                    <TableCell></TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      C1
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      C2
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      C3
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      C4
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                      }}
                                    >
                                      C5
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                          <Grid item xs={1}></Grid>
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
                          <Grid item xs={3}>
                            <MDTypography variant="h6" color="white">
                              SHE Matrix Pending Details For Approval
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <Tooltip title="update" arrow>
                              <IconButton
                                color="white"
                                onClick={() => updateApproverSHEMatrixData()}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download" arrow>
                              <IconButton
                                color="white"
                                onClick={() =>
                                  downloadSHEMatrixPendingDataList()
                                }
                              >
                                <DownloadForOfflineIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </MDBox>
                      <MDBox px={3} py={3}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <div id="SHEMatrixPendingTables"></div>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  )}
                  {tabValue == 4 && <Card></Card>}
                </>
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}