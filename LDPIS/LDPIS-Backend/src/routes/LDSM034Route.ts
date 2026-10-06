import { Router } from "express";
import * as controller from "../controllers/LDSM034Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const C1CES34WRoute = Router();

C1CES34WRoute.route("/getStatusList").post(
  authenticationMiddleware.bearer,
  controller.getStatusList
);

C1CES34WRoute.route("/getOrderList").post(
  authenticationMiddleware.bearer,
  controller.getOrderList
);
C1CES34WRoute.route("/getMBatchData").post(
  authenticationMiddleware.bearer,
  controller.getMBatchData
);
C1CES34WRoute.route("/getDisplayData").post(
  authenticationMiddleware.bearer,
  controller.getDisplayData
);
C1CES34WRoute.route("/getQualityResultData").post(
  authenticationMiddleware.bearer,
  controller.getQualityResultData
);
C1CES34WRoute.route("/insertQualityTestData").post(
  authenticationMiddleware.bearer,
  controller.insertQualityTestData
);

C1CES34WRoute.route("/changeQualityTestData").post(
  authenticationMiddleware.bearer,
  controller.changeQualityTestData
);

C1CES34WRoute.route("/defectrecording").post(
  authenticationMiddleware.bearer,
  controller.getDefectRecording
);
C1CES34WRoute.route("/savedefectrecording").post(
  authenticationMiddleware.bearer,
  controller.insertDefectRecording
);

C1CES34WRoute.route("/orderitem").post(
  authenticationMiddleware.bearer,
  controller.getItem
);

C1CES34WRoute.route("/getdatadeci").post(
  authenticationMiddleware.bearer,
  controller.getDataDeci
);

C1CES34WRoute.route("/saveqadecidata").post(
  authenticationMiddleware.bearer,
  controller.saveQADeci
);

C1CES34WRoute.route("/getqlty").post(
  authenticationMiddleware.bearer,
  controller.getQlty
);

C1CES34WRoute.route("/gettdc").post(
  authenticationMiddleware.bearer,
  controller.getTdc
);

C1CES34WRoute.route("/getaddlprocess").post(
  authenticationMiddleware.bearer,
  controller.getAddlProcess
);

C1CES34WRoute.route("/getmatno").post(
  authenticationMiddleware.bearer,
  controller.getMatNo
);

C1CES34WRoute.route("/getmatnoDiverted").post(
  authenticationMiddleware.bearer,
  controller.getmatnoDiverted
);

C1CES34WRoute.route("/saveud").post(
  authenticationMiddleware.bearer,
  controller.saveUD
);

C1CES34WRoute.route("/saveudReturn").post(
  authenticationMiddleware.bearer,
  controller.saveudReturn
);


C1CES34WRoute.route("/rejectud").post(
  authenticationMiddleware.bearer,
  controller.rejectUD
);

C1CES34WRoute.route("/getcastdetails").post(
  authenticationMiddleware.bearer,
  controller.getCastDetails
);

C1CES34WRoute.route("/getqrrflg").post(
  authenticationMiddleware.bearer,
  controller.getQRRFlg
);

C1CES34WRoute.route("/getcntrestag").post(
  authenticationMiddleware.bearer,
  controller.getCntResTag
);


C1CES34WRoute.route("/getprodtypetitle").post(
  authenticationMiddleware.bearer,
  controller.getProdTypeTitle
);

C1CES34WRoute.route("/getchangeresult").post(
  authenticationMiddleware.bearer,
  controller.getChangeResult
);

C1CES34WRoute.route("/getchangeResultdetails").post(
  authenticationMiddleware.bearer,
  controller.getChangeResultDetails
);

C1CES34WRoute.route("/gettestresbatch").post(
  authenticationMiddleware.bearer,
  controller.getTestResBatch
);

C1CES34WRoute.route("/gettestresmbatch").post(
  authenticationMiddleware.bearer,
  controller.getChangeResultMBatch
);
C1CES34WRoute.route("/getScrapWt").post(
  authenticationMiddleware.bearer,
  controller.GetScrapWt
);

C1CES34WRoute.route('/getPieceActl').post(authenticationMiddleware.bearer, controller.GetPieceActl);
C1CES34WRoute.route('/getpphProductName').post(authenticationMiddleware.bearer, controller.getProductName);





export default C1CES34WRoute;
