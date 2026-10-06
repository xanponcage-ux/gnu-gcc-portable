import { Router } from "express";
import * as controller from '../controllers/LDSM048Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDSM048Route = Router()
LDSM048Route.route('/getScrapData').post(authenticationMiddleware.bearer, controller.getScrapData);
LDSM048Route.route('/processdesc').post(authenticationMiddleware.bearer, controller.getProcessDesc);
LDSM048Route.route('/getMaterialData').post(authenticationMiddleware.bearer, controller.getMaterialData);
LDSM048Route.route('/mergingdata').post(authenticationMiddleware.bearer, controller.getMergingData);
LDSM048Route.route('/savemergingdata').post(authenticationMiddleware.bearer, controller.saveMergingData);
LDSM048Route.route('/savemergingdataTemp').post(authenticationMiddleware.bearer, controller.saveMergingDataTemp);
LDSM048Route.route('/materialno').post(authenticationMiddleware.bearer, controller.getMaterialNo);
LDSM048Route.route('/castno').post(authenticationMiddleware.bearer, controller.getCastNo);
LDSM048Route.route('/momdata').post(authenticationMiddleware.bearer, controller.getMoMData);
LDSM048Route.route('/momtarmatno').post(
    authenticationMiddleware.bearer,
    controller.getMoMTargetMaterialNo);

LDSM048Route.route('/savemomdata').post(
    authenticationMiddleware.bearer,
    controller.saveMoMData);

LDSM048Route.route('/momwidthodia').post(authenticationMiddleware.bearer, controller.getMoMWidthOdia);
LDSM048Route.route('/splitdata').post(
    authenticationMiddleware.bearer,
    controller.getSplitData);

LDSM048Route.route('/getsplitbatch').post(
    authenticationMiddleware.bearer,
    controller.getSplitBatch);

LDSM048Route.route('/getsplitbatchRM').post(
    authenticationMiddleware.bearer,
    controller.getsplitbatchRM);

    LDSM048Route.route('/getsplitbatchActal').post(
        authenticationMiddleware.bearer,
        controller.getsplitbatchActal);

LDSM048Route.route('/savesplitbatch').post(
    authenticationMiddleware.bearer,
    controller.saveSplitBatch);


LDSM048Route.route('/scraprsn').post(authenticationMiddleware.bearer, controller.getScrapRsn);
LDSM048Route.route('/scrapmatno').post(authenticationMiddleware.bearer, controller.getScrapMatNo);

LDSM048Route.route('/maintainreason').post(authenticationMiddleware.bearer, controller.saveMaintainReason);
LDSM048Route.route('/postscrap').post(authenticationMiddleware.bearer, controller.postScrap);
LDSM048Route.route('/getReasonCategory').post(authenticationMiddleware.bearer, controller.getReasonCategory);

LDSM048Route.route('/getsplitbatchdetails').post(authenticationMiddleware.bearer, controller.getSplitBatchDetails);
LDSM048Route.route('/getsptbatchdetails').post(authenticationMiddleware.bearer, controller.getBatchDetails);

LDSM048Route.route('/getauth').post(authenticationMiddleware.bearer, controller.getAuth);
LDSM048Route.route('/getSplitStatus').post(authenticationMiddleware.bearer, controller.GetSplitStatus);
LDSM048Route.route('/getMergingStatus').post(authenticationMiddleware.bearer, controller.GetMergingStatus);
LDSM048Route.route('/getPieceActl').post(authenticationMiddleware.bearer, controller.GetPieceActl);

export default LDSM048Route