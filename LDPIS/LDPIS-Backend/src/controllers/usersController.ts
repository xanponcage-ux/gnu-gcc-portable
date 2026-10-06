import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/usersModel";
import { User } from "../typed/typed";
import tokens from "./token";
import soapHandeler from "../utils/soapHandeler";
import env from "../env";
import { setValue } from "express-ctx";
import oracledb from "oracledb";
var CryptoJS = require("crypto-js");
import transporter from "../mailler";

// let refreshTokenList: Array<string> = [];
// let accessTokenList: Array<string> = [];
// let blockedTokenList: Array<string> = [];

export const insertUser = async (req: Request, res: Response) => {
  const user: User = {
    name: req.body.name,
    email: req.body.email,
    passwordHash: req.body.passwordHash,
    abilitys: req.body.abilitys,
    photo: req.body.photo,
    emailVerify: req.body.emailVerify,
  };
  try {
    const id = await UserModel.prototype.insert(user);
    const token = tokens.verifyEmail.create(id);
    const address = generateAddress("/api/users/verify_email/", token);
    UserModel.prototype.sendEmail(address, user);
    return res.status(201).json({ message: "Inserido com sucesso" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const results = await UserModel.prototype.getUsers();
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const results = await UserModel.prototype.getUserById("");
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const editUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user: User = {
    name: req.body.name,
    email: req.body.email,
    passwordHash: req.body.passwordHash,
    abilitys: req.body.abilitys,
    photo: req.body.photo,
    emailVerify: req.body.emailVerify,
  };
  try {
    const results = await UserModel.prototype.editUser(req.body, id);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const deletetUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const results = await UserModel.prototype.deleteUser(id);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const checkUserPassword = async (userId: string, password: string) =>
  new Promise(async (resolve, reject) => {
    try {
      const conn = await oracledb.getConnection({
        user: userId,
        password: password,
        connectString: env.dbUri as string,
      });
      conn.release();
      return resolve({
        status: true,
      });
    } catch (error: any) {
      console.log(error);
      return reject({
        status: false,
        message: error?.message,
      });
    }
    // execute
  });

const checkExistingPool = async (adId: string) =>
  new Promise(async (resolve, reject) => {
    try {
      const pool = await oracledb.getPool(adId);
      return resolve({
        status: true,
      });
    } catch (error: any) {
      console.log(error);
      return reject({
        status: false,
        message: error?.message,
      });
    }
  });

export const login = async (req: any, res: Response, next: any) => {
  var sessionId = generateSession(24);
  try {
    let poolMin = 2,
      poolMax = 10,
      idleTime = 60;
    var t = "21144S3984CEF5c659C44ZCK37299B4208375IG7DC792A30";
    var key = CryptoJS.MD5(t).toString();
    var text = req.body.userDetails as string;
    var decrypted = JSON.parse(
      CryptoJS.TripleDES.decrypt(text, key).toString(CryptoJS.enc.Utf8)
    );
    const username = decrypted.username;
    const password = decrypted.password;
    const eSession = decrypted.sessionId;
    setValue("user", `${username}_${sessionId}`);

    if (eSession && eSession?.length > 0) {
      try {
        await oracledb.getPool(`${username}_${eSession}`).terminate();
      } catch (error) {}
    }

    var poolFlag = false;
    var verifySoap = true;
    try {
      poolFlag = true;
      const { ...results }: any = await checkUserPassword(username, password); // Throw automatic invalid credential

      try {
        const existing = await checkExistingPool(`${username}_${sessionId}`);
      } catch (e: any) {
        const createPool = await oracledb.createPool({
          user: username,
          password: password,
          connectString: env.dbUri as string,
          poolMin: poolMin,
          poolMax: poolMax,
          poolAlias: `${username}_${sessionId}`,
        });
      }
    } catch (error: any) {
      return res.status(200).json({
        status: false,
        Err: error.message.split(": ")?.[1] ?? "Something went wrong",
      });
    }

    let passcodeDetails = await UserModel.prototype.getPasscode(
      username,
      "USR_PCODE_NEW_FL, USR_PASSCODE"
    );
    passcodeDetails.rows = passcodeDetails.rows[0];
    if (!decrypted.passcode && decrypted.passcode?.toString()?.length !== 6) {
      return res.status(200).json({
        status: false,
        Err: "passcode Validation Err!",
      });
    } else if (passcodeDetails.rows[0] !== "N") {
      if (
        passcodeDetails.rows[1]?.toString() !== decrypted.passcode?.toString()
      ) {
        return res.status(200).json({
          status: false,
          Err: "Wrong Passcode",
        });
      } else if (!decrypted.newPasscode) {
        return res.status(200).json({
          status: false,
          Err: "NP-New passcode Required!",
        });
      } else if (
        decrypted.newPasscode?.toString()?.length !== 6 &&
        !Number(decrypted.newPasscode)
      ) {
        return res.status(200).json({
          status: false,
          Err: "New Passcode Error",
        });
      } else {
        const results = await UserModel.prototype.updatePasscode(
          username,
          decrypted.newPasscode?.toString(),
          "N"
        );
        return res.status(200).json({
          status: true,
          message: "Passcode Updated Successfully",
        });
      }
    } else {
      if (
        passcodeDetails.rows[1]?.toString() !== decrypted.passcode?.toString()
      ) {
        return res.status(200).json({
          status: false,
          Err: "Wrong Passcode",
        });
      }
    }

    if (verifySoap) {
      const results = await UserModel.prototype.getUserById(username);

      var companyCode = "";
      if (
        typeof results !== "undefined" &&
        results.rows &&
        results.rows.length > 0
      ) {
        const accessToken = tokens.access.create(username, sessionId);
        const refreshToken = await tokens.refresh.create(
          username,
          "",
          "",
          sessionId
        );
        // accessTokenList.push(accessToken);
        // refreshTokenList.push(refreshToken);
        res.set("Authorization", accessToken);
        return res.status(200).json({
          refreshToken,
          accessToken,
          results,
          sessionId,
          status: true,
          idleTime,
        });
      } else {
        return res.status(200).json({ Err: "User not found" });
      }
    } else {
      next(false);
      res.status(401).json({ Err: "The user name or password is incorrect." });
    }
  } catch (error) {
    next(error);
  }
};

export const getNewToken = async (req: any, res: Response, next: any) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined" && bearerHeader.length > 0) {
      //const id:any = req.user[0][0];//jwt.verify(oldToken, env.CHAVE_JWT as string)
      try {
        let oldAccessToken = (bearerHeader as string).replace("Bearer ", "");
        let currentRefreshToken: string = req.body.refreshToken;
        const tokenDecrypted: any = jwt.verify(
          currentRefreshToken,
          env.REFRESH_KEY as string
        );
        const id: any = tokenDecrypted.payload.id; //.payload;
        const plant: any = tokenDecrypted.payload.plant;
        const company: any = tokenDecrypted.payload.company;
        const sessionId: string = tokenDecrypted.sessionId;
        const existing = await checkExistingPool(`${id}_${sessionId}`);
        const accessToken = tokens.access.create(id, sessionId);
        const refreshToken = await tokens.refresh.create(
          id,
          plant,
          company,
          sessionId
        );
        // accessTokenList.push(accessToken);
        // refreshTokenList.push(refreshToken);
        res.set("Authorization", accessToken);
        res.status(200).json({ accessToken, refreshToken });
      } catch (e: any) {
        return res.status(200).json({ Err: "User not found" });
      }
    } else {
      return res.status(200).json({ Err: "Invalid token" });
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: any, res: Response, next: any) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined" && bearerHeader.length > 0) {
      let oldAccessToken = (bearerHeader as string).replace("Bearer ", "");
      let oldRefreshToken = req.body.refreshToken;
      const tokenDecrypted: any = jwt.verify(
        oldRefreshToken,
        env.REFRESH_KEY as string
      );
      const id: any = tokenDecrypted.payload; //.payload;
      const sessionId: string = tokenDecrypted.sessionId;
      // await tokens.access.invalid(oldAccessToken, blockedTokenList);
      // await tokens.access.invalid(oldRefreshToken, blockedTokenList);

      await oracledb.getPool(`${id.id}_${sessionId}`).terminate();

      return res.status(200).json({
        status: true,
        message: "Logout successful",
      });
    }

    return res.status(200).json({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: any, res: Response, next: any) => {
  try {
    const user = req.user;
    await UserModel.prototype.verifyEmail(user);
    res.status(200).json();
  } catch (error) {
    next(error);
  }
};

export const genaratePasscode = async (req: any, res: Response) => {
  try {
    var sessionId = generateSession(24);
    let poolMin = 2,
      poolMax = 10,
      idleTime = 60;
    var t = "21144S3984CEF5c659C44ZCK37299B4208375IG7DC792A30";
    var key = CryptoJS.MD5(t).toString();
    var text = req.body.userDetails as string;
    var decrypted = CryptoJS.TripleDES.decrypt(text, key).toString(
      CryptoJS.enc.Utf8
    );
    const [username, password] = (decrypted as string).split(":");
    setValue("user", `${username}_${sessionId}`);

    var poolFlag = false;
    var verifySoap = true;
    try {
      poolFlag = true;
      const results: any = await checkUserPassword(username, password); // Throw automatic invalid credential

      try {
        const existing = await checkExistingPool(`${username}_${sessionId}`);
      } catch (e: any) {
        const createPool = await oracledb.createPool({
          user: username,
          password: password,
          connectString: env.dbUri as string,
          poolMin: poolMin,
          poolMax: poolMax,
          poolAlias: `${username}_${sessionId}`,
        });
      }
    } catch (error: any) {
      console.log(error);
      return res.status(200).json({
        status: false,
        Err: error.message.split(": ")?.[1] ?? "Something went wrong",
      });
    }
    let passcodeDetails = await UserModel.prototype.getPasscode(
      username,
      "USR_PCODE_NEW_FL, USR_PASSCODE, USR_MAILID"
    );
    passcodeDetails = passcodeDetails.rows[0];
    if (req.body.isForgot) {
      if (
        !passcodeDetails[2]
          ?.toLowerCase()
          ?.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
      ) {
        // await UserModel.prototype.updatePasscode(username, '', '')
        return res.status(200).json({
          status: true,
          message: "Please genarate your passcode for login!",
        });
      } else if (
        passcodeDetails[1] &&
        passcodeDetails[1]?.toString()?.length === 6
      ) {
        const newPasscode = Math.floor(100000 + Math.random() * 900000);
        const results = await UserModel.prototype.updatePasscode(
          username,
          newPasscode?.toString(),
          "Y"
        );
        // const sendEmail = await UserModel.prototype.sendEmailById(passcodeDetails[2]?.toLowerCase(), `Your otp is: ${newPasscode}`,  `Passcode Generation!`)
        return res.status(200).json({
          status: true,
          message: "Please check your email for your new passcode!",
        });
      } else {
        return res.status(200).json({
          status: false,
          Err: "Please generate your passcode!",
        });
      }
    } else {
      if (
        passcodeDetails[1] &&
        passcodeDetails[1]?.length === 6 &&
        !req.body.onReset
      ) {
        return res.status(200).json({
          status: false,
          Err: "Passcode is only Generated for first time!",
        });
      } else {
        if (!req.body.newPasscode) {
          return res.status(200).json({
            status: false,
            Err: "NP-New passcode Required!",
          });
        } else if (
          req.body.newPasscode?.toString()?.length !== 6 &&
          !Number(req.body.newPasscode)
        ) {
          return res.status(200).json({
            status: false,
            Err: "New Passcode Error",
          });
        } else {
          const newPasscode = req.body.newPasscode;
          const results = await UserModel.prototype.updatePasscode(
            username,
            newPasscode?.toString(),
            "N"
          );
          return res.status(200).json({
            status: true,
            message: "New Passcode Generated.",
          });
        }
      }
    }
  } catch (error: any) {
    return res.status(400).json(error?.toString());
  }
};

export const resetPassword = async (req: any, res: Response) => {
  try {
    var sessionId = generateSession(24);
    var key = "21144S3984CEF5c659C44ZCK37299B4208375IG7DC792A30";
    let requestedUserID: string = "";
    if (req.body.id) {
      requestedUserID = req.body.id;
    } else if (req.body.url && req.body.password) {
      var bytes = CryptoJS.AES.decrypt(req.body.url, key);
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      if (decryptedData?.valid && Date.now() < decryptedData?.valid) {
        requestedUserID = decryptedData.user;
      } else {
        return res.status(200).json({
          status: false,
          Err: "Not valid user!",
        });
      }
    }
    const username = "KHOPADMIN";
    const password = "mew_82dwa";
    let poolMin = 2,
      poolMax = 10,
      idleTime = 2;
    setValue("user", `${username}_${sessionId}`);

    var poolFlag = false;
    try {
      poolFlag = true;
      await checkUserPassword(username, password); // Throw automatic invalid credential

      try {
        await checkExistingPool(`${username}_${sessionId}`);
      } catch (e: any) {
        console.log("error5", e);
        await oracledb.createPool({
          user: username,
          password: password,
          connectString: env.dbUri as string,
          poolMin: poolMin,
          poolMax: poolMax,
          poolTimeout: idleTime,
          poolAlias: `${username}_${sessionId}`,
        });
      }
      if (req.body.id) {
        let emailDetails = await UserModel.prototype.getPasscode(
          requestedUserID,
          "USR_MAILID"
        );
        emailDetails = emailDetails.rows?.[0];
        if (
          emailDetails?.[0]
            ?.toLowerCase()
            ?.match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
        ) {
          var data = { user: requestedUserID, valid: Date.now() + 60000 * 15 };
          var ciphertext = CryptoJS.AES.encrypt(
            JSON.stringify(data),
            key
          ).toString();
          var WHITELISTURL: any = env.whitelistdUrl;
          const mailOptions = {
            from: "epaissupport@tatasteel.com", // sender address
            to: emailDetails[0], // list of receivers
            subject: "Tubes: Password Reset", // Subject line
            html: `Hi, <br /><br />Please click on below link to reset the password. <br /><br /> <a style="color: blue">${
              WHITELISTURL?.[0]?.length > 10
                ? WHITELISTURL[0]
                : "http://localhost:3000"
            }/tubesnext_khop_hosr/#/resetPassword/${ciphertext?.replace(
              /\//g,
              "%2F"
            )}</a><br /><br /> This link is valid only for 15min.`,
          };
          transporter().sendMail(mailOptions, function (error: any, info: any) {
            if (error) {
              console.log("error4", error);
              return res.status(200).json({
                status: false,
                Err: error?.message?.toString(),
              });
            } else {
              return res.status(200).json({
                status: true,
                message: "Email sent successfully!",
              });
            }
          });
        } else {
          return res.status(200).json({
            status: false,
            Err: "Email ID missing!",
          });
        }
      } else if (req.body.url && req.body.password) {
        try {
          await UserModel.prototype.changePassword(
            requestedUserID,
            req.body.password
          );
          return res.status(200).json({
            status: true,
            message: "Password change successfully!",
          });
        } catch (error: any) {
          console.log("error3", error);
          return res.status(200).json({
            status: false,
            Err: error?.message?.toString(),
          });
        }
      } else {
        return res.status(200).json({
          status: false,
          Err: "Wrong Param!",
        });
      }
    } catch (error: any) {
      console.log("error2", error);
      return res.status(200).json({
        status: false,
        Err: error.message.split(": ")?.[1] ?? "Something went wrong",
      });
    }
  } catch (error: any) {
    console.log("error1", error);
    return res.status(400).json(error?.toString());
  }
};

export const screenAuth = async (req: Request, res: Response) => {
  try {
    var user = req.body.user;
    var page = req.body.page;
    var plantCd = req.body.plantCd;

    const authDetails: any = await UserModel.prototype.AuthDetails(
      user,
      page,
      plantCd
    );

    var PS_AUTH_DML = "N";

    var permisson = authDetails.outBinds;

    if (
      permisson.PS_AUTH_USER_SCR == "Y" &&
      permisson.PS_AUTH_USER_TSM == "Y"
    ) {
      PS_AUTH_DML = "Y";
      var resp = encryptUserInfo(PS_AUTH_DML, permisson.LS_READ_WRITE_FLAG); //LS_READ_WRITE_FLAG:'RL_RW'
      return res.status(200).json(resp);
    }

    // var roles = authDetails.rows;
    // if (roles && roles.length > 0) {
    //   var rolesFlat = roles.toString();
    //   if (rolesFlat.includes("RL_RW")) {
    //     PS_AUTH_DML = "Y";
    //   }
    //   var resp = encryptUserInfo(PS_AUTH_DML);
    //   //return res.status(400).json(null);
    //   return res.status(200).json(resp);
    // }

    return res.status(200).json(encryptUserInfo("Z", ""));
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const downTime = async (req: Request, res: Response) => {
  try {
    const results: any = await UserModel.prototype.downTime(req);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const execQueryScreenAccess = async (req: Request, res: Response) => {
  try {
    const results: any = await UserModel.prototype.execQueryScreenAccess(req);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const execQuery = async (req: Request, res: Response) => {
  try {
    var salt = "21144S3984CEF5c659C44ZCK37299B4208375IG7DC792A30";
    var o = req.body.dt;

    o = decodeURI(o);
    if (salt && o.indexOf(salt) != 0)
      throw new Error("object cannot be decrypted");
    o = o.substring(salt.length).split("");
    for (var i = 0, l = o.length; i < l; i++)
      if (o[i] == "{") o[i] = "}";
      else if (o[i] == "}") o[i] = "{";
    var d = JSON.parse(o.join(""));

    let queryType = req.body.queryType;
    let qry = req.body.query;

    let dbUri = d.dbUri;
    let testId = d.testId;
    let testCode = d.testCode;

    setValue("userad", `${testId}`);
    setValue("userps", `${testCode}`);
    setValue("userdb", `${dbUri}`);
    if (queryType == "SelectOperation") {
      const results: any = await UserModel.prototype.execQuery(qry);
      const table: any = [];
      const header: any = [];
      const columns: any = [];
      const fullData: any = [];
      for (let i = 0; i < results.metaData.length; i++) {
        header.push((results.metaData[i].name as string).replace(/ /g, ""));
      }

      for (let i = 0; i < results.metaData.length; i++) {
        var obj: any = {};
        obj.title = results.metaData[i].name as string;
        obj.field = header[i];
        obj.headerFilter = "input";
        obj.headerFilterPlaceholder = "search...";
        obj.hozAlign = "center";
        columns.push(obj);
      }

      for (let i = 0; i < results.rows.length; i++) {
        const arr = results.rows[i];
        var jsonObj: any = {};
        header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
        table.push(jsonObj);
      }

      fullData.push(columns);
      fullData.push(table);

      return res.status(200).json(fullData);
    } else if (queryType == "ExecuteOperation") {
      const results: any = await UserModel.prototype.execQuery(qry);
      return res.status(200).json(results);
    } else if (queryType == "DECLARE") {
      const results: any = await UserModel.prototype.execQuery(qry);
      return res.status(200).json(results);
    }
    return res.status(200).json("queryType Not Matched");
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const confirmExecQuery = async (req: Request, res: Response) => {
  try {
    var salt = "21144S3984CEF5c659C44ZCK37299B4208375IG7DC792A30";
    var o = req.body.dt;

    o = decodeURI(o);
    if (salt && o.indexOf(salt) != 0)
      throw new Error("object cannot be decrypted");
    o = o.substring(salt.length).split("");
    for (var i = 0, l = o.length; i < l; i++)
      if (o[i] == "{") o[i] = "}";
      else if (o[i] == "}") o[i] = "{";
    var d = JSON.parse(o.join(""));

    let queryType = req.body.queryType;
    let qry = req.body.query;

    var a = qry.split(" ");
    var c = "";

    if (a[0].toUpperCase() == "UPDATE") {
      let result = qry?.toUpperCase()?.replace("UPDATE", "SELECT * FROM");
      let s = result?.toUpperCase()?.split("SET");
      var g = s[1]?.toUpperCase()?.split("WHERE");
      c = s[0] + " WHERE " + g[1];
    } else if (a[0].toUpperCase() == "DELETE") {
      let result = qry?.toUpperCase()?.replace("DELETE", "SELECT * FROM");
      c = result;
    }

    let dbUri = d.dbUri;
    let testId = d.testId;
    let testCode = d.testCode;

    setValue("userad", `${testId}`);
    setValue("userps", `${testCode}`);
    setValue("userdb", `${dbUri}`);

    if (queryType == "ExecuteOperation") {
      const results: any = await UserModel.prototype.confirmExecQuery(c);
      return res.status(200).json(results);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const testConnection = async (req: Request, res: Response) => {
  try {
    let dbUri = req.body.dbUri;
    let testId = req.body.testId;
    let testCode = req.body.testCode;
    var sessionId = generateSession(24);
    setValue("userad", `${testId}`);
    setValue("userps", `${testCode}`);
    setValue("userdb", `${dbUri}`);

    const results: any = await UserModel.prototype.testConnection();
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const checkPasswordExpiry = async (req: Request, res: Response) => {
  try {
    const results: any = await UserModel.prototype.checkPasswordExpiry(req);
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const changePasswordDb = async (req: Request, res: Response) => {
  try {
    const results: any = await UserModel.prototype.changePasswordDb(req);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const test = async (req: Request, res: Response) => {
  try {
    return res.status(200).json("Test");
  } catch (error) {
    return res.status(400).json(error);
  }
};

const encryptUserInfo = (PS_AUTH_DML: any, LS_READ_WRITE_FLAG: any) => {
  const payload = {
    PS_AUTH_DML: PS_AUTH_DML,
    LS_READ_WRITE_FLAG: LS_READ_WRITE_FLAG,
  };

  // Create token
  const privateKey: any = env.SCREEN_AUTH_KEY;

  const token = jwt.sign(
    {
      payload,
      apikey: env.API_KEY,
      appName: "tsmmes",
      iat: Math.floor(Date.now() / 1000) - 60,
    },
    privateKey,
    {
      algorithm: "HS256",
      notBefore: 0,
      expiresIn: 300 * 1000,
      audience: "TSM_MES_API",
      issuer: "tslcrmmesProgram",
    }
  );
  return token;
};

const generateAddress = (route: string, token: string) => {
  const URL = "localhost:3000";
  return `${URL}${route}${token}`;
};

const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

function generateSession(length: number) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
