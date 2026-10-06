import * as sqlQueries from "../repository/LDSM017Query";

export const getGroupPlant = (userId: any) => {
  return sqlQueries.getGroupPlant(userId);
};
export const getRolePlant = (userId: any) => {
  return sqlQueries.getRolePlant(userId);
};
export const getAllPlant = (userId: any) => {
  return sqlQueries.getAllPlant(userId);
};
export const CallProcC1CEB002 = (date: any) => {
  return sqlQueries.CallProcC1CEB002(date);
};
export const getMANDT = (plantCd: any) => {
  return sqlQueries.getMANDT(plantCd);
};
export const getBatchTrigger = (batch: any) => {
  return sqlQueries.getBatchTrigger(batch);
};
export const getBU = (plantCd: any) => {
  return sqlQueries.getBU(plantCd);
};
export const getCompanyCode = (plantCd: any) => {
  return sqlQueries.getCompanyCode(plantCd);
};
export const getSCOCount = (mandt: any, plantCd: any, scoNo: any) => {
  return sqlQueries.getSCOCount(mandt, plantCd, scoNo);
};
export const updateSCOStatus = (mandt: any, plantCd: any, scoNo: any) => {
  return sqlQueries.updateSCOStatus(mandt, plantCd, scoNo);
};
export const CallProcC1CEB010 = (scoNo: any) => {
  return sqlQueries.CallProcC1CEB010(scoNo);
};
export const getSCOINSCount = (businessUnit: any) => {
  return sqlQueries.getSCOINSCount(businessUnit);
};
export const insertSCODetails = (mandt: any, plantCd: any, scoNo: any) => {
  return sqlQueries.insertSCODetails(mandt, plantCd, scoNo);
};
export const getBaraTubesCount = (plantCd: any) => {
  return sqlQueries.getBaraTubesCount(plantCd);
};
export const getLogLoadCount = (orderNo: any) => {
  return sqlQueries.getLogLoadCount(orderNo);
};
export const CallProcC1CEB011B = (plantCd: any, date: any, orderNo: any) => {
  return sqlQueries.CallProcC1CEB011B(plantCd, date, orderNo);
};
export const CallProcC1CEB011 = (plantCd: any, date: any, orderNo: any) => {
  return sqlQueries.CallProcC1CEB011(plantCd, date, orderNo);
};
export const getCPLCount = (plantCd: any) => {
  return sqlQueries.getCPLCount(plantCd);
};
export const insertCustOrderDetails = async (
  plantCd: any,
  orderNo: any,
  companyCd: any
) => {
  return sqlQueries.insertCustOrderDetails(plantCd, orderNo, companyCd);
};
export const CallProcC1CEB004 = (date: any) => {
  return sqlQueries.CallProcC1CEB004(date);
};
export const CallProcC1CEB008 = (data: any) => {
  return sqlQueries.CallProcC1CEB008(data);
};
export const getProductionWB = (batchId: any) => {
  return sqlQueries.getProductionWB(batchId);
};
export const getCountFGPost = (batchId: any, plant: any, material: any) => {
  return sqlQueries.getCountFGPost(batchId, plant, material);
};
export const getCountFGPost1 = (batchId: any, plant: any, material: any) => {
  return sqlQueries.getCountFGPost1(batchId, plant, material);
};
export const CallProcC1CEB022 = (batchId: any, sendSAP: any) => {
  return sqlQueries.CallProcC1CEB022(batchId, sendSAP);
};
export const getProductionWO = (batchId: any) => {
  return sqlQueries.getProductionWO(batchId);
};
export const getOrderQuantity = (plant: any, custOrder: any, custItem: any) => {
  return sqlQueries.getOrderQuantity(plant, custOrder, custItem);
};
export const getDespQuantity = (plant: any, custOrder: any, custItem: any) => {
  return sqlQueries.getDespQuantity(plant, custOrder, custItem);
};
export const getSCOMaterial = (plant: any, sco: any, scoItem: any) => {
  return sqlQueries.getSCOMaterial(plant, sco, scoItem);
};
export const getCoilMaterial = (plant: any, coilId: any) => {
  return sqlQueries.getCoilMaterial(plant, coilId);
};
export const getTotalSCOQuantity = (
  plant: any,
  sco: any,
  scoItem: any,
  batchId: any
) => {
  return sqlQueries.getTotalSCOQuantity(plant, sco, scoItem, batchId);
};
export const updateProductionUpload = (plant: any, batchId: any) => {
  return sqlQueries.updateProductionUpload(plant, batchId);
};
export const CallProcC1CEB086B = (coilNo: any) => {
  return sqlQueries.CallProcC1CEB086B(coilNo);
};
export const CallProcC1CEB178 = (
  plant: any,
  rmMaterial: any,
  motherBatch: any
) => {
  return sqlQueries.CallProcC1CEB178(plant, rmMaterial, motherBatch);
};
