import { Request, Response } from "express";
import { setValue } from "express-ctx";
import passport from "../controllers/StrategyAuthentication";
import tokens from "../controllers/token";
import UserModel from "../models/usersModel";
import jwt from "jsonwebtoken";
import env from "../env";

export default {
  local(req: Request, res: Response, next: any) {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error) {
        return next(error);
      }
      req.user = user;
      return next();
    })(req, res, next);
  },

  bearer(req: any, res: Response, next: any) {
    passport.authenticate("bearer", { session: false }, async (error, user, info) => {
      if (error) {
        return next(error);
      }
      if (info.token) {
        req.token = info.token;
        req.user = user;
        const bearerHeader = req.headers["authorization"];
        let oldAccessToken = (bearerHeader as string).replace("Bearer ", "");
        const tokenDecrypted: any = await jwt.verify(
          oldAccessToken,
          env.CHAVE_JWT as string
        );
        const id: any = tokenDecrypted.payload; //.payload;
        const sessionId: any = tokenDecrypted.sessionId; //.sessionId;
        await setValue('user', `${id}_${sessionId}`)
        return next();
      } else {
        return res.status(401).json({ error: "Invalid Token" });
      }
    })(req, res, next);
  },
  none(req: any, res: Response, next: any) {
    next();
  },

  async refresh(req: any, res: Response, next: any) {
    try {
      //const { refreshToken } = req.body;
      // const id = await tokens.refresh.verify(refreshToken);
      //await tokens.refresh.invalid(refreshToken);
      //const payload:any= jwt.verify(refreshToken, env.CHAVE_JWT as string);
      //const id:any= payload;
      //req.user = await UserModel.prototype.getUserById(id);
      return next();
    } catch (error: any) {
      if (error.name === "InvalidArgumentError") {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  },

  async verifyEmail(req: Request, res: Response, next: any) {
    try {
      const { token } = req.params;
      const id: any = await tokens.verifyEmail.verify(token);
      const user = await UserModel.prototype.getUserById(id);
      req.user = user;
      next();
    } catch (erro) {
      next(erro);
    }
  },
  async reader(req: Request, res: Response, next: any) {
    try {
      var ls_line = "";
      var user: any = req.user;

      var baseUrlArr = req.baseUrl.split("/");
      var page = baseUrlArr[2].toUpperCase();

      if (env.devMode == "Y") {
        //(user = "198447"), (page = "TSMCRMF001");
      }

      const authDetails: any = await UserModel.prototype.AuthDetails(
        user,
        page,
        ""
      );
      var PS_AUTH_DML = "N";
      var roles = authDetails.rows;
      if (roles && roles.length > 0) {
        var rolesFlat = roles.toString();
        if (rolesFlat.includes("RL_RW") || rolesFlat.includes("RL_R")) {
          PS_AUTH_DML = "Y";
        }
      }


      if (PS_AUTH_DML == "Y") {
        return next();
      } else {
        return res.status(401).json({ error: "Not Authorized" });
      }
    } catch (error) {
      next(error);
    }
  },
  async admin(req: Request, res: Response, next: any) {
    try {
      var ls_line = "";
      var user: any = req.user;

      var baseUrlArr = req.baseUrl.split("/");
      var page = baseUrlArr[2].toUpperCase();

      if (env.devMode == "Y") {
        //(user = "198447"), (page = "TSMCRMF001");
      }

      const authDetails: any = await UserModel.prototype.AuthDetails(
        user,
        page,
        ""
      );
      var PS_AUTH_DML = "N";
      var roles = authDetails.rows;
      if (roles && roles.length > 0) {
        var rolesFlat = roles.toString();
        if (rolesFlat.includes("RL_RW")) {
          PS_AUTH_DML = "Y";
        }
      }
      if (PS_AUTH_DML == "Y") {
        return next();
      } else {
        return res.status(401).json({ error: "Not Authorized" });
      }
    } catch (error) {
      next(error);
    }
  },
};
