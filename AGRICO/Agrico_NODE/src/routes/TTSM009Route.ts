import { Router } from "express";
import * as controller from '../controllers/TTSM009Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM009Route = Router()

TTSM009Route.route('/getProcess').post(authenticationMiddleware.bearer, controller.GetProcess);
TTSM009Route.route('/getProdInqData').post(authenticationMiddleware.bearer, controller.getProdInqData);
TTSM009Route.route('/getReportData').post(authenticationMiddleware.bearer, controller.getReportData);

export default TTSM009Route