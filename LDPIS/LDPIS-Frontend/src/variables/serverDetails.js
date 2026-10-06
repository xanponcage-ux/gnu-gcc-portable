let envDetails = "http://localhost:5555/";

if (window?.location?.origin?.includes("tslweblindev.corp.tatasteel.com")) {
  envDetails = "https://tslweblindev.corp.tatasteel.com:5518/";
} else if (
  window?.location?.origin?.includes("tslweblinuat.corp.tatasteel.com")
) {
  envDetails = "https://tslweblinuat.corp.tatasteel.com:5554/";
} else if (
  window?.location?.origin?.includes("tsmwebappsk.corp.tatasteel.com")
) {
  envDetails = "https://tsmwebappsk.corp.tatasteel.com:5550/";
} else if (window?.location?.origin?.includes("132.145.99.102")) {
  envDetails = "https://132.145.99.102:5554/";
}

const serverDetails = {
  //local->
  baseURL: envDetails,

  //qa->
  // baseURL: 'https://tslweblinuat.corp.tatasteel.com:5559/',

  //dev->
  // baseURL: 'https://tslweblindev.corp.tatasteel.com:5559/',

  //qa-khapoli>
  // baseURL: 'https://tslweblinuat.corp.tatasteel.com:5554/',

  //dev-khapoli>
  // baseURL: 'https://tslweblindev.corp.tatasteel.com:5554/',

  //PRD->
  // baseURL: 'https://tsmwebapps01.corp.tatasteel.com:5559/',

  RefreshTokenAPI: "api/users/refresh_token",
  REFRESH_KEY: "9231f9cc-557c-4dd8-ac5c-babc20aad792",
  SCREEN_AUTH_KEY: "8e38c77d-ec78-481d-8658-8911d5a1e142",
  PersonalNo: "",
  AccessToken: "",
  RefreshToken: "",
  PageAccess: "",
  Roles: "",
  ViewAccess: "",
  SessionId: "",
  Company: "",
  Plant: "",
  devMode: false,
};

export default serverDetails;
