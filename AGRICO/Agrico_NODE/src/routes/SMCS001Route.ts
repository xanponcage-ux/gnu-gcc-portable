import { Router } from "express";
import * as controller from '../controllers/SMCS001Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const SMCS001Route = Router()

 SMCS001Route.route('/getProcessChartData').post(authenticationMiddleware.bearer, controller.getProcessChartData);
 SMCS001Route.route('/getProcessChartList').post(authenticationMiddleware.bearer, controller.getProcessChartList);
SMCS001Route.route('/InsertProcChartData').post(authenticationMiddleware.bearer, controller.InsertProcChartData);
SMCS001Route.route('/updateActiveDeactive').post(authenticationMiddleware.bearer, controller.updateActiveDeactive);

 SMCS001Route.route('/getProcessChartSpec').post(authenticationMiddleware.bearer, controller.getProcessChartSpec);

export default SMCS001Route