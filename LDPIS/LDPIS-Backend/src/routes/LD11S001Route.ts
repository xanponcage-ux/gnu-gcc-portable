import { Router } from "express";
import * as controller from '../controllers/LD11S001Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LD11S001Route = Router()



LD11S001Route.route('/getRmList').post(authenticationMiddleware.bearer, controller.getRmList);
LD11S001Route.route('/getPipeNoList').post(authenticationMiddleware.bearer, controller.getPipeNoList);
LD11S001Route.route('/insertTempData').post(authenticationMiddleware.bearer, controller.insertTempData);
LD11S001Route.route('/getFillData').post(authenticationMiddleware.bearer, controller.getFillData);
LD11S001Route.route("/getTataDate").post(authenticationMiddleware.bearer,controller.getTataDate);


export default LD11S001Route;