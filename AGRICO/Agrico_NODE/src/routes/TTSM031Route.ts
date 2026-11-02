import { Router } from "express";
import * as controller from '../controllers/TTSM031Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM031Route = Router();

TTSM031Route.route('/getGroupPlant').post(authenticationMiddleware.bearer, controller.getGroupPlant);
TTSM031Route.route('/getProcessList').post(authenticationMiddleware.bearer, controller.getProcessList);
TTSM031Route.route('/getScheduleData').post(authenticationMiddleware.bearer, controller.getScheduleData);
TTSM031Route.route('/getCoils').post(authenticationMiddleware.bearer, controller.getCoils);
TTSM031Route.route('/compute').post(authenticationMiddleware.bearer, controller.compute);
TTSM031Route.route('/confirm').post(authenticationMiddleware.bearer, controller.confirm);
TTSM031Route.route('/getOrdFilter').post(authenticationMiddleware.bearer, controller.GetOrdFilter);
TTSM031Route.route('/getPlanPath').post(authenticationMiddleware.bearer, controller.GetPlanPathWire);

TTSM031Route.route('/getordtyp').post(authenticationMiddleware.bearer, controller.getOrdTyp);
TTSM031Route.route('/getBatchDtl').post(authenticationMiddleware.bearer, controller.GetBatchDtl);
TTSM031Route.route('/getPdiDtl').post(authenticationMiddleware.bearer, controller.GetPdiDtl);
TTSM031Route.route('/insertSlitProd').post(authenticationMiddleware.bearer, controller.InsertSlitProd);
TTSM031Route.route('/getMCoilList').post(authenticationMiddleware.bearer, controller.GetMCoilList);
TTSM031Route.route('/getODIA').post(authenticationMiddleware.bearer, controller.GetODIA);
TTSM031Route.route('/getShiftStatus').post(authenticationMiddleware.bearer, controller.getShiftStatus);
TTSM031Route.route('/getProductionType').post(authenticationMiddleware.bearer, controller.getProductionType);
TTSM031Route.route('/getBatchCount').post(authenticationMiddleware.bearer, controller.getBatchCount);
TTSM031Route.route('/getWorkCenterDropdown').post(authenticationMiddleware.bearer, controller.getWorkCenterList);
TTSM031Route.route('/getScrapProductionTable').post(authenticationMiddleware.bearer, controller.getScrapProductionTable);
TTSM031Route.route('/getBatchDtlforLP').post(authenticationMiddleware.bearer, controller.GetBatchDtlforLP);
TTSM031Route.route('/getRsnDetails').post(authenticationMiddleware.bearer, controller.getHoldRsnDetails);
TTSM031Route.route('/getPdiDtlMultiLot').post(authenticationMiddleware.bearer, controller.GetPdiDtlMultiLot)
TTSM031Route.route('/getCRTScheduleMerge').post(authenticationMiddleware.bearer, controller.CRTScheduleMerge);
TTSM031Route.route('/getBatchId').post(authenticationMiddleware.bearer, controller.getBatchId);
TTSM031Route.route('/getInqDetl').post(authenticationMiddleware.bearer, controller.GetInqDetl);
TTSM031Route.route('/getScheduleDel').post(authenticationMiddleware.bearer, controller.ScheduleDel);
TTSM031Route.route('/getScheduleDelMerge').post(authenticationMiddleware.bearer, controller.ScheduleDelMerge);
TTSM031Route.route('/getWorkCenter').post(authenticationMiddleware.bearer, controller.getWorkCenter);
TTSM031Route.route('/getMergeBatchDetails').post(authenticationMiddleware.bearer, controller.getMergeBatchDetails);
TTSM031Route.route('/getStatusList').post(authenticationMiddleware.bearer, controller.getStatus);
TTSM031Route.route('/getResqtyval').post(authenticationMiddleware.bearer, controller.getResqtyval);


export default TTSM031Route