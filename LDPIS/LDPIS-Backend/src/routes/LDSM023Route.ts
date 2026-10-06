import { Router } from "express";
import * as controller from '../controllers/LDSM023Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM023Route = Router()
LDSM023Route.route('/getInventoryData').post(authenticationMiddleware.bearer,controller.getInventoryData);
// LDSM023Route.route('/odiafrm').post(authenticationMiddleware.bearer, controller.getOdiaFrm);
// LDSM023Route.route('/odiato').post(authenticationMiddleware.bearer, controller.getOdiaTo);
// LDSM023Route.route('/mergedinv').post(authenticationMiddleware.bearer, controller.getMergedInv);
// LDSM023Route.route('/getReversedBatchInfo').post(authenticationMiddleware.bearer, controller.getReversedBatchInfo);


export default LDSM023Route