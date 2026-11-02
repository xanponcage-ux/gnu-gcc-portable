import { Router } from "express";
import * as controller from '../controllers/TTSM001Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM001Route = Router()

// TTSM003Route.route('/getGroupPlant').post(authenticationMiddleware.bearer, authenticationMiddleware.reader, getGroupPlant); 
TTSM001Route.route('/getCoils').post(authenticationMiddleware.bearer, controller.getCoils);
TTSM001Route.route('/linkCoils').post(authenticationMiddleware.bearer, controller.linkCoils);
TTSM001Route.route('/getOrders').post(authenticationMiddleware.bearer, controller.getOrders);
TTSM001Route.route('/getCoilsDeviationFromBOM').post(authenticationMiddleware.bearer, controller.getCoilsDeviationFromBOM);

TTSM001Route.route('/getdeallotdata').post(authenticationMiddleware.bearer, controller.getDeAllot);
TTSM001Route.route('/updatedeallot').post(authenticationMiddleware.bearer, controller.updateAllotData);
TTSM001Route.route('/getWIPCoilsMatchingWithBOM').post(authenticationMiddleware.bearer, controller.getWIPCoilsMatchingWithBOM);
TTSM001Route.route('/getWIPCoilsNotMatchingWithBOM').post(authenticationMiddleware.bearer, controller.getWIPCoilsNotMatchingWithBOM);
TTSM001Route.route('/chemChk').post(authenticationMiddleware.bearer, controller.chemChk);
TTSM001Route.route('/odiaList').post(authenticationMiddleware.bearer, controller.getOdia);
TTSM001Route.route('/dOdiaList').post(authenticationMiddleware.bearer, controller.getDOdia);
TTSM001Route.route('/idiaList').post(authenticationMiddleware.bearer, controller.getIdiaList);
TTSM001Route.route('/dIdiaList').post(authenticationMiddleware.bearer, controller.getDIdiaList);
TTSM001Route.route('/thickList').post(authenticationMiddleware.bearer, controller.getThickList);
TTSM001Route.route('/lengthList').post(authenticationMiddleware.bearer, controller.getlengthList);
TTSM001Route.route('/getOrderType').post(authenticationMiddleware.bearer, controller.getOrderType);
TTSM001Route.route('/getCoilList').post(authenticationMiddleware.bearer, controller.getCoilList);
TTSM001Route.route('/getFGDelinkingdata').post(authenticationMiddleware.bearer, controller.getFGDelink);
TTSM001Route.route('/updateFGDelinking').post(authenticationMiddleware.bearer, controller.updateFGDelink);



export default TTSM001Route