import React, { useEffect, useState, useRef, forwardRef } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
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
import moment from "moment"; // Import moment.js


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

import MaxWidthDialogAir from "./Modal2/LDCR002AirEntModal";
import MaxWidthDialogCROSS from "./Modal2/LDCR002CROSSModal";
import MaxWidthDialogEpoxy from "./Modal2/LDCR002epoxyModal";
import MaxWidthDialogIMPACT from "./Modal2/LDCR002impactModal";
import MaxWidthDialogDUST from "./Modal2/LDCR002DustModal";
import MaxWidthDialogPeel from "./Modal2/LDCR002PeelModal";
import MaxWidthDialogTrial from "./Modal2/LDCR002TrialModal";
import MaxWidthDialogREPAIR from "./Modal2/LDCR002RepairModal";
import MaxWidthDialogFinalinsp from "./Modal2/LDCR002FinalInspection";
import MaxWidthDialogThick from "./Modal2/LDCR002Thickness";
import MaxWidthDialogapplication from "./Modal2/LDCR002Application";
import DialogINLETModel from "./Modal2/LDCR002InletModal";
import DialogBlastingModel from "./Modal2/LDCR002BlastingModel";

import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";
import { TextField } from "@mui/material";
import set from "date-fns/esm/set/index";

export default function LDCR002() {
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

    const [pipelist, setpipelist] = useState([]);
    const [slitlist, setSlitlist] = useState([]);
    // const [selectedpipelist, setselectedpipelist] = React.useState([]);
        // const [selectedpipelist, setselectedpipelist] = React.useState(null); // Changed from []
const [selectedpipelist, setselectedpipelist] = React.useState([]);

  const [reviewedBy, setReviewedBy] = useState("");

  const [GainA, setGainA] = useState("");
  const [GainM, setGainM] = useState("");

  const [orderNo, setOrderNo] = useState("");
  const [item, setitem] = useState("");
  // const [matno, setmatno] = useState("");
  const [crdate, setcrdate] = useState("");
  // const [heatno, setheatno] = useState("");
  // const [pipeno, setpipeno] = useState("");
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

const handleOrderNoChange = (e) => {
  setOrderNo(e.target.value);
  // GetPipenomulti(); // This call will now need to pass the token
};

const handleitemChange = (e) => {
  setitem(e.target.value);
  // GetPipenomulti(); // This call will now need to pass the token
};

  // const handlematnoChange = (e) => {
  //   setmatno(e.target.value);
  // };

  // const handlecrdateChange = (e) => {
  //   setcrdate(e.target.value);
  // };

  // const handleheatnoChange = (e) => {
  //   setheatno(e.target.value);
  // };

  // const handlepipenoChange = (e) => {
  //   setpipeno(e.target.value);
  // };

  const [valueRadio, setValueRadio] = React.useState("1");

  const [printoption, setprintoption] = React.useState("R");
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [selectedunit, setselectedunit] = React.useState(null);
  const [printdate, setprintdate] = useState("");
  const [selectedpShift, setSelectedpShift] = React.useState(null);

      // Format printdate before passing to modals
    const formattedPrintDate = printdate ? moment(printdate).format('DD.MM.YYYY') : '';


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

const hideCoatingFields =
  selectedrepType?.value === "2C" ||
  selectedrepType?.value === "2L";

  const hidePrintingFields =
  selectedrepType?.value === "2H" ||
  selectedrepType?.value === "2I" ||
  selectedrepType?.value === "2J" ||
  selectedrepType?.value === "2K" ||
  selectedrepType?.value === "2D" ||
  selectedrepType?.value === "2E" ||
  selectedrepType?.value === "2X" ||
    selectedrepType?.value === "2B"  ;

  console.log(hideCoatingFields);
  console.log(hidePrintingFields);


  const UnitType = [
    { label: "N/mm", value: "N/mm" },
    { label: "Kg/cm", value: "Kg/cm" },
  ];

  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const checkInlet = () => {
    if (!orderNo) {
      alertify.error("Please fill Order No");
      return false;
    } else if (!item) {
      alertify.error("Please fill Item");
      return false;
    } else if (!instrumentName) {
      alertify.error("Please fill Instrument Name");
      return false;
    } else if (!instrumentId) {
      alertify.error("Please fill Instrument Id");
      return false;
    } else if (!reviewedBy) {
      alertify.error("Please fill Reviewed By");
      return false;
    } else if (!wiNo) {
      alertify.error("Please fill Procedure / WI No");
      return false;
    } else if (!crdate) {
      alertify.error("Please select Date");
      return false;
    }
    return true;
  };

  // Define GetPipenomulti to accept accessToken
    const GetPipenomulti = (accessToken) => {
      return new Promise((resolve) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        };

        var url = "api/LDCR002/GetPipenomulti";
        let roundsectionmillValue = "4";

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
          roundsectionmill: roundsectionmillValue
        };

        axiosAPI.post(url, data, defaultOptions)
          .then(response => {
            let formattedPipeList = [];
            // Transform the data into { label: "...", value: "..." } format
            response.data?.forEach((row) => {
              if (row && row.length > 0) {
                formattedPipeList.push({ label: row[0], value: row[0] });
              }
            });
            setpipelist(formattedPipeList); // Update the pipelist state
            console.log("Fetched and formatted pipe data:", formattedPipeList);
          })
          .catch(error => {
            console.error("Error fetching pipe list:", error);
            alertify.error("Failed to fetch pipe list.");
          })
          .finally(() => {
            resolve();
          });
      });
    };


  useEffect(() => {
    if(selectedrepType?.value === "2J" ){
    if (crdate && orderNo && item ) {
      GetAuthorization().then(token => {
        GetPipenomulti(token.accessToken); // Pass the accessToken here
      });
    }
  }
  }, [crdate, orderNo, item]);


const handlepipelistChange = (value) => {
  setselectedpipelist(value);

  // If you need all selected pipe numbers
  const selectedPipeNos = value?.map(pipe => pipe.value) || [];

  console.log("Selected Pipes:", selectedPipeNos);

  // If getSlitnomill supports multiple calls
  GetAuthorization().then((token) => {
    Promise.all(
      selectedPipeNos.map(pipeNo =>
        getSlitnomill(pipeNo, token.accessToken)
      )
    ).finally(() => {
      setLoading(false);
    });
  });
};

  const handleOpenModal = () => {
    if (
      selectedrepType?.value === null ||
      selectedrepType?.value === undefined
    ) {
      alertify.error("Please choose a Report Type");
    }
        if (serverDetails.PersonalNo !== '808535') {
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
        }}


    console.log("selectedrepType?.value", selectedrepType?.value);
    if (selectedrepType?.value === "2A") {
      setModalType("AIR");
    } else if (selectedrepType?.value === "2B") {
      setModalType("CROSS");
    } else if (selectedrepType?.value === "2D") {
      setModalType("EPOXY");
    } else if (selectedrepType?.value === "2E") {
      setModalType("IMPACT");
    } else if (selectedrepType?.value === "2C") {
      setModalType("DUST");
    } else if (selectedrepType?.value === "2F") {
      if (selectedunit?.value === null || selectedunit?.value === undefined) {
        alertify.error("Please choose Unit*");
      } else {
        setModalType("PEEL");
      }
    } else if (selectedrepType?.value === "2G") {
      setModalType("REPAIR");
    } else if (selectedrepType?.value === "2X") {
      setModalType("TRIAL");
    } else if (selectedrepType?.value === "2H") {
      // const errFlag = checkInlet();
      // if (errFlag)
        setModalType("INLET");
    } else if (selectedrepType?.value === "2I") {
      setModalType("BLASTING");
    } else if (selectedrepType?.value === "2L") {
      setModalType("FINAL INSPECTION");
    } else if (selectedrepType?.value === "2K") {
      setModalType("THICKNESS");
    } else if (selectedrepType?.value === "2J") {
      setModalType("APPLICATION");
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
      var pageName = "LDCR002";

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
        // }\
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

      var url = "api/LDCR002/GetreportTyp";
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
     setInstrumentId("");
     setInstrumentId1("");
     setInstrumentId2("");
     setInstrumentId3("");
     setInstrumentId4("");
     setWiNo("");

  };

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
    // setPipeCreationTableData([]);
    if (event.target.value === "2");
    // selectedEndFacingTable([]);
  };



    const handlepShiftChange = (value) => {
    setSelectedpShift(value);
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
          setpipelist([]); // Clear the pipe options list
      setselectedpipelist(null); // Clear the selected pipe
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Compliance"
        page="External - Field Reports"
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


                      {!hideCoatingFields  && (
                      <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Coating Date<span style={{ color: "red" }}>*</span>
                        </MDTypography>
                        <MonthPicker
                          name="crdate"
                          value={crdate}
                          onChange={(date) => setcrdate(date)}
                        />
                      </Grid>
                        )}

                      {!hideCoatingFields  && (
                      <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Coating Shift*
                        </MDTypography>
                        <ReactSelect
                          options={ShiftType}
                          onChange={(e) => {
                            handleShiftChange(e);
                          }}
                          value={selectedShift}
                        />
                      </Grid>
                      )}



                                   {!hidePrintingFields && (
                                           <Grid item xs={1} style={{ zIndex: 3 }}>
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
                                            )}

                        {!hidePrintingFields && (

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

                                           {(selectedrepType.value === '2J')
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
                                                Pipe No
                                              </MDTypography>
<ReactSelect
  id="pipeno1"
  options={pipelist}
  value={selectedpipelist}
  onChange={handlepipelistChange}
  isMulti
/>
                                            </Grid>
                                            )}

                      {/* Instrument Name & Instrument ID */}
                      {(selectedrepType?.value !== "2C" && selectedrepType?.value !== "2I" && selectedrepType?.value !== "2L" )&& (
                        <>
                          {/* Instrument Name */}
                          <Grid item xs={1.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Instrument Name
                              <span style={{ color: "red" }}>*</span>
                            </MDTypography>
                            <MDInput
                              name="instrumentName"
                              onChange={(e) => {
                                setInstrumentName(e.target.value);
                              }}
                            />
                          </Grid>

                          {/* Instrument ID */}

                          <Grid item xs={1.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Instrument ID
                              <span style={{ color: "red" }}>*</span>
                            </MDTypography>
                            <MDInput
                              name="instrumentId"
                              onChange={(e) => {
                                setInstrumentId(e.target.value);
                              }}
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
                        </>
                      )}

                      {selectedrepType?.value === "2G" && (
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
                      )}

                      {selectedrepType?.value === "2F" && (
                        <>
                          <Grid item xs={1.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Unit
                              <span style={{ color: "red" }}>*</span>
                            </MDTypography>
                            <ReactSelect
                              options={UnitType}
                              onChange={(e) => {
                                handleunitChange(e);
                              }}
                              value={selectedunit}
                            />
                          </Grid>
                        </>
                      )}

                      {/* Procedure / WI No */}
                      {(selectedrepType?.value === "2I" ||
                      selectedrepType?.value === "2L"
                        ) && (
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
                      )}

                      {(selectedrepType?.value === "2X" || selectedrepType?.value === "2K") && (
                        <>
                          <Grid item xs={1.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Instrument Name 2
                              <span style={{ color: "red" }}>*</span>
                            </MDTypography>
                            <MDInput
                              name="instrumentName2"
                              onChange={(e) => {
                                setInstrumentName2(e.target.value);
                              }}
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
                              Instrument ID 2
                              <span style={{ color: "red" }}>*</span>
                            </MDTypography>
                            <MDInput
                              name="instrumentId2"
                              onChange={(e) => {
                                setInstrumentId2(e.target.value);
                              }}
                            />
                          </Grid>
                        </>
                      )}

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

                      {/* Instrument Name & Instrument IDs For blasting report */}
                      {(selectedrepType?.value === "2I" || selectedrepType?.value === "2L")&& (
                        <Grid container spacing={2} mt={-1}>
                          <Grid item xs={12}>
                            <MDTypography variant="h6">
                              Used Instrument Details
                            </MDTypography>
                          </Grid>

                          {/* Instrument 1 */}
                          <Grid item xs={3}>
                            <TextField
                              fullWidth
                              label="Instrument Name 1"
                              value={instrumentName1}
                              onChange={(e) =>
                                setInstrumentName1(e.target.value)
                              }
                            />
                          </Grid>

                          <Grid item xs={3}>
                            <TextField
                              fullWidth
                              label="Instrument ID 1"
                              value={instrumentId1}
                              onChange={(e) => setInstrumentId1(e.target.value)}
                            />
                          </Grid>

                          {/* Instrument 2 */}
                          <Grid item xs={3}>
                            <TextField
                              fullWidth
                              label="Instrument Name 2"
                              value={instrumentName2}
                              onChange={(e) =>
                                setInstrumentName2(e.target.value)
                              }
                            />
                          </Grid>

                          <Grid item xs={3}>
                            <TextField
                              fullWidth
                              label="Instrument ID 2"
                              value={instrumentId2}
                              onChange={(e) => setInstrumentId2(e.target.value)}
                            />
                          </Grid>

                          {/* Instrument 3 */}
                          <Grid item xs={3}>
                            <TextField
                              fullWidth
                              label="Instrument Name 3"
                              value={instrumentName3}
                              onChange={(e) =>
                                setInstrumentName3(e.target.value)
                              }
                            />
                          </Grid>

                          <Grid item xs={3}>
                            <TextField
                              fullWidth
                              label="Instrument ID 3"
                              value={instrumentId3}
                              onChange={(e) => setInstrumentId3(e.target.value)}
                            />
                          </Grid>

                          {/* Instrument 4 */}
                          <Grid item xs={3}>
                            <TextField
                              fullWidth
                              label="Instrument Name 4"
                              value={instrumentName4}
                              onChange={(e) =>
                                setInstrumentName4(e.target.value)
                              }
                            />
                          </Grid>

                          <Grid item xs={3}>
                            <TextField
                              fullWidth
                              label="Instrument ID 4"
                              value={instrumentId4}
                              onChange={(e) => setInstrumentId4(e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      )}

                    {(selectedrepType?.value === "2J")&& (
                        <Grid container spacing={2} mt={-1}>
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
                              label="Instrument ID 1"
                              value={instrumentId1}
                              onChange={(e) => setInstrumentId1(e.target.value)}
                            />
                          </Grid>

                          {/* Instrument 2 */}
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
                              label="Instrument ID 2"
                              value={instrumentId2}
                              onChange={(e) => setInstrumentId2(e.target.value)}
                            />
                          </Grid>

                          {/* Instrument 3 */}
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
                              label="Instrument ID 3"
                              value={instrumentId3}
                              onChange={(e) => setInstrumentId3(e.target.value)}
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
                        {(selectedrepType?.value === "2A")&& (modalType === "AIR") && (
                          <MaxWidthDialogAir
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            //matno={matno}
                            //heatno={heatno}
                            //pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            instrumentName={instrumentName}
                            instrumentId={instrumentId}
                            wiNo={wiNo}
                           printdate={formattedPrintDate}
                            selectedpShift={selectedpShift}
                          />
                        )}
                        {modalType === "CROSS" && (
                          <MaxWidthDialogCROSS
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            //matno={matno}
                            //heatno={heatno}
                            //pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            instrumentName={instrumentName}
                            instrumentId={instrumentId}
                            wiNo={wiNo}
                           printdate={formattedPrintDate}
                            selectedpShift={selectedpShift}
                          />
                        )}
                        {modalType === "EPOXY" && (
                          <MaxWidthDialogEpoxy
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            //matno={matno}
                            //heatno={heatno}
                            //pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            instrumentName={instrumentName}
                            instrumentId={instrumentId}
                            wiNo={wiNo}
                           printdate={formattedPrintDate}
                            selectedpShift={selectedpShift}
                          />
                        )}
                        {modalType === "IMPACT" && (
                          <MaxWidthDialogIMPACT
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            //matno={matno}
                            //heatno={heatno}
                            //pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            instrumentName={instrumentName}
                            instrumentId={instrumentId}
                            wiNo={wiNo}
                           printdate={formattedPrintDate}
                            selectedpShift={selectedpShift}
                          />
                        )}
                        {modalType === "DUST" && (
                          <MaxWidthDialogDUST
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            //matno={matno}
                            //heatno={heatno}
                            //pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            shift={selectedShift}
                            instrumentName={instrumentName}
                            instrumentId={instrumentId}
                            wiNo={wiNo}
                           printdate={formattedPrintDate}
                            selectedpShift={selectedpShift}
                          />
                        )}
                        {modalType === "PEEL" && (
                          <MaxWidthDialogPeel
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            //matno={matno}
                            //heatno={heatno}
                            //pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            instrumentName={instrumentName}
                            instrumentId={instrumentId}
                            wiNo={wiNo}
                            selectedunit={selectedunit}
                           printdate={formattedPrintDate}
                            selectedpShift={selectedpShift}
                          />
                        )}
                        {modalType === "TRIAL" && (
                          <MaxWidthDialogTrial
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            printdate={formattedPrintDate}
                            selectedpShift={selectedpShift}
                            //pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            instrumentName={instrumentName}
                            instrumentId={instrumentId}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                            wiNo={wiNo}
                          />
                        )}
                        {modalType === "REPAIR" && (
                          <MaxWidthDialogREPAIR
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            //matno={matno}
                            //heatno={heatno}
                            //pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            instrumentName={instrumentName}
                            instrumentId={instrumentId}
                            wiNo={wiNo}
                            repairmat={repairmat}
                           printdate={formattedPrintDate}
                            selectedpShift={selectedpShift}
                          />
                        )}
                        {modalType === "INLET" && (
                          <DialogINLETModel
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            orderNo={orderNo}
                            item={item}
                            //matno={matno}
                            //heatno={heatno}
                            //pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            shift={selectedShift}
                            instrumentName={instrumentName}
                            instrumentId={instrumentId}
                            wiNo={wiNo}
                           printdate={formattedPrintDate}
                            selectedpShift={selectedpShift}
                          />
                        )}
                        {modalType === "BLASTING" && (
                          <DialogBlastingModel
                            open={isModalOpen}
                            close={handleCloseModal}
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            orderNo={orderNo}
                            item={item}
                            //matno={matno}
                            //heatno={heatno}
                            //pipeno={pipeno}
                            crdate={crdate}
                            shift={selectedShift}
                            wiNo={wiNo}
                            instrumentName1={instrumentName1}
                            instrumentId1={instrumentId1}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                            instrumentName3={instrumentName3}
                            instrumentId3={instrumentId3}
                            instrumentName4={instrumentName4}
                            instrumentId4={instrumentId4}
                           printdate={formattedPrintDate}
                            selectedpShift={selectedpShift}
                          />
                        )}

                        {modalType === "FINAL INSPECTION" && (
                          <MaxWidthDialogFinalinsp
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            //matno={matno}
                            //heatno={heatno}
                            //pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            // instrumentName={instrumentName}
                            // instrumentId={instrumentId}
                            wiNo={wiNo}
                            repairmat={repairmat}
                            instrumentName1={instrumentName1}
                            instrumentId1={instrumentId1}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                            instrumentName3={instrumentName3}
                            instrumentId3={instrumentId3}
                            instrumentName4={instrumentName4}
                            instrumentId4={instrumentId4}
                           printdate={formattedPrintDate}
                            selectedpShift={selectedpShift}
                          />
                        )}

                       {modalType === "THICKNESS" && (
                          <MaxWidthDialogThick
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            //matno={matno}
                            //heatno={heatno}
                            //pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                            // instrumentName={instrumentName}
                            // instrumentId={instrumentId}
                            wiNo={wiNo}
                            repairmat={repairmat}
                             instrumentName={instrumentName}
                            instrumentId={instrumentId}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                           printdate={formattedPrintDate}
                            selectedpShift={selectedpShift}
                          />
                        )}

                     {modalType === "APPLICATION" && (
                          <MaxWidthDialogapplication
                            open={isModalOpen}
                            close={handleCloseModal}
                            type="FG-MD"
                            plant={selectedPlant}
                            reviewedBy={reviewedBy}
                            testMethod={valueRadio}
                            orderNo={orderNo}
                            item={item}
                            //matno={matno}
                            //heatno={heatno}
                            //pipeno={pipeno}
                            rmno={rmno}
                            crdate={crdate}
                             selectedpipelist={selectedpipelist} 
                            // instrumentName={instrumentName}
                            // instrumentId={instrumentId}
                            wiNo={wiNo}
                            repairmat={repairmat}
                            instrumentName1={instrumentName1}
                            instrumentId1={instrumentId1}
                            instrumentName2={instrumentName2}
                            instrumentId2={instrumentId2}
                            instrumentName3={instrumentName3}
                            instrumentId3={instrumentId3}
                           printdate={formattedPrintDate}
                            selectedpShift={selectedpShift}
                            // instrumentName4={instrumentName4}
                            // instrumentId4={instrumentId4}
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
