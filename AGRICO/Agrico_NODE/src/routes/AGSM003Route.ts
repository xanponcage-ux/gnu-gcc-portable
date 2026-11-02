import { Router } from "express";
import * as controller from '../controllers/AGSM003Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const AGSM003Route = Router()


// AGSM003Route.route('/getGroupPlant').post(authenticationMiddleware.bearer, authenticationMiddleware.reader, getGroupPlant); 
AGSM003Route.route('/getRolePlant').post(authenticationMiddleware.bearer, controller.getRolePlant);
AGSM003Route.route('/getCoils').post(authenticationMiddleware.bearer, controller.getCoils);
AGSM003Route.route('/getBatchDetails').post(authenticationMiddleware.bearer, controller.getBatchDetails);
AGSM003Route.route('/save').post( authenticationMiddleware.bearer,controller.CONFIRM);
AGSM003Route.route('/CONFIRM_Wires').post(authenticationMiddleware.bearer, controller.CONFIRM_Wires);
AGSM003Route.route('/getCoils_Wires').post(authenticationMiddleware.bearer, controller.getCoils_Wires);
AGSM003Route.route('/getCoils_LP').post(authenticationMiddleware.bearer, controller.getCoils_LP);
AGSM003Route.route('/odiafrm').post(authenticationMiddleware.bearer, controller.getOdiaFrm);
AGSM003Route.route('/odiato').post(authenticationMiddleware.bearer, controller.getOdiaTo);
AGSM003Route.route('/odiaList').post(authenticationMiddleware.bearer, controller.getOdia);
AGSM003Route.route('/thickList').post(authenticationMiddleware.bearer, controller.getThickList);
AGSM003Route.route('/lengthList').post(authenticationMiddleware.bearer, controller.getlengthList);
AGSM003Route.route('/status').post(authenticationMiddleware.bearer, controller.getStatus);
AGSM003Route.route('/getStoreLocation').get(authenticationMiddleware.bearer, controller.getStoreLocation);
AGSM003Route.route('/RETURN_COIL').post( authenticationMiddleware.bearer,controller.RETURN_COIL);

export default AGSM003Route