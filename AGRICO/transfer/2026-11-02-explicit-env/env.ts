const local = {
  CHAVE_JWT: process.env.CHAVE_JWT!,
  API_KEY: process.env.API_KEY!,
  REFRESH_KEY: process.env.REFRESH_KEY!,
  SCREEN_AUTH_KEY: process.env.SCREEN_AUTH_KEY!,
  ORACLE: process.env.ORACLE!,
  JWT_KEY: process.env.JWT_KEY!,
  appport: 5559,
  dbUri: process.env.AGRINXT_DB_CONNECT_STRING || "EPATEST",
  saltWorkFactor: "10",
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  host: process.env.AGRINXT_DB_HOST || "",
  port: 1521,
  database: "EPATEST",
  whitelistdUrl: ["http://localhost:3000"],
  SOAP_URL: process.env.AGRINXT_SOAP_URL!,
  hashRoute: "agrigomes",
  devMode: "N",
  deploy: "N",
  appserver: "LOCAL",
  pythonURL: process.env.AGRINXT_PYTHON_URL!,
};

const devAgrico = {
  CHAVE_JWT: process.env.CHAVE_JWT!,
  API_KEY: process.env.API_KEY!,
  REFRESH_KEY: process.env.REFRESH_KEY!,
  SCREEN_AUTH_KEY: process.env.SCREEN_AUTH_KEY!,
  ORACLE: process.env.ORACLE!,
  JWT_KEY: process.env.JWT_KEY!,
  appport: 5554,
  dbUri: process.env.AGRINXT_DB_CONNECT_STRING || "EPATEST",
  saltWorkFactor: "10",
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  host: process.env.AGRINXT_DB_HOST || "",
  port: 1521,
  database: "EPATEST",
  whitelistdUrl: [process.env.AGRINXT_UI_ORIGIN!],
  SOAP_URL: process.env.AGRINXT_SOAP_URL!,
  hashRoute: "agrigomes",
  devMode: "N",
  deploy: "Y",
  appserver: "DEV",
  pythonURL: process.env.AGRINXT_PYTHON_URL!,
};

const prdAgrico = {
  CHAVE_JWT: process.env.CHAVE_JWT!,
  API_KEY: process.env.API_KEY!,
  REFRESH_KEY: process.env.REFRESH_KEY!,
  SCREEN_AUTH_KEY: process.env.SCREEN_AUTH_KEY!,
  ORACLE: process.env.ORACLE!,
  JWT_KEY: process.env.JWT_KEY!,
  appport: 5554,
  dbUri: process.env.AGRINXT_PRD_DB_CONNECT_STRING!,
  saltWorkFactor: "10",
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  host: process.env.AGRINXT_PRD_DB_HOST || "",
  port: 1521,
  database: process.env.AGRINXT_PRD_DB_SERVICE!,
  whitelistdUrl: [process.env.AGRINXT_PRD_UI_ORIGIN!],
  SOAP_URL: process.env.AGRINXT_SOAP_URL!,
  hashRoute: "agrigomes",
  devMode: "N",
  deploy: "Y",
  appserver: "PRD",
  pythonURL: process.env.AGRINXT_PYTHON_URL!,
};

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

let varVal = process.env.AGRINXT_ENV || "local";
if (!process.env.AGRINXT_ENV) {
  if (GetIp() === process.env.AGRINXT_DEV_SERVER_IP) varVal = "dev";
  if (GetIp() === process.env.AGRINXT_PRD_SERVER_IP || process.env.NODE_ENV === "production") varVal = "prd";
}
if (!["local", "dev", "prd"].includes(varVal)) throw new Error("Unknown Agrico environment: " + varVal);
const env = {
  ...(varVal === "local" && local),
  ...(varVal === "dev" && devAgrico),
  ...(varVal === "prd" && prdAgrico),
};
if (varVal === "prd" && (!env.dbUri || !env.database || !env.whitelistdUrl?.[0])) {
  throw new Error("Configure the Agrico production database and UI origin before starting PRD");
}

export default env;
