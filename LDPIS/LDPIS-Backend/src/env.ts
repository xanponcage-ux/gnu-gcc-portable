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
};

const devLDP = {
  CHAVE_JWT: "4eab6260-ef82-46bb-9027-69fbbb31377f",
  API_KEY: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  REFRESH_KEY: "9231f9cc-557c-4dd8-ac5c-babc20aad792",
  SCREEN_AUTH_KEY: "8e38c77d-ec78-481d-8658-8911d5a1e142",
  ORACLE: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  JWT_KEY: "secret",
  appport: 5518,
  dbUri: "10.152.98.196:1521/ldpisdev",
  saltWorkFactor: "10",
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  host: "10.152.98.196",
  port: 1521,
  database: "ldpisdev",
  whitelistdUrl: ["https://tslweblindev.corp.tatasteel.com"],
  SOAP_URL: "https://tslapiadso.corp.tatasteel.com/FSSO/Service.asmx?WSDL",
  hashRoute: "tubesnext_khop_hosr",
  devMode: "N",
  deploy: "Y",
};

const prd = {
  CHAVE_JWT: "4eab6260-ef82-46bb-9027-69fbbb31377f",
  API_KEY: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  REFRESH_KEY: "9231f9cc-557c-4dd8-ac5c-babc20aad792",
  SCREEN_AUTH_KEY: "8e38c77d-ec78-481d-8658-8911d5a1e142",
  ORACLE: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  JWT_KEY: "secret",
  appport: 5550,
  dbUri: "132.145.99.84:1521/ldpisprd",
  saltWorkFactor: "10",
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  host: "132.145.99.84",
  port: 1521,
  database: "ldpisprd",
  whitelistdUrl: ["https://tsmwebappsk.corp.tatasteel.com"],
  SOAP_URL: "https://tslapiadso.corp.tatasteel.com/FSSO/Service.asmx?WSDL",
  hashRoute: "ldpisprd",
  devMode: "N",
  deploy: "Y",
};

// const prdTst = {
//   CHAVE_JWT: "4eab6260-ef82-46bb-9027-69fbbb31377f",
//   API_KEY: "6cc0a083-237c-4947-ba25-afeb388e54e9",
//   REFRESH_KEY: "9231f9cc-557c-4dd8-ac5c-babc20aad792",
//   SCREEN_AUTH_KEY: "8e38c77d-ec78-481d-8658-8911d5a1e142",
//   ORACLE: "6cc0a083-237c-4947-ba25-afeb388e54e9",
//   JWT_KEY: "secret",
//   appport: 5554,
//   dbUri: "132.145.99.84:1521/tsmtubprdk",
//   saltWorkFactor: "10",
//   accessTokenTtl: "15m",
//   refreshTokenTtl: "1y",
//   host: "132.145.99.84",
//   port: 1521,
//   database: "tsmtubprdk",
//   whitelistdUrl: ['https://132.145.99.102'],
//   SOAP_URL: "https://tslapiadso.corp.tatasteel.com/FSSO/Service.asmx?WSDL",
//   hashRoute: "tsmtubesmes",
//   devMode: "N",
//   deploy: "Y"
// };

//dev local
const local = {
  CHAVE_JWT: "4eab6260-ef82-46bb-9027-69fbbb31377f",
  API_KEY: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  REFRESH_KEY: "9231f9cc-557c-4dd8-ac5c-babc20aad792",
  SCREEN_AUTH_KEY: "8e38c77d-ec78-481d-8658-8911d5a1e142",
  ORACLE: "6cc0a083-237c-4947-ba25-afeb388e54e9",
  JWT_KEY: "secret",
  appport: 5555,
  dbUri: "10.152.98.196:1521/ldpisdev", //QA
  saltWorkFactor: "10",
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  host: "10.152.98.196", //QA
  port: 1521,
  database: "ldpisdev", //QA
  whitelistdUrl: ["*"],
  SOAP_URL: "https://tslapiadso.corp.tatasteel.com/FSSO/Service.asmx?WSDL",
  devMode: "N",
  deploy: "N",
};

// // prd local
// const local = {
//   CHAVE_JWT: "4eab6260-ef82-46bb-9027-69fbbb31377f",
//   API_KEY: "6cc0a083-237c-4947-ba25-afeb388e54e9",
//   REFRESH_KEY: "9231f9cc-557c-4dd8-ac5c-babc20aad792",
//   SCREEN_AUTH_KEY: "8e38c77d-ec78-481d-8658-8911d5a1e142",
//   ORACLE: "6cc0a083-237c-4947-ba25-afeb388e54e9",
//   JWT_KEY: "secret",
//   appport: 5555,
//   dbUri: "132.145.99.84:1521/ldpisprd", //QA
//   saltWorkFactor: "10",
//   accessTokenTtl: "15m",
//   refreshTokenTtl: "1y",
//   host: "132.145.99.84", //QA
//   port: 1521,
//   database: "ldpisprd", //QA
//   whitelistdUrl: ["*"],
//   SOAP_URL: "https://tslapiadso.corp.tatasteel.com/FSSO/Service.asmx?WSDL",
//   devMode: "N",
//   deploy: "N",
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
  ...(varVal === "dev" && devLDP),
  ...(varVal === "uat" && qakhapoli),
  ...(varVal === "local" && local),
  //...varVal === 'prdTst' && prdTst
};

export default env;
