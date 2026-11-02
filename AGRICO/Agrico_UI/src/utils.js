import React from "react";
import serverDetails from "variables/serverDetails";
import axiosAPI from "axiosAPI";
import alertify from "alertifyjs";

export const GetAuthorization = () => {
  return new Promise(async (resolve, reject) => {
    const defaultOptions = {
      headers: {
        Authorization:
          "Bearer " + (await localStorage.getItem("tmm_accessToken")),
      },
    };
    const url = serverDetails.baseURL + serverDetails.RefreshTokenAPI;
    axiosAPI
      .post(
        url,
        { refreshToken: await localStorage.getItem("tmm_refreshToken") },
        defaultOptions
      )
      .then((response) => {
        if (response.data.Err) {
          alertify.error(response?.data?.Err?.toString());
          window.location.href = "#/signin";
        } else if (response.statusText != "" && response.statusText != "OK") {
          reject(response.statusText?.toString());
        } else {
          localStorage.setItem("tmm_accessToken", response.data.accessToken);
          localStorage.setItem("tmm_refreshToken", response.data.refreshToken);
          resolve(response.data);
        }
      })
      .catch((e) => {
        alertify.error(e?.toString());
        window.location.href = "#/signin";
      });
  });
};
