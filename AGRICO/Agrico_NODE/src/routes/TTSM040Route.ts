import { Router } from "express";
import * as controller from '../controllers/TTSM040Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM040Route = Router()

TTSM040Route.route('/getProcDesc').post(authenticationMiddleware.bearer, controller.GetProcDesc);
TTSM040Route.route('/getCustDesc').post(authenticationMiddleware.bearer, controller.GetCustDesc);
TTSM040Route.route('/getCheckSco').post(authenticationMiddleware.bearer, controller.CheckSCO);
TTSM040Route.route('/getOrderType').post(authenticationMiddleware.bearer, controller.GetOrderType);
TTSM040Route.route('/getTracking').post(authenticationMiddleware.bearer, controller.GetTracking);
TTSM040Route.route('/getCoils').post(authenticationMiddleware.bearer, controller.getCoils);
TTSM040Route.route('/getslitcoildetails').post(authenticationMiddleware.bearer, controller.getSlitCoilDetails);
TTSM040Route.route('/getWorkCenter').post(authenticationMiddleware.bearer, controller.GetWorkCenter);
TTSM040Route.route('/getTdcList').post(authenticationMiddleware.bearer, controller.GetTdcList);
TTSM040Route.route('/getCustData').post(authenticationMiddleware.bearer, controller.GetCustData);

export default TTSM040Route