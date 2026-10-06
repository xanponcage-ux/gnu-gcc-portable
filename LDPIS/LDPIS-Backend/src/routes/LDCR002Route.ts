import { Router } from "express";
import * as controller from "../controllers/LDCR002Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDCR002Route = Router();

LDCR002Route.route("/getAirdata").post(
  authenticationMiddleware.bearer,
  controller.getAirdata
);
LDCR002Route.route("/getCrossdata").post(
  authenticationMiddleware.bearer,
  controller.getCrossdata
);
LDCR002Route.route("/getREPAIRdata").post(
  authenticationMiddleware.bearer,
  controller.getREPAIRdata
);
LDCR002Route.route("/getdustdata").post(
  authenticationMiddleware.bearer,
  controller.getdustdata
);
LDCR002Route.route("/getepoxydata").post(
  authenticationMiddleware.bearer,
  controller.getepoxydata
);
LDCR002Route.route("/getimpactdata").post(
  authenticationMiddleware.bearer,
  controller.getimpactdata
);
LDCR002Route.route("/getpeeldata").post(
  authenticationMiddleware.bearer,
  controller.getpeeldata
);
LDCR002Route.route("/gettrialdata").post(
  authenticationMiddleware.bearer,
  controller.gettrialdata
);

LDCR002Route.route("/getapplicationdata").post(
  authenticationMiddleware.bearer,
  controller.getapplicationdata
);
LDCR002Route.route("/getthickness").post(
  authenticationMiddleware.bearer,
  controller.getthickness
);
LDCR002Route.route("/getfinalinspection").post(
  authenticationMiddleware.bearer,
  controller.getfinalinspection
);

LDCR002Route.route("/getautomaticweld").post(
  authenticationMiddleware.bearer,
  controller.getautomaticweld
);
LDCR002Route.route("/getautomaticweldbody").post(
  authenticationMiddleware.bearer,
  controller.getautomaticweldbody
);

LDCR002Route.route("/getchemdata").post(
  authenticationMiddleware.bearer,
  controller.getchemdata
);
LDCR002Route.route("/getVdidata").post(
  authenticationMiddleware.bearer,
  controller.getVdidata
);

LDCR002Route.route("/gethardnessdata").post(
  authenticationMiddleware.bearer,
  controller.gethardnessdata
);

LDCR002Route.route("/getFRBTdata").post(
  authenticationMiddleware.bearer,
  controller.getFRBTdata
);

LDCR002Route.route("/getVdirdata").post(
  authenticationMiddleware.bearer,
  controller.getVdirdata
);
LDCR002Route.route("/getVdirSdata").post(
  authenticationMiddleware.bearer,
  controller.getVdirSdata
);

LDCR002Route.route("/getDROPdata").post(
  authenticationMiddleware.bearer,
  controller.getDROPdata
);
LDCR002Route.route("/getmechanicaldata").post(
  authenticationMiddleware.bearer,
  controller.getmechanicaldata
);
LDCR002Route.route("/getMGERdata").post(
  authenticationMiddleware.bearer,
  controller.getMGERdata
);

LDCR002Route.route("/getMGNdata").post(
  authenticationMiddleware.bearer,
  controller.getMGNdata
);
LDCR002Route.route("/getHYSdata").post(
  authenticationMiddleware.bearer,
  controller.getHYSdata
);

LDCR002Route.route("/getInventoryData").post(
  authenticationMiddleware.bearer,
  controller.getInventoryData
);
LDCR002Route.route("/GetreportTyp").post(
  authenticationMiddleware.bearer,
  controller.GetreportTyp
);
LDCR002Route.route("/odiafrm").post(
  authenticationMiddleware.bearer,
  controller.getOdiaFrm
);
LDCR002Route.route("/odiato").post(
  authenticationMiddleware.bearer,
  controller.getOdiaTo
);
LDCR002Route.route("/mergedinv").post(
  authenticationMiddleware.bearer,
  controller.getMergedInv
);
LDCR002Route.route("/getReversedBatchInfo").post(
  authenticationMiddleware.bearer,
  controller.getReversedBatchInfo
);

LDCR002Route.route("/getInletData").post(
  authenticationMiddleware.bearer,
  controller.getInletData
);
LDCR002Route.route("/getBlastingData").post(
  authenticationMiddleware.bearer,
  controller.getBlastingData
);
export default LDCR002Route;
