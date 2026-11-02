import * as sqlQueries from "../repository/TSMCSSF001Query";
import Error from "./errors";

function getdivisonList(plantcd: any, compCode: any) {
  return sqlQueries.getdivisonList(plantcd, compCode);
}
function getDepartmentList(plantcd: any, Division: any, compCode: any) {
  return sqlQueries.getDepartmentList(plantcd, Division, compCode);
}
function getSectionList(
  plantcd: any,
  Department: any,
  compCode: any,
  dvson: any
) {
  return sqlQueries.getSectionList(plantcd, Department, compCode, dvson);
}
function getSHEMasterList(
  plantcd: any,
  compCode: any,
  dvson: any,
  Department: any,
  Section: any
) {
  return sqlQueries.getSHEMasterList(
    plantcd,
    compCode,
    dvson,
    Department,
    Section
  );
}
function getSHEMatrixDeatilsDataListByRiskID(
  plantcd: any,
  compCode: any,
  RiskID: any
) {
  return sqlQueries.getSHEMatrixDeatilsDataListByRiskID(
    plantcd,
    compCode,
    RiskID
  );
}
function getRiskDataList(plantcd: any, compCode: any, division: any) {
  return sqlQueries.getRiskDataList(plantcd, compCode, division);
}
function GETSHEMatrixDetailsBYRiskID(
  plantcd: any,
  compCode: any,
  division: any,
  depart: any,
  sect: any,
  RiskID: any,
  PeopleAsset: any,
  Consequences: any,
  ProbablityOccurance: any,
  Risk: any,
  ResidualProbability: any,
  ResidualConsequence: any,
  ResidualRisk: any,
  ROwner: any
) {
  return sqlQueries.GETSHEMatrixDetailsBYRiskID(
    plantcd,
    compCode,
    division,
    depart,
    sect,
    RiskID,
    PeopleAsset,
    Consequences,
    ProbablityOccurance,
    Risk,
    ResidualProbability,
    ResidualConsequence,
    ResidualRisk,
    ROwner
  );
}
function ownersList(plantcd: any, compCode: any) {
  return sqlQueries.ownersList(plantcd, compCode);
}
function getAuthUserForSHEMatrix(
  plantcd: any,
  compCode: any,
  userId: any,
  RiskID: any
) {
  return sqlQueries.getAuthUserForSHEMatrix(plantcd, compCode, userId, RiskID);
}
function Checkinsertedversionofriskid(
  T_RISKID: any,
  plantCode: any,
  compCode: any
) {
  return sqlQueries.Checkinsertedversionofriskid(T_RISKID, plantCode, compCode);
}
function checkcolumnvaluechanges(
  T_RISKID: any,
  T_VERSION: any,
  colvalue: any,
  colname: any
) {
  return sqlQueries.checkcolumnvaluechanges(
    T_RISKID,
    T_VERSION,
    colvalue,
    colname
  );
}
function updatenewshematrixdetailsdata(
  T_RISKID: any,
  T_HAZARDOUS_EVENT: any,
  T_CAUSE: any,
  T_CONSEQUNCE_IMPACT: any,
  T_PEOPLE_ASSET: any,
  T_EXISTING_SAFEGUARD: any,
  T_CONSEQUENCES: any,
  T_PROBABILITY_OCCURANCE: any,
  T_RISK: any,
  T_RECOMMENDATION_REDUCING: any,
  T_RESIDUAL_PROBABILITY: any,
  T_RESIDUAL_CONSEQUENCES: any,
  T_RESIDUAL_RISK: any,
  T_RISK_OWNER: any,
  T_RISK_COMMUNICATION: any,
  T_CREATEDBY: any,
  plantCode: any,
  compCode: any,
  REVIEWER_ONE: any,
  T_REVIEWER_ONE_COMMENT: any,
  REVIEWER_TWO: any,
  T_REVIEWER_TWO_COMMENT: any
) {
  return sqlQueries.updatenewshematrixdetailsdata(
    T_RISKID,
    T_HAZARDOUS_EVENT,
    T_CAUSE,
    T_CONSEQUNCE_IMPACT,
    T_PEOPLE_ASSET,
    T_EXISTING_SAFEGUARD,
    T_CONSEQUENCES,
    T_PROBABILITY_OCCURANCE,
    T_RISK,
    T_RECOMMENDATION_REDUCING,
    T_RESIDUAL_PROBABILITY,
    T_RESIDUAL_CONSEQUENCES,
    T_RESIDUAL_RISK,
    T_RISK_OWNER,
    T_RISK_COMMUNICATION,
    T_CREATEDBY,
    plantCode,
    compCode,
    REVIEWER_ONE,
    T_REVIEWER_ONE_COMMENT,
    REVIEWER_TWO,
    T_REVIEWER_TWO_COMMENT
  );
}
function updateshematrixdetailsdata(
  T_RISKID: any,
  T_HAZARDOUS_EVENT: any,
  T_CAUSE: any,
  T_CONSEQUNCE_IMPACT: any,
  T_PEOPLE_ASSET: any,
  T_EXISTING_SAFEGUARD: any,
  T_CONSEQUENCES: any,
  T_PROBABILITY_OCCURANCE: any,
  T_RISK: any,
  T_RECOMMENDATION_REDUCING: any,
  T_RESIDUAL_PROBABILITY: any,
  T_RESIDUAL_CONSEQUENCES: any,
  T_RESIDUAL_RISK: any,
  T_RISK_OWNER: any,
  T_RISK_COMMUNICATION: any,
  T_CREATEDBY: any,
  T_CHANGE_COLUMN: any,
  plantCode: any,
  compCode: any,
  REVIEWER_ONE: any,
  T_REVIEWER_ONE_COMMENT: any,
  REVIEWER_TWO: any,
  T_REVIEWER_TWO_COMMENT: any
) {
  return sqlQueries.updateshematrixdetailsdata(
    T_RISKID,
    T_HAZARDOUS_EVENT,
    T_CAUSE,
    T_CONSEQUNCE_IMPACT,
    T_PEOPLE_ASSET,
    T_EXISTING_SAFEGUARD,
    T_CONSEQUENCES,
    T_PROBABILITY_OCCURANCE,
    T_RISK,
    T_RECOMMENDATION_REDUCING,
    T_RESIDUAL_PROBABILITY,
    T_RESIDUAL_CONSEQUENCES,
    T_RESIDUAL_RISK,
    T_RISK_OWNER,
    T_RISK_COMMUNICATION,
    T_CREATEDBY,
    T_CHANGE_COLUMN,
    plantCode,
    compCode,
    REVIEWER_ONE,
    T_REVIEWER_ONE_COMMENT,
    REVIEWER_TWO,
    T_REVIEWER_TWO_COMMENT
  );
}

function getSHEMatrixChartData(
  division: any,
  department: any,
  section: any,
  CONSEQ: any,
  Prob_Occur: any,
  plantcd: any,
  compCode: any,
  riskOwner: any
) {
  return sqlQueries.getSHEMatrixChartData(
    division,
    department,
    section,
    CONSEQ,
    Prob_Occur,
    plantcd,
    compCode,
    riskOwner
  );
}
function getSHEMatrixresidualChartData(
  division: any,
  department: any,
  section: any,
  CONSEQ: any,
  Prob_Occur: any,
  plantcd: any,
  compCode: any,
  riskOwner: any
) {
  return sqlQueries.getSHEMatrixresidualChartData(
    division,
    department,
    section,
    CONSEQ,
    Prob_Occur,
    plantcd,
    compCode,
    riskOwner
  );
}

function GETPENDINGSHEMatrixDetails(
  plantcd: any,
  compCode: any,
  Approver: any,
  Sec: any,
  Acttype: any
) {
  return sqlQueries.GETPENDINGSHEMatrixDetails(
    plantcd,
    compCode,
    Approver,
    Sec,
    Acttype
  );
}
function GETPENDINGResidualSHEMatrixDetails(
  plantcd: any,
  compCode: any,
  Approver: any
) {
  return sqlQueries.GETPENDINGResidualSHEMatrixDetails(
    plantcd,
    compCode,
    Approver
  );
}
function getALLSHEMatrixDetails(plantcd: any, compCode: any) {
  return sqlQueries.getALLSHEMatrixDetails(plantcd, compCode);
}

function getSHEMatrixDeatilsDataListByProbandconseq(
  plantcd: any,
  compCode: any,
  cseq: any,
  probocc: any,
  division: any,
  department: any,
  section: any,
  rowner: any
) {
  return sqlQueries.getSHEMatrixDeatilsDataListByProbandconseq(
    plantcd,
    compCode,
    cseq,
    probocc,
    division,
    department,
    section,
    rowner
  );
}

function updateapprovalshematrixdetailsdata(
  T_RISKID: any,
  T_RISK_APPRV_COMMENT: any,
  T_RISK_APPRV_STATUS: any,
  T_CREATEDBY: any,
  plantCode: any,
  compCode: any
) {
  return sqlQueries.updateapprovalshematrixdetailsdata(
    T_RISKID,
    T_RISK_APPRV_COMMENT,
    T_RISK_APPRV_STATUS,
    T_CREATEDBY,
    plantCode,
    compCode
  );
}

function updateDCIapprovalshematrixdetailsdata(
  T_RISKID: any,
  T_RISK_APPRV_COMMENT: any,
  T_RISK_APPRV_STATUS: any,
  T_CREATEDBY: any,
  plantCode: any,
  compCode: any,
  T_RESIDUAL_PROBABILITY: any,
  T_RESIDUAL_CONSEQUENCES: any,
  T_RESIDUAL_RISK: any
) {
  return sqlQueries.updateDCIapprovalshematrixdetailsdata(
    T_RISKID,
    T_RISK_APPRV_COMMENT,
    T_RISK_APPRV_STATUS,
    T_CREATEDBY,
    plantCode,
    compCode,
    T_RESIDUAL_PROBABILITY,
    T_RESIDUAL_CONSEQUENCES,
    T_RESIDUAL_RISK
  );
}

function getPrevRiskID(
  Division: any,
  Department: any,
  Section: any,
  Line: any,
  Job: any,
  Activity: any,
  Hazard: any,
  plantcd: any,
  Company: any
) {
  return sqlQueries.getPrevRiskID(
    Division,
    Department,
    Section,
    Line,
    Job,
    Activity,
    Hazard,
    plantcd,
    Company
  );
}
function getmaxRiskID(
  Division: any,
  Department: any,
  Section: any,
  plantcd: any,
  Company: any
) {
  return sqlQueries.getmaxRiskID(
    Division,
    Department,
    Section,
    plantcd,
    Company
  );
}
function UserDetailsByPersonalNumber(RISKOWNER: any) {
  return sqlQueries.UserDetailsByPersonalNumber(RISKOWNER);
}
function insertSHEMatrixData(
  Division: any,
  Department: any,
  Section: any,
  Line: any,
  Job: any,
  Activity: any,
  Hazard: any,
  plantcd: any,
  Company: any,
  CreatedBy: any,
  RiskID: any
) {
  return sqlQueries.insertSHEMatrixData(
    Division,
    Department,
    Section,
    Line,
    Job,
    Activity,
    Hazard,
    plantcd,
    Company,
    CreatedBy,
    RiskID
  );
}
function insertshematrixdetailsdata(
  T_RISKID: any,
  T_HAZARDOUS_EVENT: any,
  T_CAUSE: any,
  T_CONSEQUNCE_IMPACT: any,
  T_PEOPLE_ASSET: any,
  T_EXISTING_SAFEGUARD: any,
  T_CONSEQUENCES: any,
  T_PROBABILITY_OCCURANCE: any,
  T_RISK: any,
  T_RECOMMENDATION_REDUCING: any,
  T_RESIDUAL_PROBABILITY: any,
  T_RESIDUAL_CONSEQUENCES: any,
  T_RESIDUAL_RISK: any,
  T_RISK_OWNER: any,
  T_RISK_COMMUNICATION: any,
  T_CREATEDBY: any,
  plantCode: any,
  compCode: any,
  REVIEWER_ONE: any,

  REVIEWER_TWO: any
) {
  return sqlQueries.insertshematrixdetailsdata(
    T_RISKID,
    T_HAZARDOUS_EVENT,
    T_CAUSE,
    T_CONSEQUNCE_IMPACT,
    T_PEOPLE_ASSET,
    T_EXISTING_SAFEGUARD,
    T_CONSEQUENCES,
    T_PROBABILITY_OCCURANCE,
    T_RISK,
    T_RECOMMENDATION_REDUCING,
    T_RESIDUAL_PROBABILITY,
    T_RESIDUAL_CONSEQUENCES,
    T_RESIDUAL_RISK,
    T_RISK_OWNER,
    T_RISK_COMMUNICATION,
    T_CREATEDBY,
    plantCode,
    compCode,
    REVIEWER_ONE,
    REVIEWER_TWO
  );
}

function UpdateSHEMatrixRejectedData(
  T_RISKID: any,
  T_HAZARDOUS_EVENT: any,
  T_CAUSE: any,
  T_CONSEQUNCE_IMPACT: any,
  T_PEOPLE_ASSET: any,
  T_EXISTING_SAFEGUARD: any,
  T_CONSEQUENCES: any,
  T_PROBABILITY_OCCURANCE: any,
  T_RISK: any,
  T_RECOMMENDATION_REDUCING: any,
  T_RESIDUAL_PROBABILITY: any,
  T_RESIDUAL_CONSEQUENCES: any,
  T_RESIDUAL_RISK: any,
  T_RISK_OWNER: any,
  T_RISK_COMMUNICATION: any,
  T_CREATEDBY: any,
  plantCode: any,
  compCode: any,
  REVIEWER_ONE: any,
  REVIEWER_TWO: any
) {
  return sqlQueries.UpdateSHEMatrixRejectedData(
    T_RISKID,
    T_HAZARDOUS_EVENT,
    T_CAUSE,
    T_CONSEQUNCE_IMPACT,
    T_PEOPLE_ASSET,
    T_EXISTING_SAFEGUARD,
    T_CONSEQUENCES,
    T_PROBABILITY_OCCURANCE,
    T_RISK,
    T_RECOMMENDATION_REDUCING,
    T_RESIDUAL_PROBABILITY,
    T_RESIDUAL_CONSEQUENCES,
    T_RESIDUAL_RISK,
    T_RISK_OWNER,
    T_RISK_COMMUNICATION,
    T_CREATEDBY,
    plantCode,
    compCode,
    REVIEWER_ONE,
    REVIEWER_TWO
  );
}

function checkRiskApprover(
  Division: any,
  Department: any,
  Section: any,
  userId: any,
  plantcd: any,
  Company: any
) {
  return sqlQueries.checkRiskApprover(
    Division,
    Department,
    Section,
    userId,
    plantcd,
    Company
  );
}
function checkDCIRiskApprover(
  Division: any,
  Department: any,
  Section: any,
  userId: any,
  plantcd: any,
  Company: any
) {
  return sqlQueries.checkDCIRiskApprover(
    Division,
    Department,
    Section,
    userId,
    plantcd,
    Company
  );
}
function insertSHEMatrixRiskOwnerData(
  RiskID: any,
  plantcd: any,
  Company: any,
  RISKOWNER: any,
  EmployeeEmail: any,
  EmployeeName: any,
  CreatedBy: any
) {
  return sqlQueries.insertSHEMatrixRiskOwnerData(
    RiskID,
    plantcd,
    Company,
    RISKOWNER,
    EmployeeEmail,
    EmployeeName,
    CreatedBy
  );
}
function UpdateRejectedSHEMatrixRiskOwnerData(
  RiskID: any,
  plantcd: any,
  Company: any,
  RISKOWNER: any,
  EmployeeEmail: any,
  EmployeeName: any,
  CreatedBy: any
) {
  return sqlQueries.UpdateRejectedSHEMatrixRiskOwnerData(
    RiskID,
    plantcd,
    Company,
    RISKOWNER,
    EmployeeEmail,
    EmployeeName,
    CreatedBy
  );
}
function updatesheriskstatus(RiskID: any, CreatedBy: any) {
  return sqlQueries.updatesheriskstatus(RiskID, CreatedBy);
}
function updatefileforSheMatrix(RiskID: any, fileName: any) {
  return sqlQueries.updatefileforSheMatrix(RiskID, fileName);
}
function getDefaultRiskOwner(division: any, department: any, section: any) {
  return sqlQueries.getDefaultRiskOwner(division, department, section);
}
function insertResidualChnagesForApproval(
  T_RISKID: any,
  T_RESIDUAL_PROBABILITY: any,
  T_RESIDUAL_CONSEQUENCES: any,
  T_RESIDUAL_RISK: any,
  plantCode: any,
  compCode: any,
  T_CREATEDBY: any
) {
  return sqlQueries.insertResidualChnagesForApproval(
    T_RISKID,
    T_RESIDUAL_PROBABILITY,
    T_RESIDUAL_CONSEQUENCES,
    T_RESIDUAL_RISK,
    plantCode,
    compCode,
    T_CREATEDBY
  );
}
function getApproverSectionList(plantcd: any, compCode: any, personalno: any) {
  return sqlQueries.getApproverSectionList(plantcd, compCode, personalno);
}
function getPlantList(pno: any) {
  return sqlQueries.getPlantList(pno);
}
export const Model = {
  getdivisonList,
  getPlantList,
  getDepartmentList,
  getSectionList,
  getSHEMasterList,
  UserDetailsByPersonalNumber,
  GETSHEMatrixDetailsBYRiskID,
  ownersList,
  updatenewshematrixdetailsdata,
  Checkinsertedversionofriskid,
  updateshematrixdetailsdata,
  getAuthUserForSHEMatrix,
  getSHEMatrixDeatilsDataListByRiskID,
  getRiskDataList,
  checkcolumnvaluechanges,
  getSHEMatrixChartData,
  getSHEMatrixresidualChartData,
  GETPENDINGSHEMatrixDetails,
  getALLSHEMatrixDetails,
  updateapprovalshematrixdetailsdata,
  getPrevRiskID,
  getmaxRiskID,
  insertSHEMatrixData,
  insertshematrixdetailsdata,
  checkRiskApprover,
  insertSHEMatrixRiskOwnerData,
  updatefileforSheMatrix,
  getDefaultRiskOwner,
  UpdateSHEMatrixRejectedData,
  UpdateRejectedSHEMatrixRiskOwnerData,
  updatesheriskstatus,
  insertResidualChnagesForApproval,
  GETPENDINGResidualSHEMatrixDetails,
  checkDCIRiskApprover,
  updateDCIapprovalshematrixdetailsdata,
  getApproverSectionList,
  getSHEMatrixDeatilsDataListByProbandconseq,
};
