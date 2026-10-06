import * as sqlQueries from "../repository/LDSM008Query";
function delay(
  dateFrom: any,
  dateTo: any,
  processLine: any,
  selectShift: any,
  resouceCode: any,
  // plant:any,
  EqpCD: any,
  FaqCD: any,
  plantCode: any,
  compCode: any
) {
  return sqlQueries.delayDataQuery(
    dateFrom,
    dateTo,
    processLine,
    selectShift,
    resouceCode,
    // plant,
    EqpCD,
    FaqCD,
    plantCode,
    compCode
  );
}
function delayCheck(
  dateFrom: any,
  dateTo: any,
  processLine: any,
  selectShift: any,
  resouceCode: any,
  // plant:any,
  EqpCD: any,
  FaqCD: any,
  plantCode: any,
  compCode: any
) {
  return sqlQueries.delayCheck(
    dateFrom,
    dateTo,
    processLine,
    selectShift,
    resouceCode,
    // plant,
    EqpCD,
    FaqCD,
    plantCode,
    compCode
  );
}
function deletebrk(
  stDate: any,
  enDate: any,
  p_line: any,
  eqpMast: any,
  faqMast: any,
  plantCode: any,
  compCode: any
) {
  return sqlQueries.deleteBrkQuery(
    stDate,
    enDate,
    p_line,
    eqpMast,
    faqMast,
    plantCode,
    compCode
  );
}
function updRsn(
  remarks: any,
  reason: any,
  stDate: any,
  enDate: any,
  p_line: any,
  eqpMast: any,
  modify_user: any,
  plantCode: any,
  compCode: any,
  delayAgent: any,
  delayCode: any,
  outageDt: any,
  processCd: any,
  faqMast: any,
  resource: any,
  isDelete: any
) {
  return sqlQueries.updateRsnQuery(
    remarks,
    reason,
    stDate,
    enDate,
    p_line,
    eqpMast,
    modify_user,
    plantCode,
    compCode,
    delayAgent,
    delayCode,
    outageDt,
    processCd,
    faqMast,
    resource,
    isDelete
  );
}
function reason(plantCode: any, compCode: any) {
  return sqlQueries.getRsnQuery(plantCode, compCode);
}
function eqpMast(plantCode: any, processLine: any) {
  return sqlQueries.EqpMastQuery(plantCode, processLine);
}
function facCode(plantCode: any, compCode: any) {
  return sqlQueries.FacCodeQuery(plantCode, compCode);
}
function eqpFac(reason: any, Reason: any, plantCode: any, compCode: any) {
  return sqlQueries.eqpFacQuery(reason, Reason, plantCode, compCode);
}
function equipData(plantCode: any, compCode: any, p_line: any) {
  return sqlQueries.equipData(plantCode, compCode, p_line);
}
function addReasonData(plantCode: any, compCode: any) {
  return sqlQueries.addReasonData(plantCode, compCode);
}
function delayCode(compCode: any, agency: any, plantCode: any, process: any) {
  return sqlQueries.delayCode(compCode, agency, plantCode, process);
}
function delayAgent(plantCode: any, compCode: any) {
  return sqlQueries.delayAgent(plantCode, compCode);
}
function processLine(plantCode: any) {
  return sqlQueries.processLine(plantCode);
}
function plantList(ad: any) {
  return sqlQueries.plantList(ad);
}
function resourceData(plantCode: any, compCode: any, plmStatus: any, stageCd: any) {
  return sqlQueries.resourceData(plantCode, compCode, plmStatus, stageCd);
}
function displayDelayData(shift: any,
  plantCode: any,
  fromDate: any,
  toDate: any,
  processLine: any,
  resouceCode: any) {
  return sqlQueries.displayDelayData(
    shift,
    plantCode,
    fromDate,
    toDate,
    processLine,
    resouceCode
  );
}
function insertDelayData(
  shift: any,
  reason: any,
  remark: any,
  // coilNo: any,
  equipCode: any,
  createdUser: any,
  plantCode: any,
  compCode: any,
  fromDate: any,
  toDate: any,
  delayCode: any,
  delayAgent: any,
  processLine: any,
  resouceCode: any
) {
  return sqlQueries.insertDelayData(
    shift,
    reason,
    remark,
    // coilNo,
    equipCode,
    createdUser,
    plantCode,
    compCode,
    fromDate,
    toDate,
    delayCode,
    delayAgent,
    processLine,
    resouceCode
  );
}
function updbrk(
  endDate: any,
  reason: any,
  Reason: any,
  remarks: any,
  Remarks: any,
  EquipCD: any,
  OutageRsnDesc: any,
  p_line: any,
  startDate: any,
  Shift: any,
  PersonalNo: any,
  plantCode: any,
  compCode: any,
  delayAgent: any,
  delayCode: any,
  isDelete: any
) {
  return sqlQueries.updBrkQuery(
    endDate,
    reason,
    Reason,
    remarks,
    Remarks,
    EquipCD,
    OutageRsnDesc,
    p_line,
    startDate,
    Shift,
    PersonalNo,
    plantCode,
    compCode,
    delayAgent,
    delayCode,
    isDelete
  );
}
function insertbrk(
  endDate: any,
  reason: any,
  Reason: any,
  remarks: any,
  Remarks: any,
  coilNo: any,
  EquipCD: any,
  OutageRsnDesc: any,
  p_line: any,
  operator: any,
  outDt: any,
  startDate: any,
  Shift: any,
  plant: any,
  company: any,
  delayAgent: any,
  delayCode: any,
  resouceCode: any
) {
  return sqlQueries.insertBrkQuery(
    endDate,
    reason,
    Reason,
    remarks,
    Remarks,
    coilNo,
    EquipCD,
    OutageRsnDesc,
    p_line,
    operator,
    outDt,
    startDate,
    Shift,
    plant,
    company,
    delayAgent,
    delayCode,
    resouceCode
  );
}


export const TSMCDMF001 = {
  delay,
  reason,
  eqpMast,
  facCode,
  deletebrk,
  updRsn,
  eqpFac,
  updbrk,
  insertbrk,
  equipData,
  addReasonData,
  insertDelayData,
  delayCode,
  delayAgent,
  delayCheck,
  processLine,
  plantList,
  resourceData,
  displayDelayData
};
