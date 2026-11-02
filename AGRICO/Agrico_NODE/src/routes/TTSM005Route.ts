import { Router } from "express";
import * as controller from '../controllers/TTSM005Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM005Route = Router()


// TTSM005Route.route('/getGroupPlant').post(authenticationMiddleware.bearer,authenticationMiddleware.bearer,authenticationMiddleware.bearer, authenticationMiddleware.reader, getGroupPlant); 
TTSM005Route.route('/getProcDesc').post(authenticationMiddleware.bearer, controller.GetProcDesc);
TTSM005Route.route('/getCommRecorder').post(authenticationMiddleware.bearer, controller.getCommRecorder);
TTSM005Route.route('/getOrderType').post(authenticationMiddleware.bearer, controller.GetOrderType);
// TTSM005Route.route('/getCount').post(authenticationMiddleware.bearer, controller.GetCount);
// TTSM005Route.route('/checkPackBatch').post(authenticationMiddleware.bearer, controller.CheckPackBatch);
TTSM005Route.route('/getLargeCount').post(authenticationMiddleware.bearer, controller.GetLargeCount);
// TTSM005Route.route('/getSCO_INSERT').post(authenticationMiddleware.bearer, controller.SCO_INSERT);
TTSM005Route.route('/CONFIRM').post(authenticationMiddleware.bearer, controller.CONFIRM);
// TTSM005Route.route('/CONFIRM_Wires').post(authenticationMiddleware.bearer, controller.CONFIRM_Wires);
// TTSM005Route.route('/getCoils_Wires').post(authenticationMiddleware.bearer, controller.getCoils_Wires);
TTSM005Route.route('/getSCOList').post(authenticationMiddleware.bearer, controller.GetSCOList);
// TTSM005Route.route('/getCheckRes').post(authenticationMiddleware.bearer, controller.checkRes);
TTSM005Route.route('/getCoils').post(authenticationMiddleware.bearer, controller.getCoils);
TTSM005Route.route('/getKbCoils').post(authenticationMiddleware.bearer, controller.getKbCoils);
// TTSM005Route.route('/getPrintResult').post(authenticationMiddleware.bearer, controller.PrintResult);
TTSM005Route.route('/getPlantAddress').post(authenticationMiddleware.bearer, controller.PlantAddress);
TTSM005Route.route('/getSFGDetails').post(authenticationMiddleware.bearer, controller.SFGDetails);
TTSM005Route.route('/getSecRsns').post(authenticationMiddleware.bearer, controller.getSecRsns);
TTSM005Route.route('/getStsList').post(authenticationMiddleware.bearer, controller.GetStsList);
TTSM005Route.route('/getCustDesc').post(authenticationMiddleware.bearer, controller.GetCustDesc);
TTSM005Route.route('/getOdiaList').post(authenticationMiddleware.bearer, controller.GetOdiaList);
TTSM005Route.route('/getSCO').post(authenticationMiddleware.bearer, controller.getSCO);
TTSM005Route.route('/getPrvEpa').post(authenticationMiddleware.bearer, controller.GetPrvEpa);
TTSM005Route.route('/getSrcCoil').post(authenticationMiddleware.bearer, controller.GetSrcCoil);
TTSM005Route.route('/getInsertLabel').post(authenticationMiddleware.bearer, controller.InsertLabel);
TTSM005Route.route('/getScrapDetails').post(authenticationMiddleware.bearer, controller.getScrapData);
TTSM005Route.route('/getInsertScrapDetails').post(authenticationMiddleware.bearer, controller.insertScrapDetails);

TTSM005Route.route('/getInsertScrapKbDetails').post(authenticationMiddleware.bearer, controller.getInsertScrapKbDetails);

TTSM005Route.route('/getScrapCheck').post(authenticationMiddleware.bearer, controller.getScrapFlag);
TTSM005Route.route("/getGroupPlant").post(authenticationMiddleware.bearer, controller.getGroupPlant);
TTSM005Route.route("/getBatchId").post(authenticationMiddleware.bearer, controller.getBatchId);
TTSM005Route.route("/getIndTubesData").post(authenticationMiddleware.bearer, controller.getIndTubesData);
TTSM005Route.route('/getPieceActl').post(authenticationMiddleware.bearer, controller.GetPieceActl);
TTSM005Route.route('/getpphProductName').post(authenticationMiddleware.bearer, controller.getProductName);

TTSM005Route.route('/saveKbBatches').post(authenticationMiddleware.bearer, controller.saveKbBatches);
TTSM005Route.route('/saveDefectBatches').post(authenticationMiddleware.bearer, controller.saveDefectBatches);
TTSM005Route.route('/printFGLabel').post(authenticationMiddleware.bearer, controller.printFGLabel);

export default TTSM005Route
