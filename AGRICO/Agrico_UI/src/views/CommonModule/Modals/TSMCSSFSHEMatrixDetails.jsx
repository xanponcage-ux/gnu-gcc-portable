import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";

import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import ReactSelect from "components/Select/ReactSelect";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import alertify from "alertifyjs";
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet

import axiosAPI from "../../../axiosAPI";
import serverDetails from "../../../variables/serverDetails";
import Preloader from "components/Preloader/Preloader";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AlarmIcon from "@mui/icons-material/Alarm";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import FindInPageIcon from "@mui/icons-material/FindInPage";

export default function MaxWidthDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [initialLoad, setInitialLoad] = useState(false);
  const [coilTableData, setCoilTableData] = useState([]);
  const [coilTable, setCoilTable] = useState();
  const [loading, setLoading] = React.useState(false);
  const [planChecked, setPlanChecked] = useState(false);

  //page load
  useEffect(() => {
    if (props.open) {
      async function fetchData() {
        //debugger;
        {
          const response = await getAuthorization();
          if (response) {
            //page load functions here
            getCoilDetails();
            //
            setInitialLoad(true);
          }
        }
      }

      fetchData();
    }
  }, [props.open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    //setOpen(false);
    props.close(false);
    setPlanChecked(false);
  };

  const getAuthorization = () =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };
      //debugger;
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

  const getCoilDetails = async (newToken = false) => {
    //debugger;
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    //console.log(props.RiskID);

    var companycd = serverDetails.Company;
    setLoading(true);
    var url = "/api/tsmcssf001/getSHEMatrixDeatilsDataListByRiskID";
    var data = {
      companycd: companycd,
      plantcd: serverDetails.Plant,
      RiskID: props.RiskID,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var rows = [];
          if (response.data == 0) {
            error.alertify("No Coil Available!");
          } else {
            //loop thru data and create json for table
            for (var i in response.data) {
              var rowdata = response.data[i];
              rows.push({
                T_RISKID: rowdata.T_RISKID,
                T_VERSION: rowdata.T_VERSION,
                T_DIVISION: rowdata.T_DIVISION,
                T_DEPARTMENT: rowdata.T_DEPARTMENT,
                T_SECTION: rowdata.T_SECTION,
                T_LINE_AREA: rowdata.T_LINE_AREA,
                T_JOB: rowdata.T_JOB,
                T_ACTIVITY: rowdata.T_ACTIVITY,
                T_HAZARD: rowdata.T_HAZARD,
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
                T_RISK_OWNER: rowdata.T_RISK_OWNER,
                T_RISK_COMMUNICATION: rowdata.T_RISK_COMMUNICATION,
              });
            }
            //set table data
            setCoilTableData(rows);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  //column definition for CR Table
  const coilTableColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      frozen: true,
      download: false,
    },

    {
      title: "RiskID",
      field: "T_RISKID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Version",
      field: "T_VERSION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Division",
      field: "T_DIVISION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Department",
      field: "T_DEPARTMENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Section",
      field: "T_SECTION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Line Area",
      field: "T_LINE_AREA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Job",
      field: "T_JOB",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Activity",
      field: "T_ACTIVITY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Hazardous Event",
      field: "T_HAZARDOUS_EVENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
    },
    {
      title: "Cause",
      field: "T_CAUSE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
    },
    {
      title: "Consequence Impact",
      field: "T_CONSEQUNCE_IMPACT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
    },
    {
      title: "People Asset",
      field: "T_PEOPLE_ASSET",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Existing Safeguard",
      field: "T_EXISTING_SAFEGUARD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
    },
    {
      title: "Consequences",
      field: "T_CONSEQUENCES",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Probability Occurance",
      field: "T_PROBABILITY_OCCURANCE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Risk",
      field: "T_RISK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Recommendation Reducing",
      field: "T_RECOMMENDATION_REDUCING",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
    },
    {
      title: "Residual Probability",
      field: "T_RESIDUAL_PROBABILITY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Residual Consequences",
      field: "T_RESIDUAL_CONSEQUENCES",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Residual Risk",
      field: "T_RESIDUAL_RISK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Risk Communication",
      field: "T_RISK_COMMUNICATION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
    },
    {
      title: "Owner",
      field: "T_RISK_OWNER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  useEffect(() => {
    if (coilTableData && coilTableData.length > 0) {
      setCoilTable(
        new Tabulator("#coilTable", {
          data: coilTableData, //link data to table
          columns: coilTableColumns,
          height: 400,
          // layout: "fitColumns",
          layout: "fitDataFill",
          pagination: "local",
          paginationSize: 20,
        })
      );
    }
  }, [coilTableData]);

  //CheckBox function
  const handlePlanChange = (e) => {
    setPlanChecked(!planChecked);
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={fullWidth}
        open={props.open}
        onClose={handleClose}
      >
        <DialogTitle>SHE Risk Matrix Details Data</DialogTitle>

        <DialogContent>
          {loading && <Preloader />}

          <MDBox px={3} py={1}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <div id="coilTable" />
              </Grid>
            </Grid>
          </MDBox>

          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            style={{ marginTop: "0.5rem" }}
          >
            <Button onClick={handleClose}>Close</Button>
          </Grid>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
