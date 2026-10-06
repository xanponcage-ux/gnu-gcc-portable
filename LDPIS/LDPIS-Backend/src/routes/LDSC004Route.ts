import { Router } from "express";
import * as controller from '../controllers/LDSC004Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'


const LDSC004Route = Router();

LDSC004Route.route('/getExceptionReport').post(authenticationMiddleware.bearer, controller.getExceptionReport);
LDSC004Route.route('/getRoundOdMaster').post(authenticationMiddleware.bearer, controller.getRoundOdMaster);
LDSC004Route.route('/getOnDateCoilReceiving').post(authenticationMiddleware.bearer, controller.getOnDateCoilReceiving);
LDSC004Route.route('/getOnDateWiderProduction').post(authenticationMiddleware.bearer, controller.getOnDateWiderProduction);
LDSC004Route.route('/getOnDateNarrowProduction').post(authenticationMiddleware.bearer, controller.getOnDateNarrowProduction);
LDSC004Route.route('/getOnDateTubeSchedule').post(authenticationMiddleware.bearer, controller.getOnDateTubeSchedule);
LDSC004Route.route('/getOnDateTubeProduction').post(authenticationMiddleware.bearer, controller.getOnDateTubeProduction);
LDSC004Route.route('/getOnDateCtlProduction').post(authenticationMiddleware.bearer, controller.getOnDateCtlProduction);
LDSC004Route.route('/getOnDatePacking').post(authenticationMiddleware.bearer, controller.getOnDatePacking);
LDSC004Route.route('/getOnDateDispatch').post(authenticationMiddleware.bearer, controller.getOnDateDispatch);
LDSC004Route.route('/getTillDateCoilReceiving').post(authenticationMiddleware.bearer, controller.getTillDateCoilReceiving);
LDSC004Route.route('/getTillDateWiderProduction').post(authenticationMiddleware.bearer, controller.getTillDateWiderProduction);
LDSC004Route.route('/getTillDateNarrowProduction').post(authenticationMiddleware.bearer, controller.getTillDateNarrowProduction);
LDSC004Route.route('/getTillDateTubeSchedule').post(authenticationMiddleware.bearer, controller.getTillDateTubeSchedule);
LDSC004Route.route('/getTillDateTubeProduction').post(authenticationMiddleware.bearer, controller.getTillDateTubeProduction);
LDSC004Route.route('/getTillDateCtlProduction').post(authenticationMiddleware.bearer, controller.getTillDateCtlProduction);
LDSC004Route.route('/getTillDatePacking').post(authenticationMiddleware.bearer, controller.getTillDatePacking);
LDSC004Route.route('/getTillDateDispatch').post(authenticationMiddleware.bearer, controller.getTillDateDispatch);
LDSC004Route.route('/getTubeProdMonthlyReport').post(authenticationMiddleware.bearer, controller.getTubeProdMonthlyReport);
LDSC004Route.route('/getPackingMonthlyReport').post(authenticationMiddleware.bearer, controller.getPackingMonthlyReport);

export default LDSC004Route