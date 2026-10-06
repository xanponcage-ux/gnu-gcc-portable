import { Router } from "express";
import {
  getUsers,
  insertUser,
  editUser,
  deletetUser,
  getUserById,
  login,
  logout,
  verifyEmail,
  getNewToken,
  screenAuth,
  test,
  downTime,
  genaratePasscode,
  resetPassword,
  checkPasswordExpiry,
  changePasswordDb,
  execQuery,
  testConnection,
  confirmExecQuery,
  execQueryScreenAccess
} from "../controllers/usersController";
import authenticationMiddleware from '../middlewares/authenticationMiddleware';

const usersRoute = Router()

usersRoute.route('/users/login').post(login);
usersRoute.route('/users/genaratePasscode').post(genaratePasscode);
usersRoute.route('/users/resetPassword').post(resetPassword);
usersRoute.route('/users/logout').post([authenticationMiddleware.refresh, authenticationMiddleware.bearer], logout);
usersRoute.route('/users/verify_email/:token').get(authenticationMiddleware.verifyEmail, verifyEmail);
usersRoute.route('/users/refresh_token').post(authenticationMiddleware.refresh, getNewToken);
usersRoute.route('/users').get(authenticationMiddleware.bearer, getUsers);
usersRoute.route('/users/:id').get([authenticationMiddleware.bearer, authenticationMiddleware.local], getUserById);
usersRoute.post('/users', insertUser);
usersRoute.route('/users/:id').put([authenticationMiddleware.bearer, authenticationMiddleware.local], editUser);
usersRoute.route('/users/:id').delete([authenticationMiddleware.bearer, authenticationMiddleware.local], deletetUser);
usersRoute.route("/users/screenAuth").post(authenticationMiddleware.bearer, screenAuth);
usersRoute.route("/users/downTime").post(authenticationMiddleware.bearer, downTime);

usersRoute.route("/users/execQueryScreenAccess").post(authenticationMiddleware.bearer, execQueryScreenAccess);
usersRoute.route("/users/execQuery").post(authenticationMiddleware.bearer, execQuery);
usersRoute.route("/users/confirmExecQuery").post(authenticationMiddleware.bearer, confirmExecQuery);
usersRoute.route("/users/testConnection").post(authenticationMiddleware.bearer, testConnection);
usersRoute.route("/users/test").post(authenticationMiddleware.none, test);
usersRoute.route('/users/checkPasswordExpiry').post(authenticationMiddleware.bearer, checkPasswordExpiry);
usersRoute.route('/users/changePassword').post([authenticationMiddleware.refresh, authenticationMiddleware.bearer], changePasswordDb);


export default usersRoute