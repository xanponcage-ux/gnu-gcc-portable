import { Router } from "express";
import * as controller from '../controllers/TTSM048Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const TTSM048Route = Router()
TTSM048Route.route('/getScrapData').post(authenticationMiddleware.bearer, controller.getScrapData);
TTSM048Route.route('/processdesc').post(authenticationMiddleware.bearer, controller.getProcessDesc);
TTSM048Route.route('/getMaterialData').post(authenticationMiddleware.bearer, controller.getMaterialData);
TTSM048Route.route('/mergingdata').post(authenticationMiddleware.bearer, controller.getMergingData);
TTSM048Route.route('/savemergingdata').post(authenticationMiddleware.bearer, controller.saveMergingData);
TTSM048Route.route('/savemergingdataTemp').post(authenticationMiddleware.bearer, controller.saveMergingDataTemp);
TTSM048Route.route('/materialno').post(authenticationMiddleware.bearer, controller.getMaterialNo);
TTSM048Route.route('/castno').post(authenticationMiddleware.bearer, controller.getCastNo);
TTSM048Route.route('/momdata').post(authenticationMiddleware.bearer, controller.getMoMData);
TTSM048Route.route('/momtarmatno').post(
    authenticationMiddleware.bearer,
    controller.getMoMTargetMaterialNo);

TTSM048Route.route('/savemomdata').post(
    authenticationMiddleware.bearer,
    controller.saveMoMData);

TTSM048Route.route('/momwidthodia').post(authenticationMiddleware.bearer, controller.getMoMWidthOdia);
TTSM048Route.route('/splitdata').post(
    authenticationMiddleware.bearer,
    controller.getSplitData);

TTSM048Route.route('/getsplitbatch').post(
    authenticationMiddleware.bearer,
    controller.getSplitBatch);

TTSM048Route.route('/getsplitbatchRM').post(
    authenticationMiddleware.bearer,
    controller.getsplitbatchRM);

    TTSM048Route.route('/getsplitbatchActal').post(
        authenticationMiddleware.bearer,
        controller.getsplitbatchActal);

TTSM048Route.route('/savesplitbatch').post(
    authenticationMiddleware.bearer,
    controller.saveSplitBatch);


TTSM048Route.route('/scraprsn').post(authenticationMiddleware.bearer, controller.getScrapRsn);
TTSM048Route.route('/scrapmatno').post(authenticationMiddleware.bearer, controller.getScrapMatNo);

TTSM048Route.route('/maintainreason').post(authenticationMiddleware.bearer, controller.saveMaintainReason);
TTSM048Route.route('/postscrap').post(authenticationMiddleware.bearer, controller.postScrap);
TTSM048Route.route('/getReasonCategory').post(authenticationMiddleware.bearer, controller.getReasonCategory);

TTSM048Route.route('/getsplitbatchdetails').post(authenticationMiddleware.bearer, controller.getSplitBatchDetails);
TTSM048Route.route('/getsptbatchdetails').post(authenticationMiddleware.bearer, controller.getBatchDetails);

TTSM048Route.route('/getauth').post(authenticationMiddleware.bearer, controller.getAuth);
TTSM048Route.route('/getSplitStatus').post(authenticationMiddleware.bearer, controller.GetSplitStatus);
TTSM048Route.route('/getMergingStatus').post(authenticationMiddleware.bearer, controller.GetMergingStatus);
TTSM048Route.route('/getPieceActl').post(authenticationMiddleware.bearer, controller.GetPieceActl);

export default TTSM048Route