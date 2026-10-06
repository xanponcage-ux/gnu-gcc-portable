import { Request, Response } from "express";
import * as Model from "../models/LDSM017Model";

//get assigned plant list
export const getAssignedPlantList = async (req: Request, res: Response) => {
  try {

    var userId = req.body.userId;
    let results: any = [];

    //userId = "151631";

    //construct request
    const temp_results1: any = await Model.getGroupPlant(userId);

    if (temp_results1.rows.length > 0) {
      results = temp_results1;
    } else {
      //construct request
      const temp_results2: any = await Model.getRolePlant(userId);
      if (temp_results2.rows.length > 0) {
        results = temp_results2;
      } else {
        //construct request
        const temp_results3: any = await Model.getAllPlant(userId);
        results = temp_results3;
      }
    }

    //itnitalize variables
    const table: any = [];
    const header: any = [];

    //get headers
    for (let i = 0; i < results.metaData.length; i++) {
      header.push((results.metaData[i].name as string).replace(/ /g, ""));
    }
    //contruct table
    for (let i = 0; i < results.rows.length; i++) {
      const arr = results.rows[i];
      var jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }

    //return response
    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getBatchTrigger = async (req: Request, res: Response) => {
  try {
      var errorString = "";
      var error = false;
      var newData = req.body;
      console.log(newData,"whole array");
      for (var i = 0; i < newData.length; i++) {
          var batch = newData[i];
          console.log(batch);
          var results: any = await Model.getBatchTrigger(batch);
          console.log(results);
          var flag = results.rowsAffected;
          if (flag < 1) {
              error = true;
              errorString += " Error for record " + batch + "";
          }
      }

      if (!error) {
          errorString = "successfully recorded !"
      }
      return res.status(200).json({ errorString });
  } catch (error) {
      return res.status(400).json(error);
  }
};

//get download SCO details
export const getDownloadSCODetails = async (req: Request, res: Response) => {
  try {
    //get request
    var plantCd = req.body.plantCd;
    var date = req.body.date;
    var scoNo = req.body.scoNo;

    //itnitalize variables
    const fullData: any = [];
    var mandt, businessUnit;

    //if SCO is not entered
    if (scoNo == "") {
      //construct request
      const results: any = await Model.CallProcC1CEB002(date);
      fullData.push("SCO Order Downloaded Successfully!");
    } else {
      const results: any = await Model.getMANDT(plantCd);
      if (results.rows.length > 0) {
        mandt = results.rows[0][0];
      } else {
        mandt = "600";
      }

      const results1: any = await Model.getSCOCount(mandt, plantCd, scoNo);
      if (results1.rows[0][0] > 0) {
        const results: any = await Model.updateSCOStatus(mandt, plantCd, scoNo);
        const results1: any = await Model.CallProcC1CEB010(scoNo);
        fullData.push("SCO request captured. check after few minutes!");
      } else {
        //get business unit
        const results: any = await Model.getBU(plantCd);
        if (results.rows.length > 0) {
          businessUnit = results.rows[0][0];
        } else {
          businessUnit = "";
        }
        //get insert count
        const results1: any = await Model.getSCOINSCount(businessUnit);
        if (results1.rows[0][0] > 0) {
          const results: any = await Model.insertSCODetails(
            mandt,
            plantCd,
            scoNo
          );
          const results1: any = await Model.CallProcC1CEB010(scoNo);
          fullData.push("SCO request captured. check after few minutes!");
        } else {
          fullData.push("SCO not generated in SPCIS. Please check!");
        }
      }
    }

    //return response
    return res.status(200).json(fullData);
  } catch (error) {
    return res.status(400).json(error);
  }
};
//get download Customer order
export const getDownloadCustomerOrder = async (req: Request, res: Response) => {
  try {
    //get request
    var plantCd = req.body.plantCd;
    var date = req.body.date;
    var orderNo = req.body.orderNo;

    //itnitalize variables
    const fullData: any = [];
    var countBaraTubes, businessUnit, countLogLoad, companyCd;

    const results: any = await Model.CallProcC1CEB011(
      plantCd,
      date,
      orderNo
    );

    const compResults: any = await Model.getCompanyCode(plantCd);
    if (compResults.rows.length > 0) {
      companyCd = compResults.rows[0][0];
    } else {
      companyCd = "1000";
    }
    const results1: any = await Model.insertCustOrderDetails(
      plantCd,
      orderNo,
      companyCd
    );

    //get count
    // const results: any = await Model.getBaraTubesCount(plantCd);
    // if (results.rows[0][0] > 0) {
    //   countBaraTubes = results.rows[0][0];
    // } else {
    //   countBaraTubes = 0;
    // }

    // //get buesines unit
    // const results1: any = await Model.getBU(plantCd);
    // if (results1.rows.length > 0) {
    //   businessUnit = results1.rows[0][0];
    // } else {
    //   businessUnit = 0;
    // }

    // if (countBaraTubes == 0 && orderNo !== "" && businessUnit !== "TUBES") {
    //   //get count
    //   const results: any = await Model.getLogLoadCount(orderNo);
    //   if (results.rows[0][0] > 0) {
    //     countLogLoad = results.rows[0][0];
    //     fullData.push(
    //       "Few items are not Log load released,Only released items Downloaded !"
    //     );
    //   } else {
    //     countLogLoad = 0;
    //     fullData.push(
    //       "Customer Order Download request captured. Please check after few minutes !"
    //     );
    //   }

    //   const results1: any = await Model.getCPLCount(plantCd);
    //   if (results1.rows[0][0] > 0) {
    //     const results: any = await Model.CallProcC1CEB011B(
    //       plantCd,
    //       date,
    //       orderNo
    //     );
    //   } else {
    //     const results: any = await Model.CallProcC1CEB011(
    //       plantCd,
    //       date,
    //       orderNo
    //     );
    //   }

    //   if (countLogLoad === 0) {
    //     const results: any = await Model.getCompanyCode(plantCd);
    //     if (results.rows.length > 0) {
    //       companyCd = results.rows[0][0];
    //     } else {
    //       companyCd = "1000";
    //     }

    //     const results1: any = await Model.insertCustOrderDetails(
    //       plantCd,
    //       orderNo,
    //       companyCd
    //     );
    //   }
    // } else if (countBaraTubes > 0) {
    //   fullData.push(
    //     "Customer Order Download request captured. Please check after few minutes !"
    //   );
    //   const results1: any = await Model.getCPLCount(plantCd);
    //   if (results1.rows[0][0] > 0) {
    //     const results: any = await Model.CallProcC1CEB011B(
    //       plantCd,
    //       date,
    //       orderNo
    //     );
    //   } else {
    //     const results: any = await Model.CallProcC1CEB011(
    //       plantCd,
    //       date,
    //       orderNo
    //     );
    //   }
    //   if (countLogLoad === 0) {
    //     const results: any = await Model.getCompanyCode(plantCd);
    //     if (results.rows.length > 0) {
    //       companyCd = results.rows[0][0];
    //     } else {
    //       companyCd = "1000";
    //     }

    //     const results1: any = await Model.insertCustOrderDetails(
    //       plantCd,
    //       orderNo,
    //       companyCd
    //     );
    //   }
    // }

    //return response
    return res.status(200).json(fullData);
  } catch (error) {
    return res.status(400).json(error);
  }
};
//get download RM details
export const getDownloadRMDetails = async (req: Request, res: Response) => {
  try {
    //get request
    var motherBatch = req.body.motherBatch;
    var date = req.body.date;
    var invoiceNo = req.body.invoiceNo;
    var plantCd = req.body.plantCd;

    //itnitalize variables
    const fullData: any = [];
    var businessUnit, data;

    //get buesines unit
    const results1: any = await Model.getBU(plantCd);
    if (results1.rows.length > 0) {
      businessUnit = results1.rows[0][0];
    } else {
      businessUnit = 0;
    }

    if (date !== "" && motherBatch == "" && invoiceNo == "") {
      //get count
      const results: any = await Model.CallProcC1CEB004(date);
      fullData.push("Coil Downloaded Successfully!");
    } else if (motherBatch !== "" || invoiceNo !== "") {
      if (motherBatch !== "" && invoiceNo == "") {
        data = motherBatch + "xxxxxxxxxxxxxxxxxxxxx";
        const results: any = await Model.CallProcC1CEB008(data);
        fullData.push("Coil Downloaded Successfully!");
      } else if (motherBatch == "" && invoiceNo !== "") {
        data = "xxxxxxxxxxxxxxxxxxxxx" + invoiceNo;
        const results: any = await Model.CallProcC1CEB008(data);
        fullData.push("Coil Downloaded Successfully!");
      }
    }

    //return response
    return res.status(200).json(fullData);
  } catch (error) {
    return res.status(400).json(error);
  }
};
//get download RM details
export const getUpdateWBStock = async (req: Request, res: Response) => {
  try {
    //get request
    var batchId = req.body.batchId;

    //itnitalize variables
    const fullData: any = [];
    var status, sendSAP, plant, material, countFG, countFG1, msg;
    //get prod WB
    const results: any = await Model.getProductionWB(batchId);
    if (results.rows.length > 0) {
      status = results.rows[0][0];
      sendSAP = results.rows[0][1];
      plant = results.rows[0][2];
      material = results.rows[0][3];

      const results1: any = await Model.getCountFGPost(
        batchId,
        plant,
        material
      );
      if (results1.rows[0][0] > 0) {
        countFG = results1.rows[0][0];
        msg = "Batch has already been uploaded into SAP!";
      } else {
        countFG = 0;

        const results: any = await Model.getCountFGPost1(
          batchId,
          plant,
          material
        );

        if (results.rows[0][0] > 0) {
          countFG1 = results.rows[0][0];
          msg = "Batch has already been uploaded!";
        }
      }
    } else {
      msg = "Failed to fetch Prodn!";
    }

    if (
      (status === "WB" && sendSAP == "N") ||
      (status === "WB" && sendSAP == "Y" && countFG === 0 && countFG1 === 0)
    ) {
      const results: any = await Model.CallProcC1CEB022(batchId, sendSAP);
      msg = "Batch Uploded Successfully!";
    }

    fullData.push(msg);
    //return response
    return res.status(200).json(fullData);
  } catch (error) {
    return res.status(400).json(error);
  }
};
//get download RM details
export const getUpdateWOStock = async (req: Request, res: Response) => {
  try {
    //get request
    var batchId = req.body.batchId;

    //itnitalize variables
    const fullData: any = [];
    var ls_fl_send_sap,
      msg,
      plant,
      custOrder,
      custItem,
      orderQuantity,
      custMaterial,
      pieceAct,
      sumDespQuantity,
      sco,
      scoItem,
      scoMaterial,
      compMaterial,
      scoQuantity,
      coilId,
      coilMaterial,
      totalSCOQuantity;
    //get prod WO
    const results: any = await Model.getProductionWO(batchId);
    if (results.rows.length > 0) {
      ls_fl_send_sap = results.rows[0].LOM_FL_SEND_SAP;
      plant = results.rows[0].LOM_CD_EPA;
      custOrder = results.rows[0].LOM_ID_ORDER_CUS;
      custItem = results.rows[0].LOM_ID_ORD_ITEM_CUS;
      pieceAct = results.rows[0].LOM_MS_PIECE_ACTL;
      sco = results.rows[0].SCO_ORDER;
      scoItem = results.rows[0].SCO_ITM;
      coilId = results.rows[0].LOM_ID_FIRST_PAR;
      //get order qty
      const results1: any = await Model.getOrderQuantity(
        plant,
        custOrder,
        custItem
      );

      if (results1.rows.length > 0) {
        orderQuantity = results1.rows[0][0];
        custMaterial = results1.rows[0][1];
      } else {
        orderQuantity = 0;
        msg = "N-Failed to fetch Order Quantity";
        fullData.push(msg);
        return res.status(200).json(fullData);
      }

      //get despatch qty
      const results2: any = await Model.getDespQuantity(
        plant,
        custOrder,
        custItem
      );

      if (results2.rows.length > 0) {
        sumDespQuantity = results2.rows[0][0];
      } else {
        sumDespQuantity = 0;
        msg = "N-Failed to fetch sum of dispatched order Quantity";
        fullData.push(msg);
        return res.status(200).json(fullData);
      }

      if (orderQuantity * 1.1 < sumDespQuantity + pieceAct) {
        msg =
          "N-Quantity is not enough of order/Item " +
          custOrder +
          "/" +
          custItem;
        fullData.push(msg);
        return res.status(200).json(fullData);
      }

      if (sco === "" && scoItem === "") {
        msg = "N-Please Insert the SCO no. and Item For The Batch " + batchId;
        fullData.push(msg);
        return res.status(200).json(fullData);
      }

      //get sco material
      const results3: any = await Model.getSCOMaterial(plant, sco, scoItem);
      if (results3.rows.length > 0) {
        scoMaterial = results3.rows[0][0];
        compMaterial = results3.rows[0][1];
        scoQuantity = results3.rows[0][2];
      } else {
        msg = "N-Failed to fetch sco material of SCO " + sco;
        fullData.push(msg);
        return res.status(200).json(fullData);
      }

      //get coil material
      const results4: any = await Model.getCoilMaterial(plant, coilId);
      if (results4.rows.length > 0) {
        coilMaterial = results4.rows[0][0];
      } else {
        msg = "N-Failed to fetch coil material of Coil " + coilId;
        fullData.push(msg);
        return res.status(200).json(fullData);
      }

      //get total SCO qty
      const results5: any = await Model.getTotalSCOQuantity(
        plant,
        sco,
        scoItem,
        batchId
      );
      if (results5.rows.length > 0) {
        totalSCOQuantity = results5.rows[0][0];
      } else {
        msg = "N-Failed to fetch total sco quantity of sco " + sco;
        fullData.push(msg);
        return res.status(200).json(fullData);
      }

      if (scoMaterial == "" || compMaterial == "") {
        msg =
          "N-Batch ID : " +
          batchId +
          " not declared FG as FG Material No of SCO Order/Item is not available in SPCIS,Please download sco " +
          sco +
          " from screen C1CES017";
        fullData.push(msg);
        return res.status(200).json(fullData);
      }
      if (custMaterial !== scoMaterial) {
        msg =
          "N-Batch ID : " +
          batchId +
          " not declared FG as FG Material No of SCO Order/Item : " +
          scoMaterial +
          " and Material No of Cust Order/Item : " +
          custMaterial +
          " is Not matching ,Please Check";
        fullData.push(msg);
        return res.status(200).json(fullData);
      }
      if (coilMaterial !== compMaterial) {
        msg =
          "N-Batch ID : " +
          batchId +
          " not declared FG as Component Material No of SCO Order/Item : " +
          compMaterial +
          " and Material No of CR Coil : " +
          coilMaterial +
          " is Not matching ,Please Check";
        fullData.push(msg);
        return res.status(200).json(fullData);
      }
      if (pieceAct + totalSCOQuantity > scoQuantity) {
        msg =
          "N-For SCO : " +
          sco +
          ", Order qty is " +
          scoQuantity +
          " Exceeding Dispatch Qty " +
          (pieceAct + totalSCOQuantity) +
          " Please Check";
        fullData.push(msg);
        return res.status(200).json(fullData);
      }
      if (ls_fl_send_sap == "Y") {
        ls_fl_send_sap = "Z";
      }

      //update batch
      const results6: any = await Model.updateProductionUpload(plant, batchId);
      //execute procedure
      const results7: any = await Model.CallProcC1CEB022(
        batchId,
        ls_fl_send_sap
      );
      msg = "Y-WO Stock Uploaded . " + batchId;
    } else {
      msg = "N-The Status of the Batch " + batchId + " is not WO";
    }
    fullData.push(msg);
    //return response
    return res.status(200).json(fullData);
  } catch (error) {
    return res.status(400).json(error);
  }
};
//get download quality results details
export const getDownloadQualityResults = async (
  req: Request,
  res: Response
) => {
  try {
    //get request
    var coilNo = req.body.coilNo;

    //itnitalize variables
    const fullData: any = [];

    const results: any = await Model.CallProcC1CEB086B(coilNo);
    fullData.push("Test Result Downloaded Successfully!");

    //return response
    return res.status(200).json(fullData);
  } catch (error) {
    return res.status(400).json(error);
  }
};
//sync mother batch quanitty
export const getSyncMotherBatchQuantity = async (
  req: Request,
  res: Response
) => {
  try {
    //get request
    var plant = req.body.plant;
    var rmMaterial = req.body.rmMaterial;
    var motherBatch = req.body.motherBatch;

    //itnitalize variables
    const fullData: any = [];

    const results: any = await Model.CallProcC1CEB178(
      plant,
      rmMaterial,
      motherBatch
    );
    if (results.outBinds.LS_OUT_FLAG != "") {
      if (results.outBinds.LS_OUT_FLAG == "Y") {
        fullData.push("Y-Batch Updated Successfully!");
      } else {
        fullData.push(
          "N-Error in batch update-" + results.outBinds.LS_OUT_FLAG
        );
      }
    } else {
      fullData.push("N-Error in batch update!");
    }

    //return response
    return res.status(200).json(fullData);
  } catch (error) {
    return res.status(400).json(error);
  }
};
