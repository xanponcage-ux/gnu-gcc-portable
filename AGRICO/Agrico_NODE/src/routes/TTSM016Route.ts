import { Router } from "express";
import * as controller from '../controllers/TTSM016Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM016Route = Router()

TTSM016Route.route('/getqualityresultdata').post(authenticationMiddleware.bearer,controller.getQualityResultData);
TTSM016Route.route('/getStripChartData').post(authenticationMiddleware.bearer,controller.getStripChartData);
TTSM016Route.route('/getTablesForEdit').get(authenticationMiddleware.bearer, controller.getTablesForEdit);
TTSM016Route.route('/getColumnList').post(authenticationMiddleware.bearer, controller.getColumnList);
TTSM016Route.route('/getData').post(authenticationMiddleware.bearer, controller.getData);
TTSM016Route.route('/updateRecord').post(authenticationMiddleware.bearer, controller.updateRecord);
export default TTSM016Route