import { Router } from "express";

import * as controller from '../controllers/LD06S001Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'



const LD06S001Route = Router()
LD06S001Route.route('/insertTempData').post(authenticationMiddleware.bearer,controller.insertTempData);
LD06S001Route.route('/getFillData').post(authenticationMiddleware.bearer, controller.getFillData);
LD06S001Route.route('/getPono').post(authenticationMiddleware.bearer, controller.getPono);
LD06S001Route.route('/getMatNo').post(authenticationMiddleware.bearer, controller.getMatNo);


export default LD06S001Route