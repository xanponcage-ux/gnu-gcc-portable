import { Router } from "express";
import * as controller from '../controllers/LDSM001Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM001Route = Router()

// LDSM003Route.route('/getGroupPlant').post(authenticationMiddleware.bearer, authenticationMiddleware.reader, getGroupPlant); 
LDSM001Route.route('/getCoils').post(authenticationMiddleware.bearer, controller.getCoils);
LDSM001Route.route('/linkCoils').post(authenticationMiddleware.bearer, controller.linkCoils);
LDSM001Route.route('/getOrders').post(authenticationMiddleware.bearer, controller.getOrders);
LDSM001Route.route('/getCoilsDeviationFromBOM').post(authenticationMiddleware.bearer, controller.getCoilsDeviationFromBOM);

LDSM001Route.route('/getdeallotdata').post(authenticationMiddleware.bearer, controller.getDeAllot);
LDSM001Route.route('/updatedeallot').post(authenticationMiddleware.bearer, controller.updateAllotData);
LDSM001Route.route('/getWIPCoilsMatchingWithBOM').post(authenticationMiddleware.bearer, controller.getWIPCoilsMatchingWithBOM);
LDSM001Route.route('/getWIPCoilsNotMatchingWithBOM').post(authenticationMiddleware.bearer, controller.getWIPCoilsNotMatchingWithBOM);
LDSM001Route.route('/chemChk').post(authenticationMiddleware.bearer, controller.chemChk);
LDSM001Route.route('/odiaList').post(authenticationMiddleware.bearer, controller.getOdia);
LDSM001Route.route('/dOdiaList').post(authenticationMiddleware.bearer, controller.getDOdia);
LDSM001Route.route('/idiaList').post(authenticationMiddleware.bearer, controller.getIdiaList);
LDSM001Route.route('/dIdiaList').post(authenticationMiddleware.bearer, controller.getDIdiaList);
LDSM001Route.route('/thickList').post(authenticationMiddleware.bearer, controller.getThickList);
LDSM001Route.route('/lengthList').post(authenticationMiddleware.bearer, controller.getlengthList);
LDSM001Route.route('/getOrderType').post(authenticationMiddleware.bearer, controller.getOrderType);
LDSM001Route.route('/getCoilList').post(authenticationMiddleware.bearer, controller.getCoilList);



export default LDSM001Route