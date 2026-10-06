import React, { useEffect, useState, useRef, forwardRef } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import ReactSelect from "components/Select/ReactSelect";
import MonthPicker from "components/DateTime/DatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import MDButton from "components/MDButton";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import { styled } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import IconButton from "@mui/material/IconButton";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";

import MaxWidthinternal from "./Modal4/LDCR004INTERNALDATA";
import MaxWidthinternalFI from "./Modal4/LDCR004INTERNALfinalinspection";
import MaxWidthDensity from "./Modal4/LDCR004density";
import MaxWidthmixpaint from "./Modal4/LDCR004mixpaint";
import Maxpanel from "./Modal4/LDCR004panel";
import Maxporosity from "./Modal4/LDCR004porosity";
import Maxpull from "./Modal4/LDCR004pullofadhesion";
import MaxSpecific from "./Modal4/LDCR004specific";
import Maxtaber from "./Modal4/LDCR004taberabrasion";

import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";
import { TextField } from "@mui/material";
import set from "date-fns/esm/set/index";

export default function LDCR004() {
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
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);

  const [reviewedBy, setReviewedBy] = useState("");

  const [GainA, setGainA] = useState("");
  const [GainM, setGainM] = useState("");

  const [orderNo, setOrderNo] = useState("");
  const [item, setitem] = useState("");
  // const [matno, setmatno] = useState("");
  const [crdate, setcrdate] = useState("");
  const [printdate, setprintdate] = useState("");
  // const [heatno, setheatno] = useState("");
  const [pipeno, setpipeno] = useState("");
  const [rmno, setrmno] = useState("");
  const [instrumentName, setInstrumentName] = useState("");
  // const [instrumentName2, setInstrumentName2] = useState("");
  const [instrumentId, setInstrumentId] = useState("");
  // const [instrumentId2, setInstrumentId2] = useState("");
  const [wiNo, setWiNo] = useState("");
  const [repairmat, setrepairmat] = useState("");

  // Used for blasting report
  const [instrumentName1, setInstrumentName1] = useState("");
  const [instrumentId1, setInstrumentId1] = useState("");

  const [instrumentName2, setInstrumentName2] = useState("");
  const [instrumentId2, setInstrumentId2] = useState("");

  const [instrumentName3, setInstrumentName3] = useState("");
  const [instrumentId3, setInstrumentId3] = useState("");

  const [instrumentName4, setInstrumentName4] = useState("");
  const [instrumentId4, setInstrumentId4] = useState("");

  const [instrumentName5, setInstrumentName5] = useState("");
  const [instrumentId5, setInstrumentId5] = useState("");

  const handleOrderNoChange = (e) => {
    setOrderNo(e.target.value);
  };

  const handleitemChange = (e) => {
    setitem(e.target.value);
  };

  // const handlematnoChange = (e) => {
  //   setmatno(e.target.value);
  // };

  // const handleheatnoChange = (e) => {
  //   setheatno(e.target.value);
  // };

  const handlepipenoChange = (e) => {
    setpipeno(e.target.value);
  };

  const [valueRadio, setValueRadio] = React.useState("1");

  const [printoption, setprintoption] = React.useState("R");
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [selectedpShift, setSelectedpShift] = React.useState(null);
  const [selectedunit, setselectedunit] = React.useState(null);

  var customerTable = React.createRef();

  const [selectedSpecimen, setSelectedSpecimen] = useState(null);

  const toInputUppercase = (e) => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };

  const handleReviewedByChange = (e) => {
    setReviewedBy(e.target.value);
  };

  const handleGainA = (e) => {
    setGainA(e.target.value);
  };

  const handleGainM = (e) => {
    setGainM(e.target.value);
  };

  const handleShiftChange = (value) => {
    setSelectedShift(value);
  };

  const handlepShiftChange = (value) => {
    setSelectedpShift(value);
  };

  const handleunitChange = (value) => {
    setselectedunit(value);
  };

  const ShiftType = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "N", value: "N" },
  ];

    const printShift = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "N", value: "N" },
  ];

  // const UnitType = [
  //   { label: "N/mm", value: "N/mm" },
  //   { label: "Kg/cm", value: "Kg/cm" },
  // ];

  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // const checkInlet = () => {
  //   if (!orderNo) {
  //     alertify.error("Please fill Order No");
  //     return false;
  //   } else if (!item) {
  //     alertify.error("Please fill Item");
  //     return false;
  //   } else if (!instrumentName) {
  //     alertify.error("Please fill Instrument Name");
  //     return false;
  //   } else if (!instrumentId) {
  //     alertify.error("Please fill Instrument Id");
  //     return false;
  //   } else if (!reviewedBy) {
  //     alertify.error("Please fill Reviewed By");
  //     return false;
  //   } else if (!wiNo) {
  //     alertify.error("Please fill Procedure / WI No");
  //     return false;
  //   } else if (!crdate) {
  //     alertify.error("Please select Date");
  //     return false;
  //   }
  //   return true;
  // };

  const handleOpenModal = () => {
    if (
      selectedrepType?.value === null ||
      selectedrepType?.value === undefined
    ) {
      alertify.error("Please choose a Report Type");
    }
    console.log("selectedrepType?.value", selectedrepType?.value);
    if (selectedrepType?.value === "4A") {
      setModalType("INTERNAL");
    } else if (selectedrepType?.value === "4B") {
      setModalType("INTERNALFI");
    } else if (selectedrepType?.value === "4C") {
      setModalType("DENSITY");
        } else if (selectedrepType?.value === "4D") {
      setModalType("MIX");
    }     else if (selectedrepType?.value === "4E") {
      setModalType("PANEL");
    } else if (selectedrepType?.value === "4F") {
      setModalType("POROSITY");
    } else if (selectedrepType?.value === "4G") {
      setModalType("PULL");
    } else if (selectedrepType?.value === "4H") {
      setModalType("SPECIFIC");
    } else if (selectedrepType?.value === "4I") {
      setModalType("TABER");
    }

    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
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
          GetreportTyp(token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
    fetchData();
  }, []);

  const validateUser = async (token) => {
    try {
      var plant = "";
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
      var pageName = "LDCR004";

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
            Promise.all([GetreportTyp(items[0], accessToken)]).finally(() => {
              resolve();
            });
          }
        })
        .catch((f) => {
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

      var url = "api/LDCR004/GetreportTyp";
      let data = {
        plant: value?.value,
      };
      console.log("plant", plant);
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

  const handlePlantChange = (value) => {
    handleClearAll();
    setSelectrepType([]);
    // setAllValues({});

    setSelectedPlant(value);
    if (value) {
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([GetreportTyp(value, token.accessToken)]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const handlerepTypeChange = (value) => {
    setSelectrepType(value);
     setselectedunit("");
     setInstrumentName("");
     setInstrumentName1("");
     setInstrumentName2("");
     setInstrumentName3("");
     setInstrumentName4("");
     setInstrumentName5("");
     setInstrumentId("");
     setInstrumentId1("");
     setInstrumentId2("");
     setInstrumentId3("");
     setInstrumentId4("");
     setInstrumentId5("");
    //  setWiNo("");
  };

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
    // setPipeCreationTableData([]);
    if (event.target.value === "2");
    // selectedEndFacingTable([]);
  };

  const handleprintoptionchange = (event) => {
    setprintoption(event.target.value);
    // setPipeCreationTableData([]);
    if (event.target.value === "S");
    // selectedEndFacingTable([]);
  };

  const handleClearAll = () => {
    console.log("Inside handleClearAll");
    setSelectedPlant([]);
    setSelectrepType([]);
    setcrdate(null);
    setOrderNo("");
    setitem("");
    setReviewedBy("");
    console.log("reviewedBy: ", reviewedBy);
    setInstrumentName("");
    setInstrumentId("");
    setInstrumentName2("");
    setInstrumentId2("");
    setWiNo("");
    setrepairmat("");
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Compliance"
        page="Internal - Lab Reports"
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

                      <Grid item xs={2.5} style={{ zIndex: 3 }}>
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

                      <Grid item xs={1.5} style={{ zIndex: 3 }}>
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

                      <Grid item xs={0.5} style={{ zIndex: 3 }}>
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

                      {/* <Grid item xs={1.5} style={{ zIndex: 3 }}>
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
                          Date<span style={{ color: "red" }}>*</span>
                        </MDTypography>
                        <MonthPicker
                          name="crdate"
                          value={crdate}
                          onChange={(date) => setcrdate(date)}
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
                          Shift*
                        </MDTypography>
                        <ReactSelect
                          options={ShiftType}
                          onChange={(e) => {
                            handleShiftChange(e);
                          }}
                          value={selectedShift}
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
                          Print Date<span style={{ color: "red" }}>*</span>
                        </MDTypography>
                        <MonthPicker
                          name="printdate"
                          value={printdate}
                          onChange={(date) => setprintdate(date)}
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
                          Print Shift*
                        </MDTypography>
                        <ReactSelect
                          options={printShift}
                          onChange={(e) => {
                            handlepShiftChange(e);
                          }}
                          value={selectedpShift}
                        />
                      </Grid>

                      {/* <Grid item xs={1} style={{ zIndex: 3 }}>
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
                        />
                      </Grid> */}

                      {/* <Grid item xs={1.5} style={{ zIndex: 3 }}>
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
                        />
                      </Grid> */}

                      {selectedrepType?.value === "2" && (
                        <Grid item xs={6}>
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
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="IS 1608-1 Latest Edition"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio />}
                                label="ISO 6892-1 Latest Edition"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      )}

                      {selectedrepType?.value === "4" && (
                        <Grid item xs={6}>
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
                      {(selectedrepType?.value === "9" ||
                        selectedrepType?.value === "18") && (
                        <Grid item xs={6}>
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

                      {(selectedrepType?.value === "13" ||
                        selectedrepType?.value === "14") && (
                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Gain (AUT)
                          </MDTypography>
                          <MDInput
                            name="GainA"
                            iseditable="false"
                            onChange={handleGainA}
                          />
                        </Grid>
                      )}

                      {(selectedrepType?.value === "13" ||
                        selectedrepType?.value === "14") && (
                        <Grid item xs={3}>
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
                            onChange={handleGainM}
                          />
                        </Grid>
                      )}

                      <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Reviewed By<span style={{ color: "red" }}>*</span>
                        </MDTypography>
                        <MDInput
                          name="RevievedBy"
                          // iseditable="false"
                          value={reviewedBy}
                          onChange={handleReviewedByChange}
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
                          Procedure / WI No
                          <span style={{ color: "red" }}>*</span>
                        </MDTypography>
                        <MDInput
                          name="wiNo"
                          onChange={(e) => {
                            setWiNo(e.target.value);
                          }}
                        />
                      </Grid>

                      {/* {selectedrepType?.value === "2G" && (
                        <>
                          <Grid item xs={2}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Repair Material
                              <span style={{ color: "red" }}>*</span>
                            </MDTypography>
                            <MDInput
                              name="repairmat"
                              onChange={(e) => {
                                setrepairmat(e.target.value);
                              }}
                            />
                          </Grid>
                        </>
                      )} */}

                      <Grid item xs={1}>
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

                      {/*  5  Instrument Name & Instrument IDs For blasting report */}
                      {(selectedrepType?.value === "3A" ||
                        selectedrepType?.value === "3B") && (
                        <Grid container spacing={2} mt={1}>
                          <Grid item xs={12}>
                            <MDTypography variant="h6">
                              Used Instrument Details
                            </MDTypography>
                          </Grid>

                          {/* Instrument 1 */}
                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument Name 1"
                              value={instrumentName1}
                              onChange={(e) =>
                                setInstrumentName1(e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument Name 2"
                              value={instrumentName2}
                              onChange={(e) =>
                                setInstrumentName2(e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument Name 3"
                              value={instrumentName3}
                              onChange={(e) =>
                                setInstrumentName3(e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument Name 4"
                              value={instrumentName4}
                              onChange={(e) =>
                                setInstrumentName4(e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument Name 5"
                              value={instrumentName5}
                              onChange={(e) =>
                                setInstrumentName5(e.target.value)
                              }
                            />
                          </Grid>

                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument ID 1"
                              value={instrumentId1}
                              onChange={(e) => setInstrumentId1(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument ID 2"
                              value={instrumentId2}
                              onChange={(e) => setInstrumentId2(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument ID 3"
                              value={instrumentId3}
                              onChange={(e) => setInstrumentId3(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument ID 4"
                              value={instrumentId4}
                              onChange={(e) => setInstrumentId4(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument ID 5"
                              value={instrumentId5}
                              onChange={(e) => setInstrumentId5(e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      )}

                       {/*  3 Instrument Name & Instrument IDs For blasting report */}
                      {// selectedrepType?.value === "3C" ||
                      // selectedrepType?.value === "3" ||
                      selectedrepType?.value === "4G" && (
                        // selectedrepType?.value === "3F" ||
                        // selectedrepType?.value === "3G" ||
                        // selectedrepType?.value === "3H" ||
                        // selectedrepType?.value === "3I" ||
                        // selectedrepType?.value === "3J"

                        <Grid container spacing={2} mt={1}>
                          <Grid item xs={12}>
                            <MDTypography variant="h6">
                              Used Instrument Details
                            </MDTypography>
                          </Grid>

                          {/* Instrument 1 */}
                          <Grid item xs={2.5}>
                            <TextField
                              fullWidth
                              label="Instrument Name 1"
                              value={instrumentName1}
                              onChange={(e) =>
                                setInstrumentName1(e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={2.5}>
                            <TextField
                              fullWidth
                              label="Instrument Name 2"
                              value={instrumentName2}
                              onChange={(e) =>
                                setInstrumentName2(e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={2.5}>
                            <TextField
                              fullWidth
                              label="Instrument Name 3"
                              value={instrumentName3}
                              onChange={(e) =>
                                setInstrumentName3(e.target.value)
                              }
                            />
                          </Grid>
                            <Grid item xs={2.5}>
                            <TextField
                              fullWidth
                              label="Instrument Name 4"
                              value={instrumentName4}
                              onChange={(e) =>
                                setInstrumentName4(e.target.value)
                              }
                            />
                          </Grid>

                          <Grid item xs={2.5}>
                            <TextField
                              fullWidth
                              label="Instrument ID 1"
                              value={instrumentId1}
                              onChange={(e) => setInstrumentId1(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={2.5}>
                            <TextField
                              fullWidth
                              label="Instrument ID 2"
                              value={instrumentId2}
                              onChange={(e) => setInstrumentId2(e.target.value)}
                            />
                          </Grid>

                          <Grid item xs={2.5}>
                            <TextField
                              fullWidth
                              label="Instrument ID 3"
                              value={instrumentId3}
                              onChange={(e) => setInstrumentId3(e.target.value)}
                            />
                          </Grid>
                            <Grid item xs={2.5}>
                            <TextField
                              fullWidth
                              label="Instrument ID 4"
                              value={instrumentId4}
                              onChange={(e) => setInstrumentId4(e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      )}

                      {/*  3 Instrument Name & Instrument IDs For blasting report */}
                      {// selectedrepType?.value === "3C" ||
                      // selectedrepType?.value === "3" ||
                      selectedrepType?.value === "3E" && (
                        // selectedrepType?.value === "3F" ||
                        // selectedrepType?.value === "3G" ||
                        // selectedrepType?.value === "3H" ||
                        // selectedrepType?.value === "3I" ||
                        // selectedrepType?.value === "3J"

                        <Grid container spacing={2} mt={1}>
                          <Grid item xs={12}>
                            <MDTypography variant="h6">
                              Used Instrument Details
                            </MDTypography>
                          </Grid>

                          {/* Instrument 1 */}
                          <Grid item xs={2}>
                            <TextField
                              fullWidth
                              label="Instrument Name 1"
                              value={instrumentName1}
                              onChange={(e) =>
                                setInstrumentName1(e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              fullWidth
                              label="Instrument Name 2"
                              value={instrumentName2}
                              onChange={(e) =>
                                setInstrumentName2(e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              fullWidth
                              label="Instrument Name 3"
                              value={instrumentName3}
                              onChange={(e) =>
                                setInstrumentName3(e.target.value)
                              }
                            />
                          </Grid>

                          <Grid item xs={2}>
                            <TextField
                              fullWidth
                              label="Instrument ID 1"
                              value={instrumentId1}
                              onChange={(e) => setInstrumentId1(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              fullWidth
                              label="Instrument ID 2"
                              value={instrumentId2}
                              onChange={(e) => setInstrumentId2(e.target.value)}
                            />
                          </Grid>

                          <Grid item xs={2}>
                            <TextField
                              fullWidth
                              label="Instrument ID 3"
                              value={instrumentId3}
                              onChange={(e) => setInstrumentId3(e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      )}

                      {/*  2  Instrument Name & Instrument IDs For blasting report */}
                      {
                      (selectedrepType?.value === "4H" ||
                        // selectedrepType?.value === "3E" ||
                        selectedrepType?.value === "4F" ||
                        selectedrepType?.value === "4I" ||
                        selectedrepType?.value === "3H" ||
                        // selectedrepType?.value === "3I" ||
                        selectedrepType?.value === "3J"||
                       selectedrepType?.value === "3M"||
                      selectedrepType?.value === "3L") && (
                        <Grid container spacing={2} mt={1}>
                          <Grid item xs={12}>
                            <MDTypography variant="h6">
                              Used Instrument Details
                            </MDTypography>
                          </Grid>

                          {/* Instrument 1 */}
                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument Name 1"
                              value={instrumentName1}
                              onChange={(e) =>
                                setInstrumentName1(e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument Name 2"
                              value={instrumentName2}
                              onChange={(e) =>
                                setInstrumentName2(e.target.value)
                              }
                            />
                          </Grid>

                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument ID 1"
                              value={instrumentId1}
                              onChange={(e) => setInstrumentId1(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument ID 2"
                              value={instrumentId2}
                              onChange={(e) => setInstrumentId2(e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      )}

                      {/*  1  Instrument Name & Instrument IDs For blasting report */}
                      {(selectedrepType?.value === "3C"||
                        selectedrepType?.value === "3I"
                      ) && (
                        // selectedrepType?.value === "3D" ||
                        // selectedrepType?.value === "3E" ||
                        // selectedrepType?.value === "3F" ||
                        // selectedrepType?.value === "3G" ||
                        // selectedrepType?.value === "3H" ||
                        // selectedrepType?.value === "3I" ||
                        // selectedrepType?.value === "3J"

                        <Grid container spacing={2} mt={1}>
                          <Grid item xs={12}>
                            <MDTypography variant="h6">
                              {/* Used Instrument Details */}
                            </MDTypography>
                          </Grid>

                          {/* Instrument 1 */}
                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument Name 1"
                              value={instrumentName1}
                              onChange={(e) =>
                                setInstrumentName1(e.target.value)
                              }
                            />
                          </Grid>

                          <Grid item xs={2.4}>
                            <TextField
                              fullWidth
                              label="Instrument ID 1"
                              value={instrumentId1}
                              onChange={(e) => setInstrumentId1(e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      )}
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
                          <IconButton color="white" onClick={handleOpenModal}>
                            <PictureAsPdfIcon />
                          </IconButton>
                        </Tooltip>

                        {modalType === "INTERNAL" && (
                          <MaxWidthinternal
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            // matno={matno}
                            // heatno={heatno}
                            pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            wiNo={wiNo}
printdate={printdate} 
printShift={selectedpShift}
                            repairmat={repairmat}
                            instrumentName1={instrumentName1}
                            instrumentId1={instrumentId1}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                            // instrumentName3={instrumentName3}
                            // instrumentId3={instrumentId3}
                            // instrumentName4={instrumentName4}
                            // instrumentId4={instrumentId4}
                            // instrumentName5={instrumentName5}
                            // instrumentId5={instrumentId5}
                          />
                        )}

                        {modalType === "INTERNALFI" && (
                          <MaxWidthinternalFI
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            // matno={matno}
                            // heatno={heatno}
                            pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            wiNo={wiNo}
printdate={printdate} 
printShift={selectedpShift}
                            repairmat={repairmat}
                            instrumentName1={instrumentName1}
                            instrumentId1={instrumentId1}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                            // instrumentName3={instrumentName3}
                            // instrumentId3={instrumentId3}
                            // instrumentName4={instrumentName4}
                            // instrumentId4={instrumentId4}
                            // instrumentName5={instrumentName5}
                            // instrumentId5={instrumentId5}
                          />
                        )}

                        {modalType === "DENSITY" && (
                          <MaxWidthDensity
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            // matno={matno}
                            // heatno={heatno}
                            pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            wiNo={wiNo}
printdate={printdate} 
printShift={selectedpShift}
                            repairmat={repairmat}
                            instrumentName1={instrumentName1}
                            instrumentId1={instrumentId1}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                            // instrumentName3={instrumentName3}
                            // instrumentId3={instrumentId3}
                            // instrumentName4={instrumentName4}
                            // instrumentId4={instrumentId4}
                            // instrumentName5={instrumentName5}
                            // instrumentId5={instrumentId5}
                          />
                        )}

                        {modalType === "MIX" && (
                          <MaxWidthmixpaint
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            // matno={matno}
                            // heatno={heatno}
                            pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            wiNo={wiNo}
printdate={printdate} 
printShift={selectedpShift}
                            repairmat={repairmat}
                            instrumentName1={instrumentName1}
                            instrumentId1={instrumentId1}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                            instrumentName3={instrumentName3}
                            instrumentId3={instrumentId3}
                            // instrumentName4={instrumentName4}
                            // instrumentId4={instrumentId4}
                            // instrumentName5={instrumentName5}
                            // instrumentId5={instrumentId5}
                          />
                        )}

                        {modalType === "PANEL" && (
                          <Maxpanel
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            // matno={matno}
                            // heatno={heatno}
                            pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            wiNo={wiNo}
printdate={printdate} 
printShift={selectedpShift}
                            repairmat={repairmat}
                            instrumentName1={instrumentName1}
                            instrumentId1={instrumentId1}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                            instrumentName3={instrumentName3}
                            instrumentId3={instrumentId3}
                            instrumentName4={instrumentName4}
                            instrumentId4={instrumentId4}
                            // instrumentName5={instrumentName5}
                            // instrumentId5={instrumentId5}
                          />
                        )}

                        {modalType === "POROSITY" && (
                          <Maxporosity
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            // matno={matno}
                            // heatno={heatno}
                            pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            wiNo={wiNo}
printdate={printdate} 
printShift={selectedpShift}
                            repairmat={repairmat}
                            instrumentName1={instrumentName1}
                            instrumentId1={instrumentId1}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                            // instrumentName3={instrumentName3}
                            // instrumentId3={instrumentId3}
                            // instrumentName4={instrumentName4}
                            // instrumentId4={instrumentId4}
                            // instrumentName5={instrumentName5}
                            // instrumentId5={instrumentId5}
                          />
                        )}

                        {modalType === "PULL" && (
                          <Maxpull
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            // matno={matno}
                            // heatno={heatno}
                            pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            wiNo={wiNo}
printdate={printdate} 
printShift={selectedpShift}
                            repairmat={repairmat}
                            instrumentName1={instrumentName1}
                            instrumentId1={instrumentId1}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                            instrumentName3={instrumentName3}
                            instrumentId3={instrumentId3}
                            instrumentName4={instrumentName4}
                            instrumentId4={instrumentId4}
                            // instrumentName5={instrumentName5}
                            // instrumentId5={instrumentId5}
                          />
                        )}

                        {modalType === "SPECIFIC" && (
                          <MaxSpecific
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            // matno={matno}
                            // heatno={heatno}
                            pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            wiNo={wiNo}
printdate={printdate} 
printShift={selectedpShift}
                            repairmat={repairmat}
                            instrumentName1={instrumentName1}
                            instrumentId1={instrumentId1}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                            // instrumentName3={instrumentName3}
                            // instrumentId3={instrumentId3}
                            // instrumentName4={instrumentName4}
                            // instrumentId4={instrumentId4}
                            // instrumentName5={instrumentName5}
                            // instrumentId5={instrumentId5}
                          />
                        )}

                         {modalType === "TABER" && (
                          <Maxtaber
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            // matno={matno}
                            // heatno={heatno}
                            pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            wiNo={wiNo}
printdate={printdate} 
printShift={selectedpShift}
                            repairmat={repairmat}
                            instrumentName1={instrumentName1}
                            instrumentId1={instrumentId1}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                            // instrumentName3={instrumentName3}
                            // instrumentId3={instrumentId3}
                            // instrumentName4={instrumentName4}
                            // instrumentId4={instrumentId4}
                            // instrumentName5={instrumentName5}
                            // instrumentId5={instrumentId5}
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
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
