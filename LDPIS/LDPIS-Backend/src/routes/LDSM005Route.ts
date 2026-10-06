import { Router } from "express";
import * as controller from '../controllers/LDSM005Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM005Route = Router()


// LDSM005Route.route('/getGroupPlant').post(authenticationMiddleware.bearer,authenticationMiddleware.bearer,authenticationMiddleware.bearer, authenticationMiddleware.reader, getGroupPlant); 
LDSM005Route.route('/getProcDesc').post(authenticationMiddleware.bearer, controller.GetProcDesc);
LDSM005Route.route('/getCommRecorder').post(authenticationMiddleware.bearer, controller.getCommRecorder);
LDSM005Route.route('/getOrderType').post(authenticationMiddleware.bearer, controller.GetOrderType);
// LDSM005Route.route('/getCount').post(authenticationMiddleware.bearer, controller.GetCount);
// LDSM005Route.route('/checkPackBatch').post(authenticationMiddleware.bearer, controller.CheckPackBatch);
LDSM005Route.route('/getLargeCount').post(authenticationMiddleware.bearer, controller.GetLargeCount);
// LDSM005Route.route('/getSCO_INSERT').post(authenticationMiddleware.bearer, controller.SCO_INSERT);
LDSM005Route.route('/CONFIRM').post(authenticationMiddleware.bearer, controller.CONFIRM);
// LDSM005Route.route('/CONFIRM_Wires').post(authenticationMiddleware.bearer, controller.CONFIRM_Wires);
// LDSM005Route.route('/getCoils_Wires').post(authenticationMiddleware.bearer, controller.getCoils_Wires);
LDSM005Route.route('/getSCOList').post(authenticationMiddleware.bearer, controller.GetSCOList);
// LDSM005Route.route('/getCheckRes').post(authenticationMiddleware.bearer, controller.checkRes);
LDSM005Route.route('/getCoils').post(authenticationMiddleware.bearer, controller.getCoils);
LDSM005Route.route('/getKbCoils').post(authenticationMiddleware.bearer, controller.getKbCoils);
// LDSM005Route.route('/getPrintResult').post(authenticationMiddleware.bearer, controller.PrintResult);
LDSM005Route.route('/getPlantAddress').post(authenticationMiddleware.bearer, controller.PlantAddress);
LDSM005Route.route('/getSFGDetails').post(authenticationMiddleware.bearer, controller.SFGDetails);
LDSM005Route.route('/getSecRsns').post(authenticationMiddleware.bearer, controller.getSecRsns);
LDSM005Route.route('/getStsList').post(authenticationMiddleware.bearer, controller.GetStsList);
LDSM005Route.route('/getCustDesc').post(authenticationMiddleware.bearer, controller.GetCustDesc);
LDSM005Route.route('/getOdiaList').post(authenticationMiddleware.bearer, controller.GetOdiaList);
LDSM005Route.route('/getSCO').post(authenticationMiddleware.bearer, controller.getSCO);
LDSM005Route.route('/getPrvEpa').post(authenticationMiddleware.bearer, controller.GetPrvEpa);
LDSM005Route.route('/getSrcCoil').post(authenticationMiddleware.bearer, controller.GetSrcCoil);
LDSM005Route.route('/getInsertLabel').post(authenticationMiddleware.bearer, controller.InsertLabel);
LDSM005Route.route('/getScrapDetails').post(authenticationMiddleware.bearer, controller.getScrapData);
LDSM005Route.route('/getInsertScrapDetails').post(authenticationMiddleware.bearer, controller.insertScrapDetails);

LDSM005Route.route('/getInsertScrapKbDetails').post(authenticationMiddleware.bearer, controller.getInsertScrapKbDetails);

LDSM005Route.route('/getScrapCheck').post(authenticationMiddleware.bearer, controller.getScrapFlag);
LDSM005Route.route("/getGroupPlant").post(authenticationMiddleware.bearer, controller.getGroupPlant);
LDSM005Route.route("/getBatchId").post(authenticationMiddleware.bearer, controller.getBatchId);
LDSM005Route.route("/getIndTubesData").post(authenticationMiddleware.bearer, controller.getIndTubesData);
LDSM005Route.route('/getPieceActl').post(authenticationMiddleware.bearer, controller.GetPieceActl);
LDSM005Route.route('/getpphProductName').post(authenticationMiddleware.bearer, controller.getProductName);

LDSM005Route.route('/saveKbBatches').post(authenticationMiddleware.bearer, controller.saveKbBatches);
LDSM005Route.route('/saveDefectBatches').post(authenticationMiddleware.bearer, controller.saveDefectBatches);
LDSM005Route.route('/printFGLabel').post(authenticationMiddleware.bearer, controller.printFGLabel);

export default LDSM005Route
