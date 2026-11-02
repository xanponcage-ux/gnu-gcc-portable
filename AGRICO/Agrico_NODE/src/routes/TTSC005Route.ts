import { Router } from "express";
import * as controller from '../controllers/TTSC005Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSC005Route = Router()

TTSC005Route.route('/getCodetyp').post(authenticationMiddleware.bearer, controller.getCodetyp);
TTSC005Route.route('/getCodeVal').post(authenticationMiddleware.bearer, controller.getCodeval);
TTSC005Route.route('/getRecords').post(authenticationMiddleware.bearer, controller.getRecords);
TTSC005Route.route('/insertRecords').post(authenticationMiddleware.bearer, controller.insertRecords);
TTSC005Route.route('/updateRecords').post(authenticationMiddleware.bearer, controller.updateRecords);
TTSC005Route.route('/deleteRecords').post(authenticationMiddleware.bearer, controller.deleteRecords);
TTSC005Route.route("/getGroupPlant").post(authenticationMiddleware.bearer, controller.getGroupPlant);
TTSC005Route.route("/getBatchId").post(authenticationMiddleware.bearer, controller.getBatchId);
TTSC005Route.route("/getIndTubesData").post(authenticationMiddleware.bearer, controller.getIndTubesData);


export default TTSC005Route