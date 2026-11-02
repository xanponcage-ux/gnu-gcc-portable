import { Router } from "express";
import * as controller from '../controllers/TTSM032Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM032Route = Router()

TTSM032Route.route('/getProcDesc').post(authenticationMiddleware.bearer, controller.GetProcDesc);
TTSM032Route.route('/getIDIA').post(authenticationMiddleware.bearer, controller.GetIDIA);
TTSM032Route.route('/getODIA').post(authenticationMiddleware.bearer, controller.GetODIA);
TTSM032Route.route('/getRoll').post(authenticationMiddleware.bearer, controller.GetRoll);
TTSM032Route.route('/getPath').post(authenticationMiddleware.bearer, controller.GetPath);
TTSM032Route.route('/ordercHK').post(authenticationMiddleware.bearer, controller.OrdercHK);
TTSM032Route.route('/RMDetails').post(authenticationMiddleware.bearer, controller.RMDetails);
TTSM032Route.route('/coilDetails').post(authenticationMiddleware.bearer, controller.CoilDetails);
TTSM032Route.route('/getSchDetl').post(authenticationMiddleware.bearer, controller.GetSchDetl);
TTSM032Route.route('/getInqDetl').post(authenticationMiddleware.bearer, controller.GetInqDetl);
TTSM032Route.route('/getWIPSchDetl').post(authenticationMiddleware.bearer, controller.GetWIPSchDetl);
TTSM032Route.route('/getscheduleConf').post(authenticationMiddleware.bearer, controller.ScheduleConf);
TTSM032Route.route('/getScheduleDel').post(authenticationMiddleware.bearer, controller.ScheduleDel);
TTSM032Route.route('/getWIPSchedule').post(authenticationMiddleware.bearer, controller.WIPSchedule);
TTSM032Route.route('/getCRTSchedule').post(authenticationMiddleware.bearer, controller.CRTSchedule);
TTSM032Route.route('/getOrder').post(authenticationMiddleware.bearer, controller.GetOrder);
TTSM032Route.route('/getAddedColumns').post(authenticationMiddleware.bearer, controller.GetAddedColumns);
TTSM032Route.route('/getWorkCenter').post(authenticationMiddleware.bearer, controller.getWorkCenter);
TTSM032Route.route('/getMbatch').post(authenticationMiddleware.bearer, controller.getMotherBatch);
TTSM032Route.route('/getBatchId').post(authenticationMiddleware.bearer, controller.getBatchId);
TTSM032Route.route('/getAllOrderList').post(authenticationMiddleware.bearer, controller.getAllOrderList);
TTSM032Route.route('/getAllItemList').post(authenticationMiddleware.bearer, controller.getAllItemList);
TTSM032Route.route('/getScheduleType').post(authenticationMiddleware.bearer, controller.schTypModal);
TTSM032Route.route('/getSfgMaterial').post(authenticationMiddleware.bearer, controller.schMatDesc);
TTSM032Route.route('/getMergeBatchDetails').post(authenticationMiddleware.bearer, controller.getMergeBatchDetails);
TTSM032Route.route('/getScheduleDelMerge').post(authenticationMiddleware.bearer, controller.ScheduleDelMerge);


export default TTSM032Route