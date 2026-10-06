import { Router } from "express";
import * as controller from '../controllers/LDSM040Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM040Route = Router()

LDSM040Route.route('/getProcDesc').post(authenticationMiddleware.bearer, controller.GetProcDesc);
LDSM040Route.route('/getCustDesc').post(authenticationMiddleware.bearer, controller.GetCustDesc);
LDSM040Route.route('/getCheckSco').post(authenticationMiddleware.bearer, controller.CheckSCO);
LDSM040Route.route('/getOrderType').post(authenticationMiddleware.bearer, controller.GetOrderType);
LDSM040Route.route('/getTracking').post(authenticationMiddleware.bearer, controller.GetTracking);
LDSM040Route.route('/getCoils').post(authenticationMiddleware.bearer, controller.getCoils);
LDSM040Route.route('/getslitcoildetails').post(authenticationMiddleware.bearer, controller.getSlitCoilDetails);
LDSM040Route.route('/getWorkCenter').post(authenticationMiddleware.bearer, controller.GetWorkCenter);
LDSM040Route.route('/getTdcList').post(authenticationMiddleware.bearer, controller.GetTdcList);
LDSM040Route.route('/getCustData').post(authenticationMiddleware.bearer, controller.GetCustData);

export default LDSM040Route