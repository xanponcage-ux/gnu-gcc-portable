import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// import { FileUpload, FileUploadProps } from "./FileUpload/FileUpload";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import moment from "moment";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import alertify from "alertifyjs";
import "./FullScreenNavigation.css";
// Material Dashboard 2 React example components
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BalanceIcon from "@mui/icons-material/Balance";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import FactoryIcon from "@mui/icons-material/Factory";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import InventoryIcon from "@mui/icons-material/Inventory";
import MuiLink from "@mui/material/Link";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import serverDetails from "variables/serverDetails";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import DefaultNavbar from "./DefaultNavbar";
import SummarizeIcon from '@mui/icons-material/Summarize';
import LockClockIcon from '@mui/icons-material/LockClock';

import routes from "routes";
import { GetAuthorization } from "utils";
import axiosAPI from "../../axiosAPI";

export default function FullScreenNavBar(props) {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [open, setOpen] = useState(false);

  const Routs = [
    {
      link: "/ldpis_mes/#/LDSM022",
      text: "Data Exchange",
      icon: <ManageAccountsIcon fontSize="large" color="info" />,
    },
    {
      link: "/ldpis_mes/#/LD50S001",
      text: "Planning & Scheduling",
      icon: <PrecisionManufacturingIcon fontSize="large" color="info" />,
    },
    {
      link: "/ldpis_mes/#/LD01S001",
      text: "Mill",
      icon: <FactoryIcon fontSize="large" color="info" />,
    },
    // {
    //   link: "/ldpis_mes/#/LD01S003",
    //   text: "Mill",
    //   icon: <FactoryIcon fontSize="large" color="info" />,
    // },
    // {
    //   link: "/ldpis_mes/#/LD0RS001",
    //   text: "Mill",
    //   icon: <FactoryIcon fontSize="large" color="info" />,
    // },
    {
      link: "/ldpis_mes/#/LD01S006",
      text: "Dispatch",
      icon: <AvTimerIcon fontSize="large" color="info" />,
    },
    {
      link: "/ldpis_mes/#/LDLTS001",
      text: "Quality",
      icon: <BalanceIcon fontSize="large" color="info" />,
    },
    {
      link: "/ldpis_mes/#/LDSM012",
      text: "Reports",
      icon: <InventoryIcon fontSize="large" color="info" />,
    },
    {
      link: "/ldpis_mes/#/LDSC001",
      text: "Common",
      icon: <EventRepeatIcon fontSize="large" color="info" />,
    },
    {
      link: "/ldpis_mes/#/LDCR001",
      text: "Compliance Report (PDF)",
      icon: <SummarizeIcon fontSize="large" color="info" />,
    },
    {
      link: "/ldpis_mes/#/LDLTS08D",
      text: "LDP DMS",
      icon: <LockClockIcon fontSize="large" color="info" />,
    },
  ];

  async function check() {
    var data = JSON.parse(localStorage.getItem("userCredential"));
    if (!data) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "#/signin";
    }
  }

  async function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    if (initialLoad == false) {
      if (props.open == "true") {
        setOpen(true);
      }
      setInitialLoad(true);
    }
  }

  const checkPasswordExpiry = () =>
    new Promise((resolve, reject) => {
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        var url = "api/users/checkPasswordExpiry";
        axiosAPI.post(url, {}, defaultOptions).then(async (response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            return reject(false);
          } else {
            let EXPIRY_DATE = response.data[0][1];
            if (!EXPIRY_DATE) return resolve(true);
            const diff = moment(EXPIRY_DATE).diff(moment(), "days");
            if (diff > 15) return resolve(true);
            alertify.warning(
              `Your password is expiring in ${diff} days (${moment(
                EXPIRY_DATE
              ).format("DD-MMM-YYYY")}), Please change your password.`
            );
            resolve(true);
          }
          resolve(true);
        });
      });
    });

  //page load
  useEffect(() => {
    fetchData();
    check();
    checkPasswordExpiry();

    const timer = setInterval(() => {
      check();
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const closeNav = () => {
    //document.getElementById("myNav").style.width = "0%";
    setOpen(false);
  };

  const openNav = () => {
    setOpen(true);
  };

  return (
    <>
      {open && (
        <div
          id="myNav"
          className="overlay"
          style={{ zIndex: 999, display: "block", width: "100%" }}
        >
          {(open != true || props.open != "true") && (
            <span
              className="closebtn"
              onClick={() => closeNav()}
              style={{ zIndex: 10 }}
            >
              &times;
            </span>
          )}

          <div className="overlay-content">
            {window.location.hash?.includes("/navigate") ? (
              <DefaultNavbar routes={routes} module="" page="" />
            ) : null}
            {/* <a href="#">Planning</a>
            <a href="#">Chartering</a>
            <a href="#">Port Operations</a>
            <a href="#">Post Fixtures</a> */}
            {/* <Grid
              container
              spacing={4}
              style={{ marginTop: "0.5rem" }}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <h1 style={{ margin: "auto", color: "white" }}>LDP MES</h1>
            </Grid> */}
            <Grid
              container
              spacing={4}
              style={{ maxWidth: "900px", margin: "0.5rem auto" }}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {Routs.map((x, i) => (
                <Grid item xs={4} key={i}>
                  <MuiLink href={x.link} target="_blank">
                    <Card
                      style={{ maxWidth: "220px", margin: "auto" }}
                      className="onHoverUnderline"
                    >
                      <MDBox px={3} py={3}>
                        {x.icon}
                      </MDBox>
                      <MDBox
                        px={3}
                        py={2}
                        className="onHover"
                        style={{ fontSize: "20px" }}
                      >
                        {x.text}
                      </MDBox>
                    </Card>
                  </MuiLink>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      )}

      {!open && !window.location.hash?.includes("/navigate") && (
        <div
          className="quarter-circle-top-left"
          onClick={() => openNav()}
          style={{ cursor: "pointer", zIndex: "999", position: "fixed" }}
        >
          <FormatListBulletedIcon
            style={{
              zIndex: 999,
              color: "white",
              margin: "0.5rem",
              fontSize: "large",
            }}
          />
        </div>
      )}
    </>
  );
}
