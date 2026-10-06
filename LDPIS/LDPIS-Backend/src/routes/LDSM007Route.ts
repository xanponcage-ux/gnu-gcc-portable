import { Router } from "express";
import * as controller from '../controllers/LDSM007Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSMS007Route = Router()

// C1CES007Route.route('/getGroupPlant').post(authenticationMiddleware.bearer,authenticationMiddleware.bearer, authenticationMiddleware.reader, getGroupPlant); getBUnitCd
LDSMS007Route.route('/GetOrderDT').post(authenticationMiddleware.bearer, controller.GetOrderDT);
LDSMS007Route.route('/getBUnitCd').post(authenticationMiddleware.bearer, controller.getBUnitCd);
LDSMS007Route.route('/getGroupPlant').post(authenticationMiddleware.bearer, controller.getGroupPlant);
LDSMS007Route.route('/GetOrdTyp').post(authenticationMiddleware.bearer, controller.GetOrdTyp);
LDSMS007Route.route('/GetCustDesc').post(authenticationMiddleware.bearer, controller.GetCustDesc);
LDSMS007Route.route('/GetProdCat').post(authenticationMiddleware.bearer, controller.GetProdCat);
LDSMS007Route.route('/odiaList').post(authenticationMiddleware.bearer, controller.getOdia);
LDSMS007Route.route('/thickList').post(authenticationMiddleware.bearer, controller.getThickList);
LDSMS007Route.route('/lengthList').post(authenticationMiddleware.bearer, controller.getlengthList);
// LDSMS007Route.route('/GetOrderDT').post(authenticationMiddleware.bearer,authenticationMiddleware.bearer,controller.GetOrderDT);
LDSMS007Route.route('/GetOrderDT_Tubes').post(authenticationMiddleware.bearer, controller.GetOrderDT_Tubes);





export default LDSMS007Route