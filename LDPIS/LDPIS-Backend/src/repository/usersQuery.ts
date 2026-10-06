import query from "../infrastructure/database/querys";
//import exequery from "../infrastructure/database/exequery";
import { User } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const insert = async (user: User) => {
  try {
    const sql = "INSERT INTO Users SET ?";
    return await query.executeQuery(sql, user);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const list = async () => {
  try {
    const sql = "SELECT * FROM Users";
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getById = async (id: string) => {
  try {
    var userId = id as string;
    const sql = `SELECT count(1) FROM v_users where USR_ID_USERS= :userId
    AND USR_ACTIVE_ST='A'`;
    const binds = [`${userId}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getCompCode = async (plCode: string) => {
  try {
    var plantCode = plCode as string;
    const sql = ` select distinct tpm_company_cd from  LDPDBA.T_plant_master where TPM_PLANT_CD= :plantCode`;
    const binds = [`${plantCode}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const edit = async (user: User, id: number) => {
  try {
    const sql = `UPDATE Users SET ? WHERE id=${id}`;
    return await query.executeQuery(sql, user);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const remove = async (id: number) => {
  try {
    const sql = `DELETE FROM Users WHERE id=${id}`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const searchEmail = async (email: string) => {
  try {
    const sql = `SELECT * FROM Users WHERE email = '${email}'`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updatePasscode = async (
  id: string,
  code: string,
  status: string
) => {
  try {
    const sql = `
    UPDATE V_USERS SET USR_PASSCODE=:0, USR_PCODE_NEW_FL=:1
    WHERE USR_ID_USERS=:2`;
    let binds = [`${code}`, `${status}`, `${id}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const sendEmail = async (id: string, msg: string, sub: string) => {
  try {
    const sql = `call SendMail_Generic (
      mailid => :mailid,
      sgadesc => :sgadesc,
      subj => :subj
      LS_OUT_FLAG => :LS_OUT_FLAG
      )`;
    const binds = {
      mailid: id,
      sgadesc: msg ?? "",
      subj: sub ?? "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
      // PS_F_ERR_MSG: { type: oracledb.STRING, dir: oracledb.BIND_OUT,maxSize: 500, }
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPasscode = async (id: string, field: string) => {
  try {
    let sql;
    if (field) {
      sql = `SELECT ${field} FROM V_USERS WHERE USR_ID_USERS = :0`;
    } else {
      sql = `SELECT * FROM V_USERS WHERE USR_ID_USERS = :0`;
    }
    let binds = [`${id}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getUserAccess = async () => {
  try {
    let sql = `SELECT * FROM v_form_group_role WHERE fgr_id_usergrp IN('TEMPMGR','READER')`;

    let binds = ["TEMPMGR", "READER"];

    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const changePassword = async (userId: string, password: string) => {
  try {
    let sql = `ALTER USER "${userId}" IDENTIFIED BY "${password}"`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const changePasswordDb = async (req: any) => {
  try {
    let user = req.body.user;
    let newpass = req.body.newpass;
    let oldpass = req.body.oldpass;

    let sql =
      ' ALTER USER "' +
      user +
      '" IDENTIFIED BY "' +
      newpass +
      '" REPLACE "' +
      oldpass +
      '" ';
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const downTime = async () => {
  try {
    let sql = `SELECT COUNT(1) FROM V_CODES WHERE CD_TYPE='TB015' AND CD_VALUE='Y'`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const execQueryScreenAccess = async (req: any) => {
  try {
    let sql = `SELECT COUNT(1) FROM v_codes WHERE cd_type = 'TB037' AND cd_value = :0`;
    let binds = [`${req.body.user}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const execQuery = async (req: any) => {
  try {
    let sql = req;
    console.log(sql);
    return await query.testExecuteQuery(sql);
  } catch (error: any) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const confirmExecQuery = async (req: any) => {
  try {
    let sql = req;
    console.log(sql);
    return await query.testExecuteQuery(sql);
  } catch (error: any) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const testConnection = async () => {
  try {
    let sql = `SELECT * FROM V_CODES`;
    return await query.testExecuteQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const checkPasswordExpiry = async (req: any) => {
  try {
    let sql = `SELECT
    USERNAME,
    EXPIRY_DATE,
    PASSWORD_CHANGE_DATE
FROM
    USER_USERS`;
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

// export const authDetails = async (
//   PS_USER_ID: string,
//   PS_PAGE_ID: string,
//   plantCd: string
// ) => {
//   try {
//     const sql = `select F_PAGE_AUTHENTICATION(:PS_USER_ID,:PS_PAGE_ID) as USERROLE FROM DUAL`;
//     const binds = {
//       PS_USER_ID: PS_USER_ID,
//       PS_PAGE_ID: PS_PAGE_ID,
//     };

//     return await query.executeQuery.executeQuery(sql, binds);
//   } catch (error) {
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const authDetails = async (
  PS_PNO: string,
  PS_SCREEN_ID: string,
  plantCd: string
) => {
  try {
    var sql = `call LDPDBA.P_VALID_AUTH(
        PS_PNO => :PS_PNO,
        PS_SCREEN_ID  => :PS_SCREEN_ID,  
        PS_AUTH_USER_TSM => :PS_AUTH_USER_TSM,      
        PS_AUTH_USER_SCR => :PS_AUTH_USER_SCR,
        PS_AUTH_USER_LINE => :PS_AUTH_USER_LINE,
        PS_AUTH_MAX_ROLINE => :PS_AUTH_MAX_ROLINE,
        LS_READ_WRITE_FLAG => :LS_READ_WRITE_FLAG,
        PS_F_ERR_MSG => :PS_F_ERR_MSG
      )`;

    const binds = {
      PS_PNO: PS_PNO,
      PS_SCREEN_ID: PS_SCREEN_ID,
      PS_AUTH_MAX_ROLINE: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
      PS_AUTH_USER_TSM: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
      PS_AUTH_USER_SCR: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
      PS_AUTH_USER_LINE: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
      LS_READ_WRITE_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      }, //This flag will identify user access page view & Update
      PS_F_ERR_MSG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const authStr = async (ls_str: string) => {
  try {
    let sql = `select distinct regexp_substr(:ls_str,'[^,]+', 1, level) PLine from dual connect by regexp_substr(:ls_str, '[^,]+', 1, level) is not null`;

    let binds = [`${ls_str}`];

    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
