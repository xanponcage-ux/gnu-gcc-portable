import { Router } from "express";
import * as controller from '../controllers/LDCR001Controller'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'

const LDCR001Route = Router()
LDCR001Route.route('/getinspectorlist').post(authenticationMiddleware.bearer,controller.getinspectorlist);
LDCR001Route.route('/getimpactdata').post(authenticationMiddleware.bearer,controller.getimpactdata);
LDCR001Route.route('/getautomaticweld').post(authenticationMiddleware.bearer,controller.getautomaticweld);
LDCR001Route.route('/getautomaticweldbody').post(authenticationMiddleware.bearer,controller.getautomaticweldbody);


LDCR001Route.route('/getchemdata').post(authenticationMiddleware.bearer,controller.getchemdata);
LDCR001Route.route('/getVdidata').post(authenticationMiddleware.bearer,controller.getVdidata);

LDCR001Route.route('/gethardnessdata').post(authenticationMiddleware.bearer,controller.gethardnessdata);

LDCR001Route.route('/getFRBTdata').post(authenticationMiddleware.bearer,controller.getFRBTdata);

LDCR001Route.route('/getVdirdata').post(authenticationMiddleware.bearer,controller.getVdirdata);
LDCR001Route.route('/getVdirSdata').post(authenticationMiddleware.bearer,controller.getVdirSdata);

LDCR001Route.route('/getMRRdata').post(authenticationMiddleware.bearer,controller.getMRRdata);
LDCR001Route.route('/getMRRSdata').post(authenticationMiddleware.bearer,controller.getMRRSdata);

LDCR001Route.route('/getDROPdata').post(authenticationMiddleware.bearer,controller.getDROPdata);

LDCR001Route.route('/getmechanicaldata').post(authenticationMiddleware.bearer,controller.getmechanicaldata);
LDCR001Route.route('/getmechanicaldataWTWT').post(authenticationMiddleware.bearer,controller.getmechanicaldataWTWT);

LDCR001Route.route('/getMGERdata').post(authenticationMiddleware.bearer,controller.getMGERdata);

LDCR001Route.route('/getMGNdata').post(authenticationMiddleware.bearer,controller.getMGNdata);
LDCR001Route.route('/getHYSdata').post(authenticationMiddleware.bearer,controller.getHYSdata);

// LDCR001Route.route('/getInventoryData').post(authenticationMiddleware.bearer,controller.getInventoryData);
LDCR001Route.route('/GetreportTyp').post(authenticationMiddleware.bearer, controller.GetreportTyp);
LDCR001Route.route('/GetPipenomill').post(authenticationMiddleware.bearer, controller.GetPipenomill);
LDCR001Route.route('/GetSlitnomill').post(authenticationMiddleware.bearer, controller.GetSlitnomill);
LDCR001Route.route('/GetPipenomillround').post(authenticationMiddleware.bearer, controller.GetPipenomillround);
LDCR001Route.route('/GetPipenomulti').post(authenticationMiddleware.bearer, controller.GetPipenomulti);
LDCR001Route.route('/odiafrm').post(authenticationMiddleware.bearer, controller.getOdiaFrm);
LDCR001Route.route('/odiato').post(authenticationMiddleware.bearer, controller.getOdiaTo);
LDCR001Route.route('/mergedinv').post(authenticationMiddleware.bearer, controller.getMergedInv);
LDCR001Route.route('/getReversedBatchInfo').post(authenticationMiddleware.bearer, controller.getReversedBatchInfo);


export default LDCR001Route


// CHanges for production movement