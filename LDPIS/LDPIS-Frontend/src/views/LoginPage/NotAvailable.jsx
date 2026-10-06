import React, { useEffect, useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

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
import BasicLayout from "layouts/authentication/components/BasicLayout";

import ReactSelect from "components/Select/ReactSelect";
import Preloader from "components/Preloader/Preloader";

export default function NotAvailable(props) {
    const defaultOptions = {
        headers: {
            Authorization: "bearer " + serverDetails.accessToken,
        },
    };

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    const [loading, setLoading] = React.useState(false);
    const [initialLoad, setInitialLoad] = React.useState(false);


    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <h2 style={{ color: "red", margin: "5rem" }}>
                Website Under Maintenance, kindly visit after some time !
            </h2>
        </Grid>
    );
}
