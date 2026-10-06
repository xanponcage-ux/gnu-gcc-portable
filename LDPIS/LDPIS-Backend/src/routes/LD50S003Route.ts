import { Router } from "express";
import * as controller from "../controllers/LD50S003Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LD50S003Route = Router();

//used
LD50S003Route.route("/getGroupPlant").post(
  authenticationMiddleware.bearer,
  controller.getGroupPlant
);
//used
LD50S003Route.route("/getProcessList").post(
  authenticationMiddleware.bearer,
  controller.getProcessList
);
// LD50S003Route.route("/getScheduleData").post(
//   authenticationMiddleware.bearer,
//   controller.getScheduleData
// );
LD50S003Route.route("/getCoils").post(
  //u
  authenticationMiddleware.bearer,
  controller.getCoils
);
LD50S003Route.route("/compute").post(
  //u
  authenticationMiddleware.bearer,
  controller.compute
);
LD50S003Route.route("/confirm").post(
  //u
  authenticationMiddleware.bearer,
  controller.confirm
);
LD50S003Route.route("/getOrdFilter").post(
  //u
  authenticationMiddleware.bearer,
  controller.GetOrdFilter
);
LD50S003Route.route("/getPlanPath").post(
  //u
  authenticationMiddleware.bearer,
  controller.GetPlanPathWire
);

LD50S003Route.route("/getordtyp").post(
  //used
  authenticationMiddleware.bearer,
  controller.getOrdTyp
);
LD50S003Route.route("/getBatchDtl").post(
  //u
  authenticationMiddleware.bearer,
  controller.GetBatchDtl
);
LD50S003Route.route("/getPdiDtl").post(
  //u
  authenticationMiddleware.bearer,
  controller.GetPdiDtl
);
LD50S003Route.route("/insertSlitProd").post(
  //u
  authenticationMiddleware.bearer,
  controller.InsertSlitProd
);
LD50S003Route.route("/getMCoilList").post(
  //u
  authenticationMiddleware.bearer,
  controller.GetMCoilList
);
LD50S003Route.route("/getODIA").post(
  //u
  authenticationMiddleware.bearer,
  controller.GetODIA
);
LD50S003Route.route("/getShiftStatus").post(
  //u
  authenticationMiddleware.bearer,
  controller.getShiftStatus
);
LD50S003Route.route("/getProductionType").post(
  //u
  authenticationMiddleware.bearer,
  controller.getProductionType
);
LD50S003Route.route("/getBatchCount").post(
  //u
  authenticationMiddleware.bearer,
  controller.getBatchCount
);
// LD50S003Route.route("/getWorkCenterDropdown").post(
//   authenticationMiddleware.bearer,
//   controller.getWorkCenterList
// );
LD50S003Route.route("/getScrapProductionTable").post(
  //u
  authenticationMiddleware.bearer,
  controller.getScrapProductionTable
);
LD50S003Route.route("/getBatchDtlforLP").post(
  authenticationMiddleware.bearer,
  controller.GetBatchDtlforLP
);
LD50S003Route.route("/getRsnDetails").post(
  //u
  authenticationMiddleware.bearer,
  controller.getHoldRsnDetails
);
LD50S003Route.route("/getPdiDtlMultiLot").post(
  authenticationMiddleware.bearer,
  controller.GetPdiDtlMultiLot
);
// LD50S003Route.route("/getCRTScheduleMerge").post(
//   authenticationMiddleware.bearer,
//   controller.CRTScheduleMerge
// );
LD50S003Route.route("/getBatchId").post(
  //u
  authenticationMiddleware.bearer,
  controller.getBatchId
);
LD50S003Route.route("/getInqDetl").post(
  //u
  authenticationMiddleware.bearer,
  controller.GetInqDetl
);
LD50S003Route.route("/getScheduleDel").post(
  //u
  authenticationMiddleware.bearer,
  controller.ScheduleDel
);
// LD50S003Route.route("/getScheduleDelMerge").post(
//   authenticationMiddleware.bearer,
//   controller.ScheduleDelMerge
// );
LD50S003Route.route("/getWorkCenter").post(
  authenticationMiddleware.bearer,
  controller.getWorkCenter
);
LD50S003Route.route("/getMergeBatchDetails").post(
  authenticationMiddleware.bearer,
  controller.getMergeBatchDetails
);
LD50S003Route.route("/getStatusList").post(
  authenticationMiddleware.bearer,
  controller.getStatus
);
LD50S003Route.route("/getResqtyval").post(
  //u
  authenticationMiddleware.bearer,
  controller.getResqtyval
);
LD50S003Route.route("/getActivity").post(
  //u
  authenticationMiddleware.bearer,
  controller.getActivity
);
LD50S003Route.route("/getEquivTdc").post(
  authenticationMiddleware.bearer,
  controller.getEquivTdc
);

export default LD50S003Route;
