import { Router } from "express";

import * as controller from '../controllers/LD04S001Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'



const LD04S001Route = Router()
LD04S001Route.route('/insertTempData').post(authenticationMiddleware.bearer,controller.insertTempData);
LD04S001Route.route('/getMatNo').post(authenticationMiddleware.bearer, controller.getMatNo);
LD04S001Route.route('/getFillData').post(authenticationMiddleware.bearer, controller.getFillData);
LD04S001Route.route('/getPono').post(authenticationMiddleware.bearer, controller.getPono);

LD04S001Route.route('/getinspectorlist').post(authenticationMiddleware.bearer,controller.getinspectorlist);

export default LD04S001Route