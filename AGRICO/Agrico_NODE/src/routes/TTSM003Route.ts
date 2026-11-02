import { Router } from "express";
import * as controller from '../controllers/TTSM003Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM003Route = Router()


// TTSM003Route.route('/getGroupPlant').post(authenticationMiddleware.bearer, authenticationMiddleware.reader, getGroupPlant); 
TTSM003Route.route('/getRolePlant').post(authenticationMiddleware.bearer, controller.getRolePlant);
TTSM003Route.route('/getCoils').post(authenticationMiddleware.bearer, controller.getCoils);
TTSM003Route.route('/getBatchDetails').post(authenticationMiddleware.bearer, controller.getBatchDetails);
TTSM003Route.route('/CONFIRM').post( authenticationMiddleware.bearer,controller.CONFIRM);
TTSM003Route.route('/CONFIRM_Wires').post(authenticationMiddleware.bearer, controller.CONFIRM_Wires);
TTSM003Route.route('/getCoils_Wires').post(authenticationMiddleware.bearer, controller.getCoils_Wires);
TTSM003Route.route('/getCoils_LP').post(authenticationMiddleware.bearer, controller.getCoils_LP);
TTSM003Route.route('/odiafrm').post(authenticationMiddleware.bearer, controller.getOdiaFrm);
TTSM003Route.route('/odiato').post(authenticationMiddleware.bearer, controller.getOdiaTo);
TTSM003Route.route('/odiaList').post(authenticationMiddleware.bearer, controller.getOdia);
TTSM003Route.route('/thickList').post(authenticationMiddleware.bearer, controller.getThickList);
TTSM003Route.route('/lengthList').post(authenticationMiddleware.bearer, controller.getlengthList);
TTSM003Route.route('/status').post(authenticationMiddleware.bearer, controller.getStatus);
TTSM003Route.route('/getStoreLocation').get(authenticationMiddleware.bearer, controller.getStoreLocation);
TTSM003Route.route('/RETURN_COIL').post( authenticationMiddleware.bearer,controller.RETURN_COIL);

export default TTSM003Route