import { Router } from "express";
import * as controller from "../controllers/LDCR003Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDCR003Route = Router();

LDCR003Route.route("/GetreportTyp").post(
  authenticationMiddleware.bearer,
  controller.GetreportTyp
);

LDCR003Route.route("/get24or48HrsCDtest").post(
  authenticationMiddleware.bearer,
  controller.get24or48HrsCDtest
);
LDCR003Route.route("/get28or30DaysCDTestReport").post(
  authenticationMiddleware.bearer,
  controller.get28or30DaysCDTestReport
);
LDCR003Route.route("/getCROSSSECTIONINTERFACEPOROSITY").post(
  authenticationMiddleware.bearer,
  controller.getCROSSSECTIONINTERFACEPOROSITY
);
LDCR003Route.route("/getdegreeofcure").post(
  authenticationMiddleware.bearer,
  controller.getdegreeofcure
);
LDCR003Route.route("/getelongationrep").post(
  authenticationMiddleware.bearer,
  controller.getelongationrep
);
LDCR003Route.route("/getFLEXIBILITYTEST3LPE").post(
  authenticationMiddleware.bearer,
  controller.getFLEXIBILITYTEST3LPE
);
LDCR003Route.route("/getFLEXIBILITYTESTREPORTFBE").post(
  authenticationMiddleware.bearer,
  controller.getFLEXIBILITYTESTREPORTFBE
);
LDCR003Route.route("/getHARDNESSTEST").post(
  authenticationMiddleware.bearer,
  controller.getHARDNESSTEST 
);
LDCR003Route.route("/getHOTWATERADHESIONTEST24HRS").post(
  authenticationMiddleware.bearer,
  controller.getHOTWATERADHESIONTEST24HRS 
);
LDCR003Route.route("/getproductstablilty").post(
  authenticationMiddleware.bearer,
  controller.getproductstablilty 
);

LDCR003Route.route("/getINDENTATIONTEST").post(
  authenticationMiddleware.bearer,
  controller.getINDENTATIONTEST 
);

LDCR003Route.route("/getHOTWATERIMMERSION48").post(
  authenticationMiddleware.bearer,
  controller.getHOTWATERIMMERSION48 
);

LDCR003Route.route("/gettensile").post(
  authenticationMiddleware.bearer,
  controller.gettensile 
);
export default LDCR003Route;
