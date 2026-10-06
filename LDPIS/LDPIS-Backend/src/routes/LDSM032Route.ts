import { Router } from "express";
import * as controller from '../controllers/LDSM032Controller';
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM032Route = Router()

LDSM032Route.route('/getProcDesc').post(authenticationMiddleware.bearer, controller.GetProcDesc);
LDSM032Route.route('/getIDIA').post(authenticationMiddleware.bearer, controller.GetIDIA);
LDSM032Route.route('/getODIA').post(authenticationMiddleware.bearer, controller.GetODIA);
LDSM032Route.route('/getRoll').post(authenticationMiddleware.bearer, controller.GetRoll);
LDSM032Route.route('/getPath').post(authenticationMiddleware.bearer, controller.GetPath);
LDSM032Route.route('/ordercHK').post(authenticationMiddleware.bearer, controller.OrdercHK);
LDSM032Route.route('/RMDetails').post(authenticationMiddleware.bearer, controller.RMDetails);
LDSM032Route.route('/coilDetails').post(authenticationMiddleware.bearer, controller.CoilDetails);
LDSM032Route.route('/getSchDetl').post(authenticationMiddleware.bearer, controller.GetSchDetl);
LDSM032Route.route('/getInqDetl').post(authenticationMiddleware.bearer, controller.GetInqDetl);
LDSM032Route.route('/getWIPSchDetl').post(authenticationMiddleware.bearer, controller.GetWIPSchDetl);
LDSM032Route.route('/getscheduleConf').post(authenticationMiddleware.bearer, controller.ScheduleConf);
LDSM032Route.route('/getScheduleDel').post(authenticationMiddleware.bearer, controller.ScheduleDel);
LDSM032Route.route('/getWIPSchedule').post(authenticationMiddleware.bearer, controller.WIPSchedule);
LDSM032Route.route('/getCRTSchedule').post(authenticationMiddleware.bearer, controller.CRTSchedule);
LDSM032Route.route('/getOrder').post(authenticationMiddleware.bearer, controller.GetOrder);
LDSM032Route.route('/getAddedColumns').post(authenticationMiddleware.bearer, controller.GetAddedColumns);
LDSM032Route.route('/getWorkCenter').post(authenticationMiddleware.bearer, controller.getWorkCenter);
LDSM032Route.route('/getMbatch').post(authenticationMiddleware.bearer, controller.getMotherBatch);
LDSM032Route.route('/getBatchId').post(authenticationMiddleware.bearer, controller.getBatchId);
LDSM032Route.route('/getAllOrderList').post(authenticationMiddleware.bearer, controller.getAllOrderList);
LDSM032Route.route('/getAllItemList').post(authenticationMiddleware.bearer, controller.getAllItemList);
LDSM032Route.route('/getScheduleType').post(authenticationMiddleware.bearer, controller.schTypModal);
LDSM032Route.route('/getSfgMaterial').post(authenticationMiddleware.bearer, controller.schMatDesc);
LDSM032Route.route('/getMergeBatchDetails').post(authenticationMiddleware.bearer, controller.getMergeBatchDetails);
LDSM032Route.route('/getScheduleDelMerge').post(authenticationMiddleware.bearer, controller.ScheduleDelMerge);


export default LDSM032Route