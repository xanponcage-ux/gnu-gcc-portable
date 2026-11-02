import { Router } from "express";
import * as controller from '../controllers/SMCS002Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const SMCS002Route = Router()

SMCS002Route.route('/getHeatList').post(authenticationMiddleware.bearer, controller.getHeatList);
SMCS002Route.route('/getHeatDetails').post(authenticationMiddleware.bearer, controller.getHeatDetails);
// SMCS001Route.route('/InsertProcChartData').post(authenticationMiddleware.bearer, controller.InsertProcChartData);
// SMCS001Route.route('/updateActiveDeactive').post(authenticationMiddleware.bearer, controller.updateActiveDeactive);

//  SMCS001Route.route('/getProcessChartSpec').post(authenticationMiddleware.bearer, controller.getProcessChartSpec);

export default SMCS002Route