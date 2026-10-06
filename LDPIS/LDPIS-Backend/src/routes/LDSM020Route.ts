import { Router } from "express";
import * as controller from '../controllers/LDSM020Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TubePlanningRoute = Router()
TubePlanningRoute.route('/getTubePlanData').post(authenticationMiddleware.bearer,controller.getTubePlanData);
TubePlanningRoute.route('/getPlanModalData').post(authenticationMiddleware.bearer,controller.getPlanModalData);
TubePlanningRoute.route('/odiafrm').post(authenticationMiddleware.bearer, controller.getOdiaFrm);
TubePlanningRoute.route('/odiato').post(authenticationMiddleware.bearer, controller.getOdiaTo);
TubePlanningRoute.route('/getRefresh').post(authenticationMiddleware.bearer, controller.getRefresh);
export default TubePlanningRoute

//added