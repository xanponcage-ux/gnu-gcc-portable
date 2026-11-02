import { Router } from "express";
import * as controller from '../controllers/TTSM007Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSMS007Route = Router()

// C1CES007Route.route('/getGroupPlant').post(authenticationMiddleware.bearer,authenticationMiddleware.bearer, authenticationMiddleware.reader, getGroupPlant); getBUnitCd
TTSMS007Route.route('/GetOrderDT').post(authenticationMiddleware.bearer, controller.GetOrderDT);
TTSMS007Route.route('/getBUnitCd').post(authenticationMiddleware.bearer, controller.getBUnitCd);
TTSMS007Route.route('/getGroupPlant').post(authenticationMiddleware.bearer, controller.getGroupPlant);
TTSMS007Route.route('/GetOrdTyp').post(authenticationMiddleware.bearer, controller.GetOrdTyp);
TTSMS007Route.route('/GetCustDesc').post(authenticationMiddleware.bearer, controller.GetCustDesc);
TTSMS007Route.route('/GetProdCat').post(authenticationMiddleware.bearer, controller.GetProdCat);
TTSMS007Route.route('/odiaList').post(authenticationMiddleware.bearer, controller.getOdia);
TTSMS007Route.route('/thickList').post(authenticationMiddleware.bearer, controller.getThickList);
TTSMS007Route.route('/lengthList').post(authenticationMiddleware.bearer, controller.getlengthList);
// TTSMS007Route.route('/GetOrderDT').post(authenticationMiddleware.bearer,authenticationMiddleware.bearer,controller.GetOrderDT);
TTSMS007Route.route('/GetOrderDT_Tubes').post(authenticationMiddleware.bearer, controller.GetOrderDT_Tubes);





export default TTSMS007Route