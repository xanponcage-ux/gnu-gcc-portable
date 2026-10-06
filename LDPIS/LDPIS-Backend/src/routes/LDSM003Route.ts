import { Router } from "express";
import * as controller from '../controllers/LDSM003Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM003Route = Router()


// LDSM003Route.route('/getGroupPlant').post(authenticationMiddleware.bearer, authenticationMiddleware.reader, getGroupPlant); 
LDSM003Route.route('/getRolePlant').post(authenticationMiddleware.bearer, controller.getRolePlant);
LDSM003Route.route('/getCoils').post(authenticationMiddleware.bearer, controller.getCoils);
LDSM003Route.route('/getBatchDetails').post(authenticationMiddleware.bearer, controller.getBatchDetails);
LDSM003Route.route('/CONFIRM').post( authenticationMiddleware.bearer,controller.CONFIRM);
LDSM003Route.route('/CONFIRM_Wires').post(authenticationMiddleware.bearer, controller.CONFIRM_Wires);
LDSM003Route.route('/getCoils_Wires').post(authenticationMiddleware.bearer, controller.getCoils_Wires);
LDSM003Route.route('/getCoils_LP').post(authenticationMiddleware.bearer, controller.getCoils_LP);
LDSM003Route.route('/odiafrm').post(authenticationMiddleware.bearer, controller.getOdiaFrm);
LDSM003Route.route('/odiato').post(authenticationMiddleware.bearer, controller.getOdiaTo);
LDSM003Route.route('/odiaList').post(authenticationMiddleware.bearer, controller.getOdia);
LDSM003Route.route('/thickList').post(authenticationMiddleware.bearer, controller.getThickList);
LDSM003Route.route('/lengthList').post(authenticationMiddleware.bearer, controller.getlengthList);
LDSM003Route.route('/status').post(authenticationMiddleware.bearer, controller.getStatus);
LDSM003Route.route('/getStoreLocation').get(authenticationMiddleware.bearer, controller.getStoreLocation);
LDSM003Route.route('/RETURN_COIL').post( authenticationMiddleware.bearer,controller.RETURN_COIL);

export default LDSM003Route