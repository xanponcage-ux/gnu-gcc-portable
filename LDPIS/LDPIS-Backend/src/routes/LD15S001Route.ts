import { Router } from "express";
import * as controller from '../controllers/LD15S001Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LD15S001Route = Router()
LD15S001Route.route('/getRmList').post(authenticationMiddleware.bearer, controller.getRmList);
LD15S001Route.route('/getPipeNoList').post(authenticationMiddleware.bearer, controller.getPipeNoList);
LD15S001Route.route('/insertTempData').post(authenticationMiddleware.bearer, controller.insertTempData);
LD15S001Route.route('/getFillData').post(authenticationMiddleware.bearer, controller.getFillData);
LD15S001Route.route("/getTataDate").post(authenticationMiddleware.bearer,controller.getTataDate);

export default LD15S001Route;
