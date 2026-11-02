const qakhapoli = {
  CHAVE_JWT: "4eab6260-ef82-46bb-9027-69fbbb31377f",
  API_KEY: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  REFRESH_KEY: "9231f9cc-557c-4dd8-ac5c-babc20aad792",
  SCREEN_AUTH_KEY: "8e38c77d-ec78-481d-8658-8911d5a1e142",
  ORACLE: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  JWT_KEY: "secret",
  appport: 5554,
  dbUri: "10.152.98.191:1521/khtubeqa",
  saltWorkFactor: "10",
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  host: "10.152.98.191",
  port: 1521,
  database: "khtubeqa",
  whitelistdUrl: ["https://tslweblinuat.corp.tatasteel.com"],
  SOAP_URL: "https://tslapiadso.corp.tatasteel.com/FSSO/Service.asmx?WSDL",
  hashRoute: "tubesnext_khop_hosr",
  devMode: "N",
  deploy: "Y",
  appserver: "QA",
  pythonURL: "https://tsldev19.corp.tatasteel.com:8226",
};

const devkhapoli = {
  CHAVE_JWT: "4eab6260-ef82-46bb-9027-69fbbb31377f",
  API_KEY: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  REFRESH_KEY: "9231f9cc-557c-4dd8-ac5c-babc20aad792",
  SCREEN_AUTH_KEY: "8e38c77d-ec78-481d-8658-8911d5a1e142",
  ORACLE: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  JWT_KEY: "secret",
  appport: 5554,
  dbUri: "10.45.99.153:1521/khtubedev", //10.45.69.219
  saltWorkFactor: "10",
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  host: "10.45.99.153",
  port: 1521,
  database: "khtubedev",
  whitelistdUrl: ["https://tslweblindev.corp.tatasteel.com"],
  SOAP_URL: "https://tslapiadso.corp.tatasteel.com/FSSO/Service.asmx?WSDL",
  hashRoute: "tubesnext_khop_hosr",
  devMode: "N",
  deploy: "Y",
  appserver: "DEV",
   pythonURL: "https://tsldev19.corp.tatasteel.com:8226",
};

const prd = {
  CHAVE_JWT: "4eab6260-ef82-46bb-9027-69fbbb31377f",
  API_KEY: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  REFRESH_KEY: "9231f9cc-557c-4dd8-ac5c-babc20aad792",
  SCREEN_AUTH_KEY: "8e38c77d-ec78-481d-8658-8911d5a1e142",
  ORACLE: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  JWT_KEY: "secret",
  appport: 5554,
  dbUri: "132.145.99.84:1521/tsmtubprdk",
  saltWorkFactor: "10",
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  host: "132.145.99.84",
  port: 1521,
  database: "tsmtubprdk",
  whitelistdUrl: ["https://tsmwebappsk.corp.tatasteel.com"],
  SOAP_URL: "https://tslapiadso.corp.tatasteel.com/FSSO/Service.asmx?WSDL",
  hashRoute: "tsmtubesmes",
  devMode: "N",
  deploy: "Y",
  appserver: "PRD",
  pythonURL: "https://tslaiappprd01.corp.tatasteel.com/aimlfptb",//
};

const prdTst = {
  CHAVE_JWT: "4eab6260-ef82-46bb-9027-69fbbb31377f",
  API_KEY: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  REFRESH_KEY: "9231f9cc-557c-4dd8-ac5c-babc20aad792",
  SCREEN_AUTH_KEY: "8e38c77d-ec78-481d-8658-8911d5a1e142",
  ORACLE: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  JWT_KEY: "secret",
  appport: 5554,
  dbUri: "132.145.99.84:1521/tsmtubprdk",
  saltWorkFactor: "10",
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  host: "132.145.99.84",
  port: 1521,
  database: "tsmtubprdk",
  whitelistdUrl: ['https://132.145.99.102'],
  SOAP_URL: "https://tslapiadso.corp.tatasteel.com/FSSO/Service.asmx?WSDL",
  hashRoute: "tsmtubesmes",
  devMode: "N",
  deploy: "Y",
  appserver: "PRD",
   pythonURL: "https://tsldev19.corp.tatasteel.com:8226",
};

const local = {
  // DEVLOCAL
  CHAVE_JWT: "4eab6260-ef82-46bb-9027-69fbbb31377f",
  API_KEY: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  REFRESH_KEY: "9231f9cc-557c-4dd8-ac5c-babc20aad792",
  SCREEN_AUTH_KEY: "8e38c77d-ec78-481d-8658-8911d5a1e142",
  ORACLE: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  JWT_KEY: "secret",
  appport: 5559,
  dbUri: "10.45.99.153:1521/khtubedev",
  saltWorkFactor: "10",
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  host: "10.45.99.153",
  port: 1521,
  database: "khtubedev", //"tsmtubprdk",//
  whitelistdUrl: ["*"],
  SOAP_URL: "https://tslapiadso.corp.tatasteel.com/FSSO/Service.asmx?WSDL",
  hashRoute: "khtubedev",
  devMode: "N",
  deploy: "N",
  appserver: "LOCAL",
   pythonURL: "https://tsldev19.corp.tatasteel.com:8226",
};

// const local = {
//   // PRDLOCAL
//   CHAVE_JWT: "4eab6260-ef82-46bb-9027-69fbbb31377f",
//   API_KEY: "6cc0a083-237c-4947-ba25-afeb388e54e9",
//   REFRESH_KEY: "9231f9cc-557c-4dd8-ac5c-babc20aad792",
//   SCREEN_AUTH_KEY: "8e38c77d-ec78-481d-8658-8911d5a1e142",
//   ORACLE: "6cc0a083-237c-4947-ba25-afeb388e54e9",
//   JWT_KEY: "secret",
//   appport: 5559,
//   dbUri: "132.145.99.84:1521/tsmtubprdk",
//   saltWorkFactor: "10",
//   accessTokenTtl: "15m",
//   refreshTokenTtl: "1y",
//   host: "132.145.99.84",
//   port: 1521,
//   database: "tsmtubprdk", //"tsmtubprdk",//
//   whitelistdUrl: ["*"],
//   SOAP_URL: "https://tslapiadso.corp.tatasteel.com/FSSO/Service.asmx?WSDL",
//   hashRoute: "khtubedev",
//   devMode: "N",
//   deploy: "N",
//   appserver: "PRD",
//   pythonURL: "https://tslaiappprd01.corp.tatasteel.com/aimlfptb",
// };

export const GetIp = () => {
  var interfaces = require("os").networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      )
        return alias.address;
    }
  }
  return "0.0.0.0";
};

let varVal = "local";

if (GetIp() === "176.0.15.164") {
  varVal = "dev";
}
if (GetIp() === "176.0.15.247") {
  varVal = "uat";
}
if (GetIp() === "132.145.99.102") {
  // DB IP different from 132.145.99.84 in above prd
  varVal = "prd";
}
// if (GetIp() === '132.145.99.102') {
//   varVal = 'prdTst'
// }
console.log(GetIp());
const env = {
  ...(varVal === "prd" && prd),
  ...(varVal === "dev" && devkhapoli),
  ...(varVal === "uat" && qakhapoli),
  ...(varVal === "local" && local),
  //...varVal === 'prdTst' && prdTst
};

export default env;
