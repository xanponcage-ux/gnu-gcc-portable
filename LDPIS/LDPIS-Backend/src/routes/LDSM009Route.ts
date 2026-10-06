import { Router } from "express";
import * as controller from '../controllers/LDSM009Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM009Route = Router()

LDSM009Route.route('/getProcess').post(authenticationMiddleware.bearer, controller.GetProcess);
LDSM009Route.route('/getProdInqData').post(authenticationMiddleware.bearer, controller.getProdInqData);
LDSM009Route.route('/getReportData').post(authenticationMiddleware.bearer, controller.getReportData);

export default LDSM009Route