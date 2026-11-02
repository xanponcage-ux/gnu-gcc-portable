import { Router } from "express";
import * as controller from '../controllers/TTSM014Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM014Route = Router()

TTSM014Route.route('/getqualityresultdata').post(authenticationMiddleware.bearer,controller.getQualityResultData);
TTSM014Route.route('/getStripChartData').post(authenticationMiddleware.bearer,controller.getStripChartData);

export default TTSM014Route