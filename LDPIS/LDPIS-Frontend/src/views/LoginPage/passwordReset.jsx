import React, { useEffect, useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Grid from "@mui/material/Grid";
import alertify from "alertifyjs";
import "../alertifyjs.css";
import { useParams } from "react-router-dom";
import logoTube from "../../assets/Logo/logo.jpeg";

import axiosAPI from "../../axiosAPI";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";

export default function PasswordReset(props) {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const Onsend = (e) => {
        e.preventDefault();
        var password = document.getElementById("password").value;
        var url = "api/users/resetPassword";
        if (!(password && password?.length > 0)) {
            alertify.error("Please enter password!");
            return;
        }
        const data = {
            url: id?.replace('%2F', '/'),
            password: password
        }
        axiosAPI
            .post(url, data)
            .then((response) => {
                setLoading(false);
                if (response?.statusText != "" && response?.statusText != "OK") {
                    // auto logout if 401 response returned from api
                    // logout();
                    return Promise.reject(response.statusText);
                } else if (response?.data?.status === true) {
                    alertify.success(response?.data?.message ?? "Something went wrong!");
                } else {
                    alertify.error(response?.data?.Err ?? "Something went wrong!");
                }
            })
            .catch((e) => {
                setLoading(false);
                alertify.error("Something went wrong!");
            });
    }

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
                            alt="Logo"
                        />
                        <CardContent>
                            <MDTypography
                                variant="h4"
                                fontWeight="medium"
                                color="dark"
                                mt={1}
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
                    <MDBox component="form" role="form" onSubmit={Onsend}>
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
                        <MDBox mt={4} mb={1}>
                            <MDButton
                                variant="gradient"
                                color="info"
                                fullWidth
                                type="submit"
                            >
                                Reset Password
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}
