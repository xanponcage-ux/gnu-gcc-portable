import { Router } from "express";

import * as controller from '../controllers/LD10S001Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'



const LD10S001Route = Router()
LD10S001Route.route('/insertTempData').post(authenticationMiddleware.bearer, controller.insertTempData);
LD10S001Route.route('/getRmList').post(authenticationMiddleware.bearer, controller.getRmList);
LD10S001Route.route('/getPipeNoList').post(authenticationMiddleware.bearer, controller.getPipeNoList);
LD10S001Route.route('/getMatNo').post(authenticationMiddleware.bearer, controller.getMatNo);
LD10S001Route.route('/getFillData').post(authenticationMiddleware.bearer, controller.getFillData);
LD10S001Route.route('/getPono').post(authenticationMiddleware.bearer, controller.getPono);

export default LD10S001Route