import passport from "passport";
//import bcrypt from 'bcrypt';
import LocalStrategy from "passport-local";
import BearerStrategy from "passport-http-bearer";
import { User } from "./../typed/typed";
import UserModel from "../models/usersModel";
import tokens from "./token";
import Error from "../models/errors";
import env from "../env";
import jwt from "jsonwebtoken";
import { setValue } from "express-ctx";

const verifyUser = (user: User) => {
  if (!user) {
    throw new Error.NotAuthorized();
  }
};

async function verifyPassword(password: string, passwordHash: string) {
  // const validPassword = await bcrypt.compare(password, passwordHash);
  // if (!validPassword) {
  //   throw new Error.NotAuthorized();
  // }
}

passport.use(
  new LocalStrategy.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.prototype.searchForEmail(email);
        verifyUser(user);
        await verifyPassword(password, user.passwordHash);
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new BearerStrategy.Strategy(async (token: any, done) => {
    try {
      //const id: any = await tokens.access.verify(token);

      const tokenDecrypted: any = jwt.verify(token, env.CHAVE_JWT as string);
      const id: any = tokenDecrypted.payload; //.payload;
      const sessionId: any = tokenDecrypted.sessionId; //.sessionId;
      setValue('user', `${id}_${sessionId}`)
      //const id:any= payload;
      // const user = await UserModel.prototype.getUserById(id);
      // @ts-ignore
      done(null, id, { token });
    } catch (error: any) {
      done(error.message + "" + ": Token Expired");
    }
  })
);

export default passport;
