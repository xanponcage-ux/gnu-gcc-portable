/* eslint-disable no-param-reassign */
/**
=========================================================
* Material Kit 2 React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com
 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { Fragment, useState, useEffect } from "react";
import React, { useRef, forwardRef, useCallback } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
// react-router components
import { Link } from "react-router-dom";
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axiosAPI from "../../../axiosAPI";
import alertify from "alertifyjs";

// @mui material components
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";
// Material Kit 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";

// Material Dashboard 2 React components

import MDInput from "components/MDInput";

// Material Dashboard 2 React example components

import NotificationItem from "examples/Items/NotificationItem";

// Material Kit 2 React example components
import DefaultNavbarDropdown from "examples/Navbars/DefaultNavbar/DefaultNavbarDropdown";
import DefaultNavbarMobile from "examples/Navbars/DefaultNavbar/DefaultNavbarMobile";

// Material Kit 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";
import Breadcrumbs from "@mui/material/Breadcrumbs";

// import logo from "../../../assets/img/Tata_Steel_Logo.svg";
import logo from "../../../assets/img/tatawamk.png";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import PasswordIcon from "@mui/icons-material/Password";
import FullScreenNavBar from "examples/Navbars/FullScreenNavbar";
import CurrentDate from "views/Common/CurrentDate";
import CurrentWeek from "views/Common/CurrentWeek";
// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

import serverDetails from "variables/serverDetails";
import MDAlert from "components/MDAlert";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import { GetAuthorization } from "utils";

function DefaultNavbar({
  brand,
  routes,
  transparent,
  light,
  action,
  sticky,
  relative,
  center,
  module,
  page,
}) {
  const [dropdown, setDropdown] = useState("");
  const [dropdownEl, setDropdownEl] = useState("");
  const [dropdownName, setDropdownName] = useState("");
  const [nestedDropdown, setNestedDropdown] = useState("");
  const [nestedDropdownEl, setNestedDropdownEl] = useState("");
  const [nestedDropdownName, setNestedDropdownName] = useState("");
  const [arrowRef, setArrowRef] = useState(null);
  const [mobileNavbar, setMobileNavbar] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [open, setOpen] = React.useState(false);
  const openMobileNavbar = () => setMobileNavbar(!mobileNavbar);

  useEffect(() => {
    // A function that sets the display state for the DefaultNavbarMobile.
    function displayMobileNavbar() {
      if (window.innerWidth < breakpoints.values.lg) {
        setMobileView(true);
        setMobileNavbar(false);
      } else {
        setMobileView(false);
        setMobileNavbar(false);
      }
    }

    /** 
     The event listener that's calling the displayMobileNavbar function when 
     resizing the window.
    */
    window.addEventListener("resize", displayMobileNavbar);

    // Call the displayMobileNavbar function to set the state with the initial value.
    displayMobileNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", displayMobileNavbar);
  }, []);

  // LOGOUT AREA
  const [counts, setcounts] = useState(0);
  const history = useNavigate();

  async function check() {
    var data = JSON.parse(localStorage.getItem("userCredential"));
    checkLastActive();
    if (!data) {
      sessionStorage.clear();
      const tmm_sessionId = localStorage.getItem("tmm_sessionId");
      localStorage.clear();
      localStorage.setItem("tmm_sessionId", tmm_sessionId);
      window.top.close();
      history("/signin");
    }
    setcounts(counts + 1);
  }
  async function checkLastActive() {
    var unix = localStorage.getItem("lastActiveTime");
    if (unix) {
      const idleTime = parseInt(localStorage.getItem("idleTime"))
        ? parseInt(localStorage.getItem("idleTime"))
        : 60;
      var lastTime = moment.unix(unix);
      var duration = moment.duration(moment().diff(lastTime));
      var minutes = duration.asMinutes();
      if (minutes > idleTime) {
        // number in minutes
        logoutFunc();
      }
    }
  }

  // Write this line
  useEffect(() => {
    document.title = page;
    check();
    const timer = setInterval(() => {
      check();
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const logoutFunc = () =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };
      var url = serverDetails.baseURL + "api/users/logout";
      axiosAPI
        .post(
          url,
          { refreshToken: localStorage.getItem("tmm_refreshToken") },
          defaultOptions
        )
        .then(async () => {
          sessionStorage.clear();
          localStorage.clear();
          history("/signin");
        });
    });

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };

  // LOGOUT AREA END
  var url =
    "https://intranet.corp.tatasteel.com/GIH001.ashx?pf=YY&cid=" +
    serverDetails.PersonalNo;

  const renderNavbarItems = routes
    .filter((x) => x.name == module)
    .map(({ name, icon, href, route, collapse }, i) => (
      <DefaultNavbarDropdown
        key={i}
        name={name}
        icon={icon}
        href={href}
        route={route}
        collapse={Boolean(collapse)}
        onMouseEnter={({ currentTarget }) => {
          if (collapse) {
            setDropdown(currentTarget);
            setDropdownEl(currentTarget);
            setDropdownName(name);
          }
        }}
        onMouseLeave={() => collapse && setDropdown(null)}
        light={light}
      />
    ));

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  // Render the routes on the dropdown menu
  const renderRoutes = routes.map(
    ({ name, collapse, columns, rowsPerColumn }) => {
      let template;
      // Render the dropdown menu that should be display as columns
      if (collapse && columns && name === dropdownName) {
        const calculateColumns = collapse.reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / rowsPerColumn);

          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
          }

          resultArray[chunkIndex].push(item);

          return resultArray;
        }, []);

        template = (
          <Grid key={name} container spacing={3} py={1} px={1.5}>
            {calculateColumns.map((cols, key) => {
              const gridKey = `grid-${key}`;
              const dividerKey = `divider-${key}`;

              return (
                <Grid
                  key={gridKey}
                  item
                  xs={12 / columns}
                  sx={{ position: "relative" }}
                >
                  {cols.map((col, index) => (
                    <Fragment key={index}>
                      <MDTypography
                        display="block"
                        variant="button"
                        fontWeight="bold"
                        textTransform="capitalize"
                        py={1}
                        px={0.5}
                        mt={index !== 0 ? 2 : 0}
                      >
                        {col.name}
                      </MDTypography>
                      {col.collapse.map((item, i) => (
                        <MDTypography
                          key={i}
                          onClick={
                            JSON.parse(getCookie("routes") || "[]")?.includes(
                              item.route
                            )
                              ? () => {
                                alertify.error(
                                  "This page is already opened!"
                                );
                              }
                              : null
                          }
                          component={
                            !JSON.parse(getCookie("routes") || "[]")?.includes(
                              item.route
                            )
                              ? item.route
                                ? Link
                                : MuiLink
                              : null
                          }
                          to={
                            !window.location.hash?.includes(item.route)
                              ? item.route
                                ? item.route
                                : ""
                              : ""
                          }
                          href={
                            !window.location.hash?.includes(item.route)
                              ? item.href
                                ? item.href
                                : (e) => e.preventDefault()
                              : (e) => e.preventDefault()
                          }
                          // // target={item.href ? "_blank" : ""}
                          target="_blank"
                          rel={item.href ? "noreferrer" : "noreferrer"}
                          minWidth="11.25rem"
                          display="block"
                          variant="button"
                          color="text"
                          textTransform="capitalize"
                          fontWeight="regular"
                          py={0.625}
                          px={2}
                          sx={({
                            palette: { grey, dark },
                            borders: { borderRadius },
                          }) => ({
                            borderRadius: borderRadius.md,
                            cursor: "pointer",
                            transition: "all 300ms linear",
                            // pointerEvents: window.location.hash?.includes(
                            //   item.route
                            // )
                            //   ? "none"
                            //   : "auto",
                            "&:hover": {
                              backgroundColor: grey[200],
                              color: dark.main,
                            },
                          })}
                        >
                          {item.name}
                        </MDTypography>
                      ))}
                    </Fragment>
                  ))}
                  {key !== 0 && (
                    <Divider
                      key={dividerKey}
                      orientation="vertical"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "-4px",
                        transform: "translateY(-45%)",
                        height: "90%",
                      }}
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
        );

        // Render the dropdown menu that should be display as list items
      } else if (collapse && name === dropdownName) {
        template = collapse.map((item) => {
          const linkComponent = {
            component: MuiLink,
            href: item.href,
            target: "_blank",
            rel: "noreferrer",
          };

          const routeComponent = {
            component: Link,
            to: item.route,
          };

          return (
            <MDTypography
              key={item.name}
              {...(item.route ? routeComponent : linkComponent)}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              variant="button"
              textTransform="capitalize"
              minWidth={item.description ? "14rem" : "12rem"}
              color={item.description ? "dark" : "text"}
              fontWeight={item.description ? "bold" : "regular"}
              py={item.description ? 1 : 0.625}
              px={2}
              sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                borderRadius: borderRadius.md,
                cursor: "pointer",
                transition: "all 300ms linear",

                "&:hover": {
                  backgroundColor: grey[200],
                  color: dark.main,

                  "& *": {
                    color: dark.main,
                  },
                },
              })}
              onMouseEnter={({ currentTarget }) => {
                if (item.dropdown) {
                  setNestedDropdown(currentTarget);
                  setNestedDropdownEl(currentTarget);
                  setNestedDropdownName(item.name);
                }
              }}
              onMouseLeave={() => {
                if (item.dropdown) {
                  setNestedDropdown(null);
                }
              }}
            >
              {item.description ? (
                <MDBox>
                  {item.name}
                  <MDTypography
                    display="block"
                    variant="button"
                    color="text"
                    fontWeight="regular"
                    sx={{ transition: "all 300ms linear" }}
                  >
                    {item.description}
                  </MDTypography>
                </MDBox>
              ) : (
                item.name
              )}
              {item.collapse && (
                <Icon
                  fontSize="small"
                  sx={{
                    fontWeight: "normal",
                    verticalAlign: "middle",
                    mr: -0.5,
                  }}
                >
                  keyboard_arrow_right
                </Icon>
              )}
            </MDTypography>
          );
        });
      }

      return template;
    }
  );

  // Routes dropdown menu
  const dropdownMenu = (
    <Popper
      anchorEl={dropdown}
      popperRef={null}
      open={Boolean(dropdown)}
      placement="top-start"
      transition
      style={{ zIndex: 10 }}
      modifiers={[
        {
          name: "arrow",
          enabled: true,
          options: {
            element: arrowRef,
          },
        },
      ]}
      onMouseEnter={() => setDropdown(dropdownEl)}
      onMouseLeave={() => {
        if (!nestedDropdown) {
          setDropdown(null);
          setDropdownName("");
        }
      }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          sx={{
            transformOrigin: "left top",
            background: ({ palette: { white } }) => white.main,
          }}
        >
          <MDBox borderRadius="lg">
            <MDTypography variant="h1" color="white">
              <Icon ref={setArrowRef} sx={{ mt: -3 }}>
                arrow_drop_up
              </Icon>
            </MDTypography>
            <MDBox shadow="lg" borderRadius="lg" p={2} mt={2}>
              {renderRoutes}
            </MDBox>
          </MDBox>
        </Grow>
      )}
    </Popper>
  );

  // Render routes that are nested inside the dropdown menu routes
  const renderNestedRoutes = routes.map(({ collapse, columns }) =>
    collapse && !columns
      ? collapse.map(({ name: parentName, collapse: nestedCollapse }) => {
        let template;

        if (parentName === nestedDropdownName) {
          template =
            nestedCollapse &&
            nestedCollapse.map((item) => {
              const linkComponent = {
                component: MuiLink,
                href: item.href,
                target: "_blank",
                rel: "noreferrer",
              };

              const routeComponent = {
                component: Link,
                to: item.route,
              };

              return (
                <MDTypography
                  key={item.name}
                  {...(item.route ? routeComponent : linkComponent)}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  variant="button"
                  textTransform="capitalize"
                  minWidth={item.description ? "14rem" : "12rem"}
                  color={item.description ? "dark" : "text"}
                  fontWeight={item.description ? "bold" : "regular"}
                  py={item.description ? 1 : 0.625}
                  px={2}
                  sx={({
                    palette: { grey, dark },
                    borders: { borderRadius },
                  }) => ({
                    borderRadius: borderRadius.md,
                    cursor: "pointer",
                    transition: "all 300ms linear",

                    "&:hover": {
                      backgroundColor: grey[200],
                      color: dark.main,

                      "& *": {
                        color: dark.main,
                      },
                    },
                  })}
                >
                  {item.description ? (
                    <MDBox>
                      {item.name}
                      <MDTypography
                        display="block"
                        variant="button"
                        color="text"
                        fontWeight="regular"
                        sx={{ transition: "all 300ms linear" }}
                      >
                        {item.description}
                      </MDTypography>
                    </MDBox>
                  ) : (
                    item.name
                  )}
                  {item.collapse && (
                    <Icon
                      fontSize="small"
                      sx={{
                        fontWeight: "normal",
                        verticalAlign: "middle",
                        mr: -0.5,
                      }}
                    >
                      keyboard_arrow_right
                    </Icon>
                  )}
                </MDTypography>
              );
            });
        }

        return template;
      })
      : null
  );

  // Dropdown menu for the nested dropdowns
  const nestedDropdownMenu = (
    <Popper
      anchorEl={nestedDropdown}
      popperRef={null}
      open={Boolean(nestedDropdown)}
      placement="right-start"
      transition
      style={{ zIndex: 10 }}
      onMouseEnter={() => {
        setNestedDropdown(nestedDropdownEl);
      }}
      onMouseLeave={() => {
        setNestedDropdown(null);
        setNestedDropdownName("");
        setDropdown(null);
      }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          sx={{
            transformOrigin: "left top",
            background: ({ palette: { white } }) => white.main,
          }}
        >
          <MDBox ml={2.5} mt={-2.5} borderRadius="lg">
            <MDBox shadow="lg" borderRadius="lg" py={1.5} px={1} mt={2}>
              {renderNestedRoutes}
            </MDBox>
          </MDBox>
        </Grow>
      )}
    </Popper>
  );

  const PwordChangeFunc = () => {
    setOpen(true);
  };

  const handleClose = (e) => {
    setOpen(false);
    e.preventDefault();
    var old = document.getElementById("oldPass").value;
    var newP = document.getElementById("newPass").value;
    var OldPassword = old.replaceAll(" ", "");
    var NewPassword = newP.replaceAll(" ", "");

    if (
      !OldPassword ||
      !NewPassword ||
      OldPassword.length == 0 ||
      NewPassword.length == 0
    ) {
      alertify.error("Please provide Old and New Password");
      return;
    }

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = serverDetails.baseURL + "api/users/changePassword";

      var data = {
        user: serverDetails.PersonalNo,
        newpass: NewPassword,
        oldpass: OldPassword,
      };

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            if (response.data) {
              console.log(response.data);
              if (
                response.data.offset == 0 &&
                response.data.errorNum == 28008
              ) {
                alertify.error("Error: invalid old password Or new password");
              } else if (
                response.data.offset == 0 &&
                response.data.errorNum == 28003
              ) {
                alertify.error(
                  "Error: password verification for the specified password failed, Password should differ by at least 3 characters. Select a password which has is 8 characters long and contains atleast one alphabet, one numeric digit and one special character"
                );
              } else if (
                response.data.offset == 0 &&
                response.data.errorNum == 28007
              ) {
                alertify.error("Error: the password cannot be reused");
              } else if (response.data.rowsAffected == 0) {
                alertify.success(
                  "Password changed successfully, please login again"
                );
                sessionStorage.clear();
                localStorage.clear();
                history("/signin");
              }
            } else {
              alertify.error("Invalid Request !!!");
            }
          }
        })
        .finally((f) => { });
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <AppBar sx={{ position: "fixed", top: 0, zIndex: 10 }}>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Change Password
        </BootstrapDialogTitle>
        <DialogContent>
          <MDBox px={3} py={1}>
            <Grid container spacing={1}>
              <MDTypography>
                Password should differ by at least 3 characters. Select a
                password which has is 8 characters long and contains atleast one
                alphabet, one numeric digit and one special character
              </MDTypography>
            </Grid>

            <Grid container spacing={1} style={{ marginTop: "1rem" }}>
              <Grid item xs={6}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Old Password
                </MDTypography>
                <MDInput
                  type="password"
                  id="oldPass"
                  inputProps={{ maxLength: 20 }}
                />
              </Grid>
              <Grid item xs={6}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  New Password
                </MDTypography>
                <MDInput
                  type="password"
                  id="newPass"
                  inputProps={{ maxLength: 20 }}
                />
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            OK
          </Button>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <FullScreenNavBar open="false" />
      <MDBox
        py={1}
        px={{ xs: 4, sm: transparent ? 2 : 3, lg: transparent ? 0 : 2 }}
        width="100%"
        shadow={transparent ? "none" : "md"}
        color={light ? "white" : "dark"}
        position="absolute"
        left={0}
        zIndex={3}
        sx={({
          palette: { transparent: transparentColor, white },
          functions: { rgba },
        }) => ({
          backgroundColor: transparent
            ? transparentColor.main
            : rgba(white.main, 0.8),
          backdropFilter: transparent ? "none" : `saturate(200%) blur(30px)`,
        })}
      >
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDBox
            lineHeight={1}
            py={transparent ? 1.5 : 0.75}
            pl={relative || transparent ? 0 : { xs: 0, lg: 1 }}
          >
            <img
              src={logo}
              alt="logo"
              style={{ width: "7rem", height: "2rem", marginLeft: "3rem" }}
            />
          </MDBox>
          <MDBox
            lineHeight={1}
            py={transparent ? 1.5 : 0.75}
            pl={relative || transparent ? 0 : { xs: 0, lg: 1 }}
          >
            <MDTypography
              variant="button"
              fontWeight="bold"
              color={light ? "white" : "dark"}
            >
              {brand}
            </MDTypography>
            <Breadcrumbs aria-label="breadcrumb">
              <MDTypography
                fontWeight="regular"
                fontSize="small"
                textTransform="capitalize"
                variant="h6"
                color={"info"}
                noWrap
              >
                {module}
              </MDTypography>
              <MDTypography
                fontWeight="regular"
                fontSize="small"
                textTransform="capitalize"
                variant="h6"
                color={"primary"}
                noWrap
              >
                {page}
              </MDTypography>
            </Breadcrumbs>
          </MDBox>
          <MDBox
            color="inherit"
            display={{ xs: "none", lg: "flex" }}
            mr={center ? "auto" : 0}
          >
            {renderNavbarItems}
          </MDBox>
          <CurrentWeek />
          <CurrentDate />
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <img
              alt="../../assets/img/altImg.JPG"
              src={url}
              style={{
                width: "2rem",
                borderRadius: "50%",
                marginTop: "0.5rem",
              }}
            />
            <MDTypography
              fontWeight="regular"
              fontSize="small"
              textTransform="capitalize"
              variant="h6"
              color={"dark"}
              noWrap
              style={{ marginLeft: "0.1rem", marginRight: "0.3rem" }}
            >
              {serverDetails.PersonalNo}
            </MDTypography>

            <MuiLink
              style={{ cursor: "pointer" }}
              onClick={PwordChangeFunc}
              variant="button"
              color="secondary"
            >
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <PasswordIcon color="primary" />
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                  style={{ marginLeft: "0.1rem" }}
                >
                  Change Password
                </MDTypography>
              </MDBox>
            </MuiLink>

            <MuiLink
              style={{ cursor: "pointer" }}
              onClick={logoutFunc}
              variant="button"
              color="secondary"
            >
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <PowerSettingsNewIcon color="primary" />
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                  style={{ marginLeft: "0.1rem" }}
                >
                  Log Out
                </MDTypography>
              </MDBox>
            </MuiLink>
          </MDBox>

          <MDBox ml={{ xs: "auto", lg: 0 }}>
            {action &&
              (action.type === "internal" ? (
                <MDButton
                  component={Link}
                  to={action.route}
                  variant={
                    action.color === "white" || action.color === "default"
                      ? "contained"
                      : "gradient"
                  }
                  color={action.color ? action.color : "info"}
                  size="small"
                >
                  {action.label}
                </MDButton>
              ) : (
                <MDButton
                  component="a"
                  href={action.route}
                  target="_blank"
                  rel="noreferrer"
                  variant={
                    action.color === "white" || action.color === "default"
                      ? "contained"
                      : "gradient"
                  }
                  color={action.color ? action.color : "info"}
                  size="small"
                >
                  {action.label}
                </MDButton>
              ))}
          </MDBox>
          <MDBox
            display={{ xs: "inline-block", lg: "none" }}
            lineHeight={0}
            py={1.5}
            pl={1.5}
            color={transparent ? "white" : "inherit"}
            sx={{ cursor: "pointer" }}
            onClick={openMobileNavbar}
          >
            <Icon fontSize="default">{mobileNavbar ? "close" : "menu"}</Icon>
          </MDBox>
        </MDBox>
        <MDBox
          bgColor={transparent ? "white" : "transparent"}
          shadow={transparent ? "lg" : "none"}
          borderRadius="xl"
          px={transparent ? 2 : 0}
        >
          {mobileView && (
            <DefaultNavbarMobile routes={routes} open={mobileNavbar} />
          )}
        </MDBox>
      </MDBox>
      {dropdownMenu}
      {nestedDropdownMenu}
    </AppBar>
  );
}

// Setting default values for the props of DefaultNavbar
DefaultNavbar.defaultProps = {
  brand: "LDP MES",
  transparent: false,
  light: false,
  action: false,
  sticky: false,
  relative: false,
  center: false,
};

// Typechecking props for the DefaultNavbar
DefaultNavbar.propTypes = {
  brand: PropTypes.string,
  transparent: PropTypes.bool,
  light: PropTypes.bool,
  action: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      type: PropTypes.oneOf(["external", "internal"]).isRequired,
      route: PropTypes.string.isRequired,
      color: PropTypes.oneOf([
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
        "light",
        "default",
        "white",
      ]),
      label: PropTypes.string.isRequired,
    }),
  ]),
  sticky: PropTypes.bool,
  relative: PropTypes.bool,
  center: PropTypes.bool,
};

export default DefaultNavbar;
