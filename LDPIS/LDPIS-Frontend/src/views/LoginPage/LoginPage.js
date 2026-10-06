import React, { useEffect, useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Grid from "@mui/material/Grid";

import alertify from "alertifyjs";
import "../alertifyjs.css";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import logo from "../../assets/img/Tata_White.png";
import logoTube from "../../assets/Logo/logo.jpeg";
import BasicLayout from "layouts/authentication/components/BasicLayout";

import ReactSelect from "components/Select/ReactSelect";
import Preloader from "components/Preloader/Preloader";

import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function LoginPage(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [loading, setLoading] = React.useState(false);
  const [initialLoad, setInitialLoad] = React.useState(false);
  const [pin, setPin] = React.useState(Array(6).fill(""));
  const [newPin, setNewPin] = React.useState(Array(6).fill(""));
  const [isNewReq, setIsNewReq] = React.useState(false);
  const [isNewGen, setIsNewGen] = React.useState(false);

  setTimeout(function () {
    setCardAnimation("");
  }, 700);

  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";secure;" + expires + ";path=/";
  }

  function fetchData() {
    if (initialLoad == false) {
      localStorage.removeItem("tmm_accessToken");
      localStorage.removeItem("tmm_refreshToken");
      //localStorage.removeItem("tmm_sessionId");
      //localStorage.removeItem("tmm_compCd");
      localStorage.removeItem("idleTime");

      //localStorage.removeItem("tmm_plantCd");
      setInitialLoad(true);
    }
  }

  useEffect(() => {
    sessionStorage.clear();
    const tmm_sessionId = localStorage.getItem("tmm_sessionId");
    localStorage.clear();
    localStorage.setItem("tmm_sessionId", tmm_sessionId);
    setCookie("routes", "", 0);
    fetchData();
    //validateUser();
    return () => {
      setInitialLoad(false);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    sessionStorage.clear();
    var uName = document.getElementById("adid").value;
    var pWord = document.getElementById("password").value;

    var username = uName.replaceAll(" ", "");
    var password = pWord.replaceAll(" ", "");

    if (
      !username ||
      !password ||
      username.length == 0 ||
      password.length == 0
    ) {
      alertify.error("Please provide user id, password");
      return;
    }

    if (pin.join("")?.length !== 6) {
      alertify.error("Please provide Passcode");
      return;
    }

    if (isNewReq && newPin.join("")?.length !== 6) {
      alertify.error("Please provide New Passcode");
      return;
    }
    setLoading(true);
    var url = "api/users/login";
    var text = username + ":" + password;
    let sId = "";
    try {
      sId = localStorage.getItem("tmm_sessionId");
    } catch (e) {
      sId = "";
    }
    localStorage.clear();
    let paramData = {
      username: username,
      password: password,
      passcode: pin.join(""),
      sessionId: sId,
      ...(isNewReq && { newPasscode: newPin.join("") }),
    };
    var t = "21144S3984CEF5c659C44ZCK37299B4208375IG7DC792A30";
    var CryptoJS = require("crypto-js");
    var key = CryptoJS.MD5(t).toString();
    var encrypted = CryptoJS.TripleDES.encrypt(JSON.stringify(paramData), key);
    var base64String = encrypted.toString();
    var data = {
      userDetails: base64String,
    };
    axiosAPI
      .post(url, data)
      .then((response) => {
        setLoading(false);
        if (response.statusText != "" && response.statusText != "OK") {
          // auto logout if 401 response returned from api
          // logout();
          return Promise.reject(response.statusText);
        } else if (response?.data?.status !== true) {
          if (response?.data?.Err?.slice(0, 3) === "NP-") {
            setIsNewReq(true);
          } else {
            setIsNewReq(false);
            setIsNewGen(false);
            setNewPin(Array(6).fill(""));
            setPin(Array(6).fill(""));
            alertify.error(response?.data?.Err ?? "Invalid username password");
          }
          return;
        } else if (response.data.accessToken && response.data.refreshToken) {
          localStorage.setItem("tmm_accessToken", response.data.accessToken);
          localStorage.setItem("tmm_refreshToken", response.data.refreshToken);
          serverDetails.AccessToken = response.data.accessToken;
          serverDetails.RefreshToken = response.data.refreshToken;
          serverDetails.CompanyCode = response.data.companyCode;

          localStorage.setItem("tmm_sessionId", response.data.sessionId);

          serverDetails.PersonalNo = username;

          localStorage.setItem("userCredential", JSON.stringify(data));
          localStorage.setItem("userId", username);
          localStorage.setItem("userName", response?.data?.results?.[0]?.[1]);
          localStorage.setItem("idleTime", response?.data?.idleTime);

          var defaultOptions = {
            headers: {
              Authorization: "Bearer " + response.data.accessToken,
            },
          };
          var urld = "api/users/downTime";
          axiosAPI.post(urld, {}, defaultOptions).then((resp) => {
            if (resp.statusText != "" && resp.statusText != "OK") {
            } else {
              if (resp.data.rows[0][0] == 0) {
                window.location.href = "/ldpis_mes/#/navigate";
              } else {
                window.location.href = "#/undermaintenance";
              }
            }
          });
        } else if (response.data.message) {
          setIsNewReq(false);
          setIsNewGen(false);
          setNewPin(Array(6).fill(""));
          setPin(Array(6).fill(""));
          alertify.success(response.data.message);
        }
      })
      .catch((e) => {
        setLoading(false);
        alertify.error("Invalid Credentials");
      });
  };

  const handlPinChange = (event, i) => {
    let varPin = [...pin];
    varPin[i] = event.target.value;
    if (
      event.target.value &&
      Number(event.target.value?.toString())?.toString() !== "NaN"
    ) {
      setPin(varPin);
      document.getElementById(`pin${i + 1}`)?.focus();
    } else if (event.target.value?.length === 0) {
      setPin(varPin);
    }
  };
  const handlPinNewChange = (event, i) => {
    let varPin = [...newPin];
    varPin[i] = event.target.value;
    if (
      event.target.value &&
      Number(event.target.value?.toString())?.toString() !== "NaN"
    ) {
      setNewPin(varPin);
      document.getElementById(`npin${i + 1}`)?.focus();
    } else if (event.target.value?.length === 0) {
      setNewPin(varPin);
    }
  };

  const inputfocus = (elmnt, i) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      if (pin[i]?.length === 0 || pin[i]?.length === undefined) {
        document.getElementById(`pin${i - 1}`)?.focus();
      }
    }
  };

  const inputfocusNew = (elmnt, i) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      if (newPin[i]?.length === 0 || newPin[i]?.length === undefined) {
        document.getElementById(`npin${i - 1}`)?.focus();
      }
    }
  };

  const onGenerate = (isForgot, reset) => {
    var uName = document.getElementById("adid").value;
    var pWord = document.getElementById("password").value;

    var username = uName.replaceAll(" ", "");
    var password = pWord.replaceAll(" ", "");

    if (
      !username ||
      !password ||
      username.length == 0 ||
      password.length == 0
    ) {
      alertify.error("Please provide user id, password");
      return;
    }

    if (isNewGen) {
      if (newPin.join("")?.length !== 6) {
        alertify.error("Please provide New Passcode");
        return;
      }
    }

    setLoading(true);
    var url = "api/users/genaratePasscode";
    var text = username + ":" + password;
    var t = "21144S3984CEF5c659C44ZCK37299B4208375IG7DC792A30";
    var CryptoJS = require("crypto-js");
    var key = CryptoJS.MD5(t).toString();
    var encrypted = CryptoJS.TripleDES.encrypt(text, key);
    var base64String = encrypted.toString();
    var data = {
      userDetails: base64String,
      isForgot: isForgot,
      ...(reset && { onReset: true }),
      ...(isNewGen && { newPasscode: newPin.join("") }),
    };
    axiosAPI
      .post(url, data)
      .then((response) => {
        setLoading(false);
        if (response?.statusText != "" && response?.statusText != "OK") {
          // auto logout if 401 response returned from api
          // logout();
          return Promise.reject(response.statusText);
        } else if (response?.data?.status !== true) {
          if (response?.data?.Err?.slice(0, 3) === "NP-") {
            if (isNewGen) {
              alertify.error(response.data.Err);
            } else {
              setIsNewGen(true);
            }
          } else {
            setIsNewGen(false);
            alertify.error(response.data.Err);
            setNewPin(Array(6).fill(""));
            setPin(Array(6).fill(""));
          }
          return;
        } else if (response?.data?.status === true) {
          setNewPin(Array(6).fill(""));
          setPin(Array(6).fill(""));
          setIsNewGen(false);
          setIsNewReq(false);
          if (isForgot) {
            onGenerate(false, true);
          } else {
            alertify.success(response.data.message);
          }
        } else {
          alertify.error("Something went wrong!");
        }
      })
      .catch((e) => {
        setLoading(false);
        alertify.error("Something went wrong!");
      });
  };
  const onResetPassword = () => {
    var uName = document.getElementById("adid").value;

    var username = uName.replaceAll(" ", "");

    if (!username || username.length == 0) {
      alertify.error("Please provide user id");
      return;
    }

    setLoading(true);
    var url = "api/users/resetPassword";
    var data = {
      id: username,
    };
    axiosAPI
      .post(url, data)
      .then((response) => {
        setLoading(false);
        if (response?.statusText != "" && response?.statusText != "OK") {
          // auto logout if 401 response returned from api
          // logout();
          return Promise.reject(response.statusText);
        } else if (response?.data?.status === true) {
          alertify.error(response?.data?.message ?? "Something went wrong!");
        } else {
          alertify.error(response?.data?.Err ?? "Something went wrong!");
        }
      })
      .catch((e) => {
        setLoading(false);
        alertify.error("Something went wrong!");
      });
  };

  //logoTube
  return (
    <BasicLayout>
      {loading && <Preloader />}
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          textAlign="center"
          mt={-6}
          p={0.5}
        >
          <Card>
            <CardMedia
              component="img"
              height="194"
              image={logoTube}
              mt={-14}
              alt="Logo"
              sx={{ objectFit: "contain", width: "90%" }} // Added properties here
            />
            <CardContent>
              <MDTypography
                variant="h4"
                fontWeight="medium"
                color="dark"
                mt={-8} // Decreased margin-top
                mb={0} // Optional: Decrease margin-bottom
                sx={{ padding: 0 }} // Optional: Remove padding if needed
              >
                LDP-IS MES
              </MDTypography>
              <MDTypography variant="h6" fontWeight="light" color="dark" mt={1}>
                Please enter your credentials
              </MDTypography>
            </CardContent>
          </Card>
        </MDBox>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDTypography
                fontWeight="regular"
                fontSize="small"
                textTransform="capitalize"
                variant="h6"
                color={"dark"}
                noWrap
              >
                User Id
              </MDTypography>
              <MDInput type="text" id="adid" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography
                fontWeight="regular"
                fontSize="small"
                textTransform="capitalize"
                variant="h6"
                color={"dark"}
                noWrap
              >
                Password
              </MDTypography>
              <MDInput type="password" id="password" fullWidth />
            </MDBox>
            <MDBox
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 1,
              }}
            >
              <MDTypography></MDTypography>
              <MDTypography
                fontWeight="regular"
                fontSize="small"
                textTransform="capitalize"
                variant="a"
                color={"dark"}
                noWrap
                sx={{ cursor: "pointer", color: "deepskyblue" }}
                onClick={onResetPassword}
              >
                Forgot Password
              </MDTypography>
            </MDBox>
            <MDBox>
              <MDTypography
                fontWeight="regular"
                fontSize="small"
                textTransform="capitalize"
                variant="h6"
                color={"dark"}
                noWrap
              >
                Passcode
              </MDTypography>
              <Grid container spacing={1}>
                {pin?.map((x, i) => (
                  <Grid item xs={2} key={i}>
                    <MDInput
                      inputProps={{ maxLength: 1 }}
                      type="password"
                      id={`pin${i}`}
                      value={x ? x.toString() : ""}
                      onChange={(e) => handlPinChange(e, i)}
                      onKeyDown={(e) => inputfocus(e, i)}
                    />
                  </Grid>
                ))}
              </Grid>
              {isNewReq || isNewGen ? (
                <Dialog
                  open={isNewReq || isNewGen}
                  onClose={() => {
                    setIsNewGen(false);
                    setIsNewReq(false);
                  }}
                >
                  <DialogTitle>Update Passcode</DialogTitle>
                  <DialogContent>
                    <MDBox>
                      <Grid container spacing={1}>
                        {newPin?.map((x, i) => (
                          <Grid item xs={2} key={i}>
                            <MDInput
                              inputProps={{ maxLength: 1 }}
                              type="password"
                              id={`npin${i}`}
                              value={x ? x.toString() : ""}
                              onChange={(e) => handlPinNewChange(e, i)}
                              onKeyDown={(e) => inputfocusNew(e, i)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </MDBox>
                  </DialogContent>
                  <DialogActions>
                    <MDButton
                      onClick={
                        !loading
                          ? () => {
                              setIsNewGen(false);
                              setIsNewReq(false);
                            }
                          : null
                      }
                    >
                      CLose
                    </MDButton>
                    <MDButton
                      variant="gradient"
                      color="info"
                      type="submit"
                      onClick={
                        !loading
                          ? isNewGen
                            ? () => onGenerate(false, isNewGen ? true : false)
                            : handleSubmit
                          : null
                      }
                    >
                      {loading ? "Saving..." : "Save"}
                    </MDButton>
                  </DialogActions>
                </Dialog>
              ) : null}
              <MDBox
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 1,
                }}
              >
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="a"
                  color={"dark"}
                  noWrap
                  sx={{ cursor: "pointer", color: "deepskyblue" }}
                  onClick={() => onGenerate(true)}
                >
                  Forgot Passcode?
                </MDTypography>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="a"
                  color={"dark"}
                  noWrap
                  sx={{ cursor: "pointer", color: "deepskyblue" }}
                  onClick={() => onGenerate(false)}
                >
                  Generate Passcode
                </MDTypography>
              </MDBox>
            </MDBox>
            {/* <MDBox>
              <MDTypography
                fontWeight="regular"
                fontSize="small"
                textTransform="capitalize"
                variant="h6"
                color={"dark"}
                noWrap
              >
                Location
              </MDTypography>
              <ReactSelect
                id="plant"
                options={plantList}
                defaultValue={plantList[0]}
                onChange={handlePlantChange}
              />
            </MDBox> */}
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                onClick={handleSubmit}
              >
                sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}
