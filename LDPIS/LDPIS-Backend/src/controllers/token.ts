require("dotenv").config();
import jwt from "jsonwebtoken";
import crypto from "crypto";
import moment from "moment";
import Error from "../models/errors";
import env from "../env";
//import tokenList from "../infrastructure/database/tokenList";
// import allowlistRefreshToken from '../infrastructure/redis/allowlistRefreshToken'
// import blocklistAccessToken from '../infrastructure/redis/blocklistAccessToken'

/**
 *
 * @param id
 * @param param1
 */
function createTokenJWT(
  id: any,
  [timeQuantity, timeUnity]: any,
  sessionId: string
) {
  const payload = id;

  // Create token
  const privateKey: any = env.CHAVE_JWT;
  let APIKEY: any = env.API_KEY;
  let key = APIKEY.split("-")
    .sort(() => Math.floor(Math.random() * Math.floor(3)) - 1)
    .join("-");
  const token = jwt.sign(
    {
      payload,
      // apikey: env.API_KEY,
      signature: key,
      appName: "tsmmes",
      sessionId,
      iat: Math.floor(Date.now() / 1000) - 60,
    },
    privateKey,
    {
      algorithm: "HS256",
      notBefore: 0,
      expiresIn: 900,
      audience: "TSM_MES_API",
      issuer: "tsmmesProgram",
    }
  );
  return token;
}

/**
 *
 * @param token
 * @param name
 * @param blocklist
 */
async function verifyTokenJWT(token: string, name: string, blocklist?: any) {
  //await verifyTokenNaBlocklist(token, name, blocklist)
  const id = jwt.verify(token, env.CHAVE_JWT as string);
  //blocklistAccessToken.add(token);
  return id;
}

/**
 *
 * @param token
 * @param name
 * @param blocklist
 */
async function verifyTokenNaBlocklist(
  token: string,
  name: string,
  blocklist: any
) {
  if (!blocklist) {
    return;
  }

  const tokenNaBlocklist = await blocklist.containsToken(token);
  if (tokenNaBlocklist) {
    throw new jwt.JsonWebTokenError(`${name} invalid logout!`);
  }
}

/**
 *
 * @param token
 * @param blocklist
 */
function invalidTokenJWT(token: string, blocklist: string[]) {
  return blocklist.push(token);
}

/**
 *
 * @param id
 * @param param1
 * @param allowlist
 */
async function createTokenOpacity(
  id: any,
  plant: any,
  company: any,
  [timeQuantity, timeUnity]: any,
  sessionId: string
) {
  // const tokenOpacity = crypto.randomBytes(24).toString('hex')
  // const dateExpiration = moment().add(timeQuantity, timeUnity).unix()
  // //await allowlist.add(tokenOpacity, id, dateExpiration)
  // return tokenOpacity

  // const payload = id;

  const payload = {
    id: id,
    plant: plant,
    company: company,
  };

  // Create token
  const privateKey: any = env.REFRESH_KEY;
  let APIKEY: any = env.API_KEY;
  let key = APIKEY.split("-")
    .sort(() => Math.floor(Math.random() * Math.floor(3)) - 1)
    .join("-");
  const token = jwt.sign(
    {
      payload,
      // apikey: env.API_KEY,
      signature: key,
      appName: "tsmmes",
      sessionId,
      iat: Math.floor(Date.now() / 1000) - 60,
    },
    privateKey,
    {
      algorithm: "HS256",
      notBefore: 0,
      expiresIn: 24 * 60 * 60 * 1000,
      audience: "TSM_MES_API",
      issuer: "tsmmesProgram",
    }
  );
  return token;
}

/**
 *
 * @param token
 * @param name
 * @param allowlist
 */
async function verifyTokenOpacity(
  token: string,
  name: string,
  allowlist?: any
) {
  verifyTokenSend(token, name);
  const id = await allowlist.searchValue(token);
  verifyTokenValido(id, name);
  return id;
}

/**
 *
 * @param token
 * @param allowlist
 */
async function invalidTokenOpacity(token: string, allowlist: any) {
  await allowlist.deleta(token);
}

/**
 *
 * @param id
 * @param name
 */
function verifyTokenValido(id: number, name: string) {
  if (!id) {
    throw new Error.InvalidArgumentError(`${name} inválido!`);
  }
}

/**
 *
 * @param token
 * @param name
 */
function verifyTokenSend(token: string, name: string) {
  if (!token) {
    throw new Error.InvalidArgumentError(`${name} não enviado!`);
  }
}

export default {
  /**
   *
   */
  access: {
    name: "access token",
    expiration: [15, "m"],
    create(id: any, sessionId: string) {
      return createTokenJWT(id, this.expiration, sessionId);
    },
    // verify(token: any) {
    //   return verifyTokenJWT(token, this.name)
    // },
    invalid(token: string, blockedTokenList: string[]) {
      return invalidTokenJWT(token, blockedTokenList);
    },
  },
  /**
   *
   */
  refresh: {
    name: "refresh token",
    expiration: [5, "d"],
    create(id: any, plant: any, company: any, sessionId: string) {
      return createTokenOpacity(id, plant, company, this.expiration, sessionId);
    },
    // verify(token: string) {
    //   return verifyTokenOpacity(token, this.name, this.list)
    // },
    // invalid(token: string) {
    //   return invalidTokenOpacity(token, this.list)
    // }
  },
  /**
   *
   */
  verifyEmail: {
    name: "token verify email",
    expiration: [1, "h"],
    create(id: number, sessionId: string = "") {
      return createTokenJWT(id, this.expiration, sessionId);
    },
    verify(token: string) {
      return verifyTokenJWT(token, this.name);
    },
  },
};
