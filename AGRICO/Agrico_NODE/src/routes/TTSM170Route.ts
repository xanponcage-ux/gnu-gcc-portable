import { Router } from "express";
import * as controller from '../controllers/TTSM170Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM170Route = Router()

TTSM170Route.route('/getProcDesc').post(authenticationMiddleware.bearer, controller.GetProcDesc);
TTSM170Route.route('/getIDIA').post(authenticationMiddleware.bearer, controller.GetIDIA);
TTSM170Route.route('/getODIA').post(authenticationMiddleware.bearer, controller.GetODIA);
TTSM170Route.route('/getRoll').post(authenticationMiddleware.bearer, controller.GetRoll);
TTSM170Route.route('/getPath').post(authenticationMiddleware.bearer, controller.GetPath);
TTSM170Route.route('/ordercHK').post(authenticationMiddleware.bearer, controller.OrdercHK);
TTSM170Route.route('/RMDetails').post(authenticationMiddleware.bearer, controller.RMDetails);
TTSM170Route.route('/coilDetails').post(authenticationMiddleware.bearer, controller.CoilDetails);
TTSM170Route.route('/getSchDetl').post(authenticationMiddleware.bearer, controller.GetSchDetl);
TTSM170Route.route('/getInqDetl').post(authenticationMiddleware.bearer, controller.GetInqDetl);
TTSM170Route.route('/getWIPSchDetl').post(authenticationMiddleware.bearer, controller.GetWIPSchDetl);
TTSM170Route.route('/getscheduleConf').post(authenticationMiddleware.bearer, controller.ScheduleConf);
TTSM170Route.route('/getScheduleDel').post(authenticationMiddleware.bearer, controller.ScheduleDel);
TTSM170Route.route('/getWIPSchedule').post(authenticationMiddleware.bearer, controller.WIPSchedule);
TTSM170Route.route('/getCRTSchedule').post(authenticationMiddleware.bearer, controller.CRTSchedule);
TTSM170Route.route('/getCRTScheduleAll').post(authenticationMiddleware.bearer, controller.CRTScheduleAll);
TTSM170Route.route('/getOrder').post(authenticationMiddleware.bearer, controller.GetOrder);
TTSM170Route.route('/getAddedColumns').post(authenticationMiddleware.bearer, controller.GetAddedColumns);
TTSM170Route.route('/getWorkCenter').post(authenticationMiddleware.bearer, controller.getWorkCenter);
TTSM170Route.route('/getMbatch').post(authenticationMiddleware.bearer, controller.getMotherBatch);
TTSM170Route.route('/getBatchId').post(authenticationMiddleware.bearer, controller.getBatchId);
TTSM170Route.route('/getAllOrderList').post(authenticationMiddleware.bearer, controller.getAllOrderList);
TTSM170Route.route('/getAllItemList').post(authenticationMiddleware.bearer, controller.getAllItemList);
TTSM170Route.route('/getScheduleType').post(authenticationMiddleware.bearer, controller.schTypModal);
TTSM170Route.route('/getSfgMaterial').post(authenticationMiddleware.bearer, controller.schMatDesc);
TTSM170Route.route('/getMergeBatchDetails').post(authenticationMiddleware.bearer, controller.getMergeBatchDetails);
TTSM170Route.route('/getScheduleDelMerge').post(authenticationMiddleware.bearer, controller.ScheduleDelMerge);
TTSM170Route.route('/getNoMergeDetails').post(authenticationMiddleware.bearer, controller.noMergeDetails);
TTSM170Route.route('/saveTubeWip').post(authenticationMiddleware.bearer, controller.saveTUBEWIP);
TTSM170Route.route('/getPrioity').post(authenticationMiddleware.bearer, controller.getPrioity);
TTSM170Route.route('/getPathKhapoli').post(authenticationMiddleware.bearer, controller.getPathKhapoli);


export default TTSM170Route