import { Router } from "express";
import * as controller from '../controllers/LDSM014Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM014Route = Router()

LDSM014Route.route('/getqualityresultdata').post(authenticationMiddleware.bearer,controller.getQualityResultData);
LDSM014Route.route('/getStripChartData').post(authenticationMiddleware.bearer,controller.getStripChartData);

export default LDSM014Route