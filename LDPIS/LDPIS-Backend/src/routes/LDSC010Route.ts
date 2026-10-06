import { Router } from "express";
import * as controller from '../controllers/LDSC010Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'


const LDSC010Route = Router();

LDSC010Route.route('/getRmReceivedOnDate').post(authenticationMiddleware.bearer, controller.getRmReceivedOnDate);
LDSC010Route.route('/getMatGrp').post(authenticationMiddleware.bearer, controller.getMatGrp);
LDSC010Route.route('/getRmReceivedToDate').post(authenticationMiddleware.bearer, controller.getRmReceivedToDate);
LDSC010Route.route('/getAllotmentOnDate').post(authenticationMiddleware.bearer, controller.getAllotmentOnDate);
LDSC010Route.route('/getAllotmentToDate').post(authenticationMiddleware.bearer, controller.getAllotmentToDate);
LDSC010Route.route('/getTubeSchedulingOnDate').post(authenticationMiddleware.bearer, controller.getTubeSchedulingOnDate);
LDSC010Route.route('/getTubeSchedulingToDate').post(authenticationMiddleware.bearer, controller.getTubeSchedulingToDate);
LDSC010Route.route('/getTubeProductionOnDate').post(authenticationMiddleware.bearer, controller.getTubeProductionOnDate);
LDSC010Route.route('/getTubeProductionToDate').post(authenticationMiddleware.bearer, controller.getTubeProductionToDate);
LDSC010Route.route('/getPackingConfirmationOnDate').post(authenticationMiddleware.bearer, controller.getPackingConfirmationOnDate);
LDSC010Route.route('/getPackingConfirmationToDate').post(authenticationMiddleware.bearer, controller.getPackingConfirmationToDate);

LDSC010Route.route('/getInventorySumRm').post(authenticationMiddleware.bearer, controller.getInventorySumRm);
LDSC010Route.route('/getInventorySumWip').post(authenticationMiddleware.bearer, controller.getInventorySumWip);
LDSC010Route.route('/getInventorySumPendingUd').post(authenticationMiddleware.bearer, controller.getInventorySumPendingUd);
LDSC010Route.route('/getInventorySumFG').post(authenticationMiddleware.bearer, controller.getInventorySumFG);

LDSC010Route.route('/getStageWiseInventoryRm').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryRm);
LDSC010Route.route('/getStageWiseInventoryPendingUd').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryPendingUd);
LDSC010Route.route('/getStageWiseInventoryAnn').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryAnn);
LDSC010Route.route('/getStageWiseInventoryColdDraw').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryColdDraw);
LDSC010Route.route('/getStageWiseInventoryStp').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryStp);
LDSC010Route.route('/getStageWiseInventoryCtl').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryCtl);
LDSC010Route.route('/getStageWiseInventoryHydra').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryHydra);
LDSC010Route.route('/getStageWiseInventoryEct').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryEct);
LDSC010Route.route('/getStageWiseInventoryFG').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryFG);
LDSC010Route.route('/getStageWiseInventoryFinalUD').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryFinalUD);
LDSC010Route.route('/getStageWiseInventoryPacking').post(authenticationMiddleware.bearer, controller.getStageWiseInventoryPacking);

LDSC010Route.route('/getStageWiseGrAllAPI').post(authenticationMiddleware.bearer, controller.getStageWiseGrAllAPI);
LDSC010Route.route('/getGRReportData').post(authenticationMiddleware.bearer, controller.getGRReportData);
export default LDSC010Route