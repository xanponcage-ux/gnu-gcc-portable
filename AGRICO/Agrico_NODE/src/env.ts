import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { networkInterfaces } from "os";

// Process variables take precedence over the profile file and shared .env.
const directory = path.resolve(__dirname, "..");
const shared = dotenv.parse(fs.existsSync(path.join(directory, ".env"))
  ? fs.readFileSync(path.join(directory, ".env")) : "");
const profile = process.env.AGRINXT_ENV || shared.AGRINXT_ENV ||
  (process.env.NODE_ENV === "production" ? "prd" : "local");
const profiles = {
  local: { appserver: "LOCAL", deploy: "N", appport: 5559, database: "EPATEST", origin: "http://localhost:3000" },
  dev:   { appserver: "DEV",   deploy: "Y", appport: 5554, database: "EPATEST", origin: "" },
  prd:   { appserver: "PRD",   deploy: "Y", appport: 5554, database: "", origin: "" },
};
if (profile !== "local" && profile !== "dev" && profile !== "prd") {
  throw new Error("AGRINXT_ENV must be local, dev or prd");
}
const defaults = profiles[profile as keyof typeof profiles];
const settings: Record<string, string | undefined> = { ...shared, ...dotenv.config({path: path.join(directory, ".env." + profile)}).parsed, ...process.env };
function value(name: string, fallback = "") {
  return settings[name] || fallback;
}
function required(name: string, fallback = "") {
  const result = value(name, fallback);
  if (!result) throw new Error("Missing " + name + " for Agrico " + profile);
  return result;
}
function port(name: string, fallback: number) {
  const n = Number(value(name, String(fallback)));
  if (!Number.isInteger(n) || n < 1 || n > 65535) throw new Error("Invalid " + name);
  return n;
}
const database = required("AGRINXT_DB_SERVICE", defaults.database);
const host = value("AGRINXT_DB_HOST");
const dbPort = port("AGRINXT_DB_PORT", 1521);
export const GetIp = () => {
  for (const entries of Object.values(networkInterfaces())) {
    const address = entries?.find(entry => entry.family === "IPv4" && !entry.internal);
    if (address) return address.address;
  }
  return "0.0.0.0";
};
export default {
  ...defaults, database, host, port: dbPort,
  appport: port("AGRINXT_APP_PORT", defaults.appport),
  dbUri: value("AGRINXT_DB_CONNECT_STRING", host ? host + ":" + dbPort + "/" + database : database),
  whitelistdUrl: required("AGRINXT_UI_ORIGIN", defaults.origin).split(",").map(origin => origin.trim()),
  hashRoute: "agrigomes", devMode: "N",
  CHAVE_JWT: required("CHAVE_JWT"), API_KEY: required("API_KEY"),
  REFRESH_KEY: required("REFRESH_KEY"), SCREEN_AUTH_KEY: required("SCREEN_AUTH_KEY"),
  ORACLE: required("ORACLE"), JWT_KEY: required("JWT_KEY"),
  saltWorkFactor: value("AGRINXT_SALT_WORK_FACTOR", "10"),
  accessTokenTtl: value("AGRINXT_ACCESS_TOKEN_TTL", "15m"),
  refreshTokenTtl: value("AGRINXT_REFRESH_TOKEN_TTL", "1y"),
  SOAP_URL: required("AGRINXT_SOAP_URL"), pythonURL: value("AGRINXT_PYTHON_URL"),
};
