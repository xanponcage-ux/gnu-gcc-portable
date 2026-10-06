import { Router } from "express";
import * as controller from "../controllers/LDSC011Controller";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";

const LDSC011Route = Router();
LDSC011Route.route("/getOrderData").post(authenticationMiddleware.bearer,
  controller.getOrderData
);
LDSC011Route.route("/updateOrderData").post(authenticationMiddleware.bearer,
    controller.updateOrderData
  );
LDSC011Route.route("/InsertOrderData").post(authenticationMiddleware.bearer,
    controller.InsertOrderData
  );

  LDSC011Route.route("/DeleteOrderData").post(authenticationMiddleware.bearer,
    controller.DeleteOrderData
  );

LDSC011Route.route("/getCdValue").post(authenticationMiddleware.bearer,
    controller.getCdValue
  );

LDSC011Route.route("/getPathVal").post(authenticationMiddleware.bearer,
    controller.getPathVal
  );

export default LDSC011Route;