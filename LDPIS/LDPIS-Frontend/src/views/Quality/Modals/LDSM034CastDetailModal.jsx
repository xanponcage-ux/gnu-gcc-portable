import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import axiosAPI from "../../../axiosAPI";
import Grid from "@mui/material/Grid";

export default function AlertDialog(props) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");

  const [castDetailsData, setCastDetailsData] = useState([]);
  const [castDetailsTable, setCastDetailsTable] = useState(null);
  //   const [open, setOpen] = React.useState(props.open);

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  const handleClose = () => {
    props.close(false);
  };

  const handleYesClick = () => {
    props.close(false);
    props.openScrap(true);
    props.scrapData(props.confirmData);
  };

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

  const getCastDetails = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    let data = {
      castNo: props.castNo,
    };

    var url = "api/LDSM034/getcastdetails";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {

        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var rows = [];
          for (var i in response.data) {
            var rowdata = response.data[i];
            rows.push({
              rowId: i,
              TCA_LAB_TEST_CD: rowdata.TCA_LAB_TEST_CD,
              TCA_TEST_PARA: rowdata.TCA_TEST_PARA,
              TCA_TEST_PARA_REM: rowdata.TCA_TEST_PARA_REM,
              TCA_TEST_PARA_VAL: rowdata.TCA_TEST_PARA_VAL,

            });
          }
          setCastDetailsData(rows);
        }
      })
      .finally((f) => {
        // props.loading(true);
      });
  };

  useEffect(() => {
    if (castDetailsData && castDetailsData.length == 0) {
      getCastDetails();
    }
  }, [props.castNo]);


  const castDetailsColumn = [
    {
      title: "Code",
      field: "TCA_LAB_TEST_CD",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Parameter",
      field: "TCA_TEST_PARA",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Value",
      field: "TCA_TEST_PARA_VAL",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value
      }
    },
    {
      title: "Remarks",
      field: "TCA_TEST_PARA_REM",
      headerFilterPlaceholder: "search...",
    },
  ];

  useEffect(() => {
    if (castDetailsData && castDetailsData.length > 0) {
      setCastDetailsTable(
        new Tabulator("#castdetails", {
          data: castDetailsData, //link data to table
          columns: castDetailsColumn,
          height: 400,
          layout: "fitColumns",

        })
      );
    }
  }, [castDetailsData]);

  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Cast Details"}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description">
            Are you sure you want to give reason code?
          </DialogContentText> */}

          <div id="castdetails" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {/* <Button onClick={handleYesClick}>Yes</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}
