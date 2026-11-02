import { Router } from "express";
import * as controller from '../controllers/TTSC010Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'


const TTSC010Route = Router();

TTSC010Route.route('/getRmReceivedOnDate').post(authenticationMiddleware.bearer, controller.getRmReceivedOnDate);
TTSC010Route.route('/getMatGrp').post(authenticationMiddleware.bearer, controller.getMatGrp);
TTSC010Route.route('/getRmReceivedToDate').post(authenticationMiddleware.bearer, controller.getRmReceivedToDate);
TTSC010Route.route('/getAllotmentOnDate').post(authenticationMiddleware.bearer, controller.getAllotmentOnDate);
TTSC010Route.route('/getAllotmentToDate').post(authenticationMiddleware.bearer, controller.getAllotmentToDate);
TTSC010Route.route('/getTubeSchedulingOnDate').post(authenticationMiddleware.bearer, controller.getTubeSchedulingOnDate);
TTSC010Route.route('/getTubeSchedulingToDate').post(authenticationMiddleware.bearer, controller.getTubeSchedulingToDate);
TTSC010Route.route('/getTubeProductionOnDate').post(authenticationMiddleware.bearer, controller.getTubeProductionOnDate);
TTSC010Route.route('/getTubeProductionToDate').post(authenticationMiddleware.bearer, controller.getTubeProductionToDate);
TTSC010Route.route('/getPackingConfirmationOnDate').post(authenticationMiddleware.bearer, controller.getPackingConfirmationOnDate);
TTSC010Route.route('/getPackingConfirmationToDate').post(authenticationMiddleware.bearer, controller.getPackingConfirmationToDate);

TTSC010Route.route('/getInventorySumRm').post(authenticationMiddleware.bearer, controller.getInventorySumRm);
TTSC010Route.route('/getInventorySumWip').post(authenticationMiddleware.bearer, controller.getInventorySumWip);
TTSC010Route.route('/getInventorySumPendingUd').post(authenticationMiddleware.bearer, controller.getInventorySumPendingUd);
TTSC010Route.route('/getInventorySumFG').post(authenticationMiddleware.bearer, controller.getInventorySumFG);

TTSC010Route.route('/getStageWiseInventoryRm').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryRm);
TTSC010Route.route('/getStageWiseInventoryPendingUd').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryPendingUd);
TTSC010Route.route('/getStageWiseInventoryAnn').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryAnn);
TTSC010Route.route('/getStageWiseInventoryColdDraw').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryColdDraw);
TTSC010Route.route('/getStageWiseInventoryStp').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryStp);
TTSC010Route.route('/getStageWiseInventoryCtl').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryCtl);
TTSC010Route.route('/getStageWiseInventoryHydra').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryHydra);
TTSC010Route.route('/getStageWiseInventoryEct').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryEct);
TTSC010Route.route('/getStageWiseInventoryFG').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryFG);
TTSC010Route.route('/getStageWiseInventoryFinalUD').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryFinalUD);
TTSC010Route.route('/getStageWiseInventoryPacking').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryPacking);

TTSC010Route.route('/getStageWiseGrAllAPI').post(authenticationMiddleware.bearer, controller.getStageWiseGrAllAPI);
TTSC010Route.route('/getGRReportData').post(authenticationMiddleware.bearer, controller.getGRReportData);
export default TTSC010Route