import { Router } from "express";
import * as controller from '../controllers/TTSC004Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'


const TTSC004Route = Router();

TTSC004Route.route('/getExceptionReport').post(authenticationMiddleware.bearer, controller.getExceptionReport);
TTSC004Route.route('/getRoundOdMaster').post(authenticationMiddleware.bearer, controller.getRoundOdMaster);
TTSC004Route.route('/getOnDateCoilReceiving').post(authenticationMiddleware.bearer, controller.getOnDateCoilReceiving);
TTSC004Route.route('/getOnDateWiderProduction').post(authenticationMiddleware.bearer, controller.getOnDateWiderProduction);
TTSC004Route.route('/getOnDateNarrowProduction').post(authenticationMiddleware.bearer, controller.getOnDateNarrowProduction);
TTSC004Route.route('/getOnDateTubeSchedule').post(authenticationMiddleware.bearer, controller.getOnDateTubeSchedule);
TTSC004Route.route('/getOnDateTubeProduction').post(authenticationMiddleware.bearer, controller.getOnDateTubeProduction);
TTSC004Route.route('/getOnDateCtlProduction').post(authenticationMiddleware.bearer, controller.getOnDateCtlProduction);
TTSC004Route.route('/getOnDatePacking').post(authenticationMiddleware.bearer, controller.getOnDatePacking);
TTSC004Route.route('/getOnDateDispatch').post(authenticationMiddleware.bearer, controller.getOnDateDispatch);
TTSC004Route.route('/getTillDateCoilReceiving').post(authenticationMiddleware.bearer, controller.getTillDateCoilReceiving);
TTSC004Route.route('/getTillDateWiderProduction').post(authenticationMiddleware.bearer, controller.getTillDateWiderProduction);
TTSC004Route.route('/getTillDateNarrowProduction').post(authenticationMiddleware.bearer, controller.getTillDateNarrowProduction);
TTSC004Route.route('/getTillDateTubeSchedule').post(authenticationMiddleware.bearer, controller.getTillDateTubeSchedule);
TTSC004Route.route('/getTillDateTubeProduction').post(authenticationMiddleware.bearer, controller.getTillDateTubeProduction);
TTSC004Route.route('/getTillDateCtlProduction').post(authenticationMiddleware.bearer, controller.getTillDateCtlProduction);
TTSC004Route.route('/getTillDatePacking').post(authenticationMiddleware.bearer, controller.getTillDatePacking);
TTSC004Route.route('/getTillDateDispatch').post(authenticationMiddleware.bearer, controller.getTillDateDispatch);
TTSC004Route.route('/getTubeProdMonthlyReport').post(authenticationMiddleware.bearer, controller.getTubeProdMonthlyReport);
TTSC004Route.route('/getPackingMonthlyReport').post(authenticationMiddleware.bearer, controller.getPackingMonthlyReport);

export default TTSC004Route