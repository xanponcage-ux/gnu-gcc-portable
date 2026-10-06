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

export default function TSMCSSF001(props) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");

  const [initialLoad, setInitialLoad] = useState(false);

  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  // const [barCodeValue, setBarCodeValue] = useState("");
  //page load
  var arr = props.inputValues();

  useEffect(() => {
    if (props.open) {
      async function fetchData() {
        {
          //debugger;
          const response = await getAuthorization();
          if (response) {
            //console.log("arr");
            //console.log(arr);
            // getCoilDetails();
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
    props.callSheMatrixDetail();
    props.close(false);
  };

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

  const uploadCerti = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };
  const uploadfiletolocation = async (newToken = false) => {
    //debugger;
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        "content-type": "multipart/form-data",
      },
    };
    //debugger;
    setLoading(true);
    var url = "api/tsmcssf001/uploadfiles";
    if (file != "") {
      const formData = new FormData();
      const fname = file.name;

      const lastDot = fname.lastIndexOf(".");
      const ext = fname.substring(lastDot + 1);
      var newFileName = arr[0].T_RISKID + "." + ext;
      formData.append("file", file, newFileName);
      formData.append("fileName", newFileName);
      var iFileSize = file.size;
      if (ext != 'pdf' && ext != 'docx' && ext != 'pptx') { //|| ext !== "docx" || ext !== "pptx"
        alertify.error(
          "Please Make Sure Only PDF,Word and Power point File can be Uploaded"
        );  
        
        setLoading(false); 
        return;     
      }
      if (iFileSize > 5242880 ) { 
        //  --5242880
        alertify.error(
          "Please Make Sure file size should be less than 5 MB Can be Uploaded"
        );
        setLoading(false);
        return;
      } else {
        axiosAPI
          .post(url, formData, defaultOptions)
          .then((res) => {
            if (res.statusText != "" && res.statusText != "OK") {
              //reject(response.statusText);
            } else {
              //debugger;
              alertify.success(res.data.message);
              setFile("");
              setFileName("");
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      }
    } else {
      alertify.error("please select file");
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.open}
        onClose={handleClose}
      >
        <DialogTitle
          style={{
            padding: "15px 20px",
            background: "#34abeb",
            color: "#454B4D",
          }}
        >
          SHE Risk Details File Upload
        </DialogTitle>
        <DialogContent>
          {loading && <Preloader />}
          <MDBox px={3} py={1}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Grid item xs={4}>
                  <MDTypography
                    fontWeight="regular"
                    fontSize="small"
                    textTransform="capitalize"
                    variant="h6"
                    color={"dark"}
                    noWrap
                  >
                    Choose File
                  </MDTypography>
                  <MDInput
                    fullWidth
                    name="upldfile"
                    type="file"
                    onChange={uploadCerti}
                  />
                </Grid>
                <Grid item xs={3}>
                  <MDButton
                    size="small"
                    color="info"
                    style={{ marginTop: "1.5rem" }}
                    onClick={uploadfiletolocation}
                  >
                    Upload
                  </MDButton>
                </Grid>
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
