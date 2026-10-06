import { Router } from "express";
import * as controller from '../controllers/LDSM016Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM016Route = Router()

LDSM016Route.route('/getqualityresultdata').post(authenticationMiddleware.bearer,controller.getQualityResultData);
LDSM016Route.route('/getStripChartData').post(authenticationMiddleware.bearer,controller.getStripChartData);
LDSM016Route.route('/getTablesForEdit').get(authenticationMiddleware.bearer, controller.getTablesForEdit);
LDSM016Route.route('/getColumnList').post(authenticationMiddleware.bearer, controller.getColumnList);
LDSM016Route.route('/getData').post(authenticationMiddleware.bearer, controller.getData);
LDSM016Route.route('/updateRecord').post(authenticationMiddleware.bearer, controller.updateRecord);
export default LDSM016Route