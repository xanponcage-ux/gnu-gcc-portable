// import { LD50S001Modal } from "./LD50S001";
// const LD50S001Query = require("../repository/LD50S001Query");
import {
  LD50S001SaveLDS003,
  getRawMaterialData,
} from "../repository/LD50S001Query";

export default class LD50S001Model {
  LD50S001SaveLDS003(data: any) {
    return LD50S001SaveLDS003(data);
  }
  getRawMaterialData(
    batchId: any,
    tdc: any,
    widthFrm: any,
    widthTo: any,
    thkFrm: any,
    thkTo: any,
    Status: any,
    Plant: any,
  ) {
    return getRawMaterialData(
      batchId,
      tdc,
      widthFrm,
      widthTo,
      thkFrm,
      thkTo,
      Status,
      Plant
    );
  }
}

// export { LD50S001Modal };
