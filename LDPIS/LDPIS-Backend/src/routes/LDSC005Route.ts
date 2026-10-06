import { Router } from "express";
import * as controller from '../controllers/LDSC005Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSC005Route = Router()

LDSC005Route.route('/getCodetyp').post(authenticationMiddleware.bearer, controller.getCodetyp);
LDSC005Route.route('/getCodeVal').post(authenticationMiddleware.bearer, controller.getCodeval);
LDSC005Route.route('/getRecords').post(authenticationMiddleware.bearer, controller.getRecords);
LDSC005Route.route('/insertRecords').post(authenticationMiddleware.bearer, controller.insertRecords);
LDSC005Route.route('/updateRecords').post(authenticationMiddleware.bearer, controller.updateRecords);
LDSC005Route.route('/deleteRecords').post(authenticationMiddleware.bearer, controller.deleteRecords);
LDSC005Route.route("/getGroupPlant").post(authenticationMiddleware.bearer, controller.getGroupPlant);
LDSC005Route.route("/getBatchId").post(authenticationMiddleware.bearer, controller.getBatchId);
LDSC005Route.route("/getIndTubesData").post(authenticationMiddleware.bearer, controller.getIndTubesData);


export default LDSC005Route