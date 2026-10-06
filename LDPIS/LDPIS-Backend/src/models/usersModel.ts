import {
  insert,
  list,
  edit,
  remove,
  getById,
  searchEmail,
  getUserAccess,
  authDetails,
  authStr,
  getCompCode,
  downTime,
  getPasscode,
  updatePasscode,
  sendEmail,
  changePassword,
  checkPasswordExpiry,
  changePasswordDb,
  execQuery,
  testConnection,
  confirmExecQuery,
  execQueryScreenAccess
} from "../repository/usersQuery";

import { User } from '../typed/typed';
//import bcrypt from 'bcrypt'

import Error from './errors'

export default class UserModel {
  async insert(user: User) {
    this.verifyFieLDSMEmpty(user.name, user.email, user.passwordHash);
    const email = await this.searchForEmail(user.email);
    if (email) {
      throw new Error.InvalidArgumentError("Error!!!");
    } else {
      user.passwordHash = await this.generatePasswordHash(user.passwordHash);
      await insert(user);
      const { id } = await this.searchForEmail(user.email);
      return id;
    }
  }

  getUsers() {
    return list();
  }

  async getUserById(id: string) {
    return await getById(id);

  }

  async getCompanyCode(plCode: string) {
    return await getCompCode(plCode);

  }

  async getUserRole() {
    let result: any = await getUserAccess();
    return JSON.parse(JSON.stringify(result.rows));
  }
  editUser(user: User, id: number) {
    return edit(user, id);
  }

  async getPasscode(id: string, field: string) {
    return await getPasscode(id, field);
  }

  async updatePasscode(id: string, code: string, status: string) {
    return await updatePasscode(id, code, status);
  }

  sendEmail(address: string, user: User) {
    return ""; //VerifyEmail.prototype.sendEmail(address, user);
  }

  async sendEmailById(id: string, msg: string, sub: string) {
    return await sendEmail(id, msg, sub);
  }

  deleteUser(id: number) {
    return remove(id);
  }

  async searchForEmail(email: string) {
    const user = await searchEmail(email);
    return JSON.parse(JSON.stringify(user))[0];
  }

  async AuthDetails(
    ps_pno: string,
    ps_screen_id: string,
    plantCd: string
  ) {
    const auth_dtls = await authDetails(ps_pno, ps_screen_id, plantCd);
    return JSON.parse(JSON.stringify(auth_dtls));
  }

  async AuthStr(ls_str: string) {
    const auth_str = await authStr(ls_str);
    return JSON.parse(JSON.stringify(auth_str));
  }

  generatePasswordHash(password: string) {
    const costHash = 12;
    return "";
    //return bcrypt.hash(password, costHash)
  }

  verifyFieLDSMEmpty(...user: any[]) {
    const fieLDSM = [...user];
    fieLDSM.forEach((field) => {
      if (field === "" || field.length === 0) {
        throw new Error.InvalidArgumentError("Error!!!");
      }
    });
  }

  verifyEmail(user: User) {
    const id = user.id;
    user.emailVerify = 1;
    return edit(user, id as number);
  }

  downTime(req: any) {
    return downTime();
  }

  execQueryScreenAccess(req: any) {
    return execQueryScreenAccess(req);
  }

  execQuery(req: any) {
    return execQuery(req);
  }

  confirmExecQuery(req: any) {
    return confirmExecQuery(req);
  }

  testConnection() {
    return testConnection();
  }


  checkPasswordExpiry(req: any) {
    return checkPasswordExpiry(req);
  }

  changePasswordDb(req: any) {
    return changePasswordDb(req);
  }

  changePassword(id: string, pass: string) {
    return changePassword(id, pass);
  }
}
