import { json, Request, Response } from "express";
import soapHandeler from "../utils/soapHandeler";
import { Model } from "../models/TSMCSSF001Model";
import env from "../env";
const uploadFile = require("../utils/upload");
// get employee details by personal number
export const getEmployeeDetailsByPersonalNumber = async (
  req: Request,
  res: Response
) => {
  try {
    var personalno = req.body.personalno;
    // var verifySoapUserDetails = await soapHandeler.UserDetailsByPersonalNumber(
    //   personalno
    // );
    // get user name and email details
    var verifySoapUserDetails = { EmployeeName: "", EmployeeEmail: "" };
    const empDetails: any = await Model.UserDetailsByPersonalNumber(personalno);
    if (empDetails.outBinds.ls_results != "") {
      var employeedetails = empDetails.outBinds.ls_results.split("-");
      verifySoapUserDetails.EmployeeEmail = employeedetails[0];
      verifySoapUserDetails.EmployeeName = employeedetails[1];
    } else {
      verifySoapUserDetails.EmployeeName = personalno;
      verifySoapUserDetails.EmployeeName = personalno;
    }
    res.status(200).json({ verifySoapUserDetails });
  } catch (error) {
    return res.status(400).json(error);
  }
};
//get Division list
export const divisonList = async (req: Request, res: Response) => {
  try {
    var plantcd = req.body.plantCd;
    var compCode = req.body.companyCd;
    const results: any = await Model.getdivisonList(plantcd, compCode);
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const plantList = async (req: Request, res: Response) => {
  try {
    var pno = req.body.pno;
    const results: any = await Model.getPlantList(pno);
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};
// Get Department list data
export const getDepartmentList = async (req: Request, res: Response) => {
  try {
    var plantcd = req.body.plantCode;
    var compCode = req.body.compCode;
    var Division = req.body.Division;
    const results: any = await Model.getDepartmentList(
      plantcd,
      Division,
      compCode
    );
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};
// get risk list
export const getRiskDataList = async (req: Request, res: Response) => {
  try {
    var plantcd = req.body.plantCode;
    var compCode = req.body.compCode;
    var Division = req.body.Division;
    // var Department = req.body.Department;
    // var Section = req.body.Section;
    //const results: any = await Model.getRiskDataList(plantcd,compCode, Division,Department,Section);
    const results: any = await Model.getRiskDataList(
      plantcd,
      compCode,
      Division
    );
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};
// Get Section List data
export const getSectionList = async (req: Request, res: Response) => {
  try {
    var plantcd = req.body.plantCode;
    var compCode = req.body.compCode;
    var Department = req.body.Department;
    var dvson = req.body.Division;
    const results: any = await Model.getSectionList(
      plantcd,
      Department,
      compCode,
      dvson
    );
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};
// get she matrix details
export const getSHEMasterList = async (req: Request, res: Response) => {
  try {
    var plantcd = req.body.plantcd;
    var compCode = req.body.companycd;
    var dvson = req.body.Divison;
    var Department = req.body.Department;
    var Section = req.body.Section;
    const results: any = await Model.getSHEMasterList(
      plantcd,
      compCode,
      dvson,
      Department,
      Section
    );
    let table: any = [];
    let header: any = [];
    let fullData: any = [];
    for (let i = 0; i < results.metaData.length; i++) {
      header.push(results.metaData[i].name);
    }

    for (let i = 0; i < results.rows.length; i++) {
      let arr = results.rows[i];
      let jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }
    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};
// get SHE MAtrix master Details by Risk ID
export const getSHEMatrixDeatilsDataListByRiskID = async (
  req: Request,
  res: Response
) => {
  try {
    var plantcd = req.body.plantcd;
    var compCode = req.body.companycd;
    var RiskID = req.body.RiskID;

    const results: any = await Model.getSHEMatrixDeatilsDataListByRiskID(
      plantcd,
      compCode,
      RiskID
    );
    let table: any = [];
    let header: any = [];
    let fullData: any = [];
    for (let i = 0; i < results.metaData.length; i++) {
      header.push(results.metaData[i].name);
    }

    for (let i = 0; i < results.rows.length; i++) {
      let arr = results.rows[i];
      let jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }
    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};
// get she matrix details
export const getSHEMatrixDetails = async (req: Request, res: Response) => {
  try {
    var plantcd = req.body.plantCode;
    var compCode = req.body.compCode;
    var division = req.body.division;
    var depart = req.body.depart;
    var sect = req.body.sect;
    var PeopleAsset = req.body.PeopleAsset;
    var Consequences = req.body.Consequences;
    var ProbablityOccurance = req.body.ProbablityOccurance;
    var Risk = req.body.Risk;
    var ResidualProbability = req.body.ResidualProbability;
    var ResidualConsequence = req.body.ResidualConsequence;
    var ResidualRisk = req.body.ResidualRisk;
    var ROwner = req.body.Riskowner;
    var RiskID = req.body.RiskID as string;

    const results: any = await Model.GETSHEMatrixDetailsBYRiskID(
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
    let table: any = [];
    let header: any = [];
    let fullData: any = [];
    for (let i = 0; i < results.metaData.length; i++) {
      header.push(results.metaData[i].name);
    }

    for (let i = 0; i < results.rows.length; i++) {
      let arr = results.rows[i];
      let jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }
    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};
//get Owners List
export const ownersList = async (req: Request, res: Response) => {
  try {
    var plantcd = req.body.plantCd;
    var compCode = req.body.companyCd;
    const results: any = await Model.ownersList(plantcd, compCode);
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[0] + ":" + x[1]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getAuthUserForSHEMatrix = async (req: Request, res: Response) => {
  try {
    var plantcd = req.body.plantCode;
    var compCode = req.body.compCode;
    var userId = req.body.userId;
    var RiskID = req.body.RiskID;
    const list: any = [];
    if (userId) {
      const results: any = await Model.getAuthUserForSHEMatrix(
        plantcd,
        compCode,
        userId,
        RiskID
      );

      results.rows.map(function (x: any) {
        list.push(x[0]);
      });
    } else {
      list.push(-1);
    }
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// update she matrix data
export const updateshematrixdetailsdata = async (
  req: Request,
  res: Response
) => {
  try {
    //get data from request
    var { newData, userId, plantCode, compCode } = req.body;

    var rowsAffected: number = 0;
    for (var i = 0; i < newData.length; i++) {
      //initalize variables
      var ele = newData[i];
      var T_RISKID = ele.T_RISKID;
      var T_VERSION = ele.T_VERSION;
      var T_HAZARDOUS_EVENT = ele.T_HAZARDOUS_EVENT;
      var T_CAUSE = ele.T_CAUSE;
      var T_CONSEQUNCE_IMPACT = ele.T_CONSEQUNCE_IMPACT;
      var T_PEOPLE_ASSET = ele.T_PEOPLE_ASSET;
      var T_EXISTING_SAFEGUARD = ele.T_EXISTING_SAFEGUARD;
      var T_CONSEQUENCES = ele.T_CONSEQUENCES;
      var T_PROBABILITY_OCCURANCE = ele.T_PROBABILITY_OCCURANCE;
      var T_RISK = ele.T_RISK;
      var T_RECOMMENDATION_REDUCING = ele.T_RECOMMENDATION_REDUCING;
      var T_RESIDUAL_PROBABILITY = ele.T_RESIDUAL_PROBABILITY;
      var T_RESIDUAL_CONSEQUENCES = ele.T_RESIDUAL_CONSEQUENCES;
      var T_RESIDUAL_RISK = ele.T_RESIDUAL_RISK;

      var rowner = "";
      if (ele.T_RISK_OWNER && ele.T_RISK_OWNER != undefined) {
        var riskowner = ele.T_RISK_OWNER.split("-");
        rowner = riskowner[0];
      }
      var T_RISK_OWNER = rowner;
      var T_RISK_COMMUNICATION = ele.T_RISK_COMMUNICATION;
      var T_CREATEDBY = userId;
      var plantCode = plantCode;
      var compCode = compCode;
      var trviewer1 = ele.T_REVIEWER_ONE;
      var rvonecmnt = ele.T_REVIEWER_ONE_COMMENT;
      var trviewer2 = ele.T_REVIEWER_TWO;
      var rvtwocmnt = ele.T_REVIEWER_TWO_COMMENT;
      var results2: any = await Model.Checkinsertedversionofriskid(
        T_RISKID,
        plantCode,
        compCode
      );
      var Check: any;
      results2.rows[0].map(function (data: any) {
        // stage=(x[0]);
        Check = data;
      });
      //execute query
      var columnchange: any[];
      var columnsdtl = {
        T_HAZARDOUS_EVENT: T_HAZARDOUS_EVENT,
        T_CAUSE: T_CAUSE,
        T_CONSEQUNCE_IMPACT: T_CONSEQUNCE_IMPACT,
        T_PEOPLE_ASSET: T_PEOPLE_ASSET,
        T_EXISTING_SAFEGUARD: T_EXISTING_SAFEGUARD,
        T_CONSEQUENCES: T_CONSEQUENCES,
        T_PROBABILITY_OCCURANCE: T_PROBABILITY_OCCURANCE,
        T_RISK: T_RISK,
        T_RECOMMENDATION_REDUCING: T_RECOMMENDATION_REDUCING,
        T_RESIDUAL_PROBABILITY: T_RESIDUAL_PROBABILITY,
        T_RESIDUAL_CONSEQUENCES: T_RESIDUAL_CONSEQUENCES,
        T_RESIDUAL_RISK: T_RESIDUAL_RISK,
        T_RISK_OWNER: T_RISK_OWNER,
        T_RISK_COMMUNICATION: T_RISK_COMMUNICATION,
      };

      if (Check == 0) {
        const results: any = await Model.updatenewshematrixdetailsdata(
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
          trviewer1,
          rvonecmnt,
          trviewer2,
          rvtwocmnt
        );
        rowsAffected += Number(results.rowsAffected);
      }

      //
      //if(columnchange.length>0){
      if (Check > 0) {
        // start for column val chnage
        var changedcolumnlist: any = [];

        for (const prop in columnsdtl) {
          var results3: any = await Model.checkcolumnvaluechanges(
            T_RISKID,
            T_VERSION,
            columnsdtl[prop],
            prop
          );
          var Check4: any;
          results3.rows[0].map(function (data: any) {
            // stage=(x[0]);
            Check4 = data;
            if (data != null) {
              changedcolumnlist.push(Check4);
            }
          });
        }
        var T_CHANGE_COLUMN = "";
        var resdArray: any = [];
        for (var j = 0; j < changedcolumnlist.length; j++) {
          if (
            changedcolumnlist[j] == "T_RESIDUAL_PROBABILITY" ||
            changedcolumnlist[j] == "T_RESIDUAL_CONSEQUENCES" ||
            changedcolumnlist[j] == "T_RESIDUAL_RISK"
          ) {
            resdArray.push(changedcolumnlist[j]);
          }
          if (T_CHANGE_COLUMN == "") {
            T_CHANGE_COLUMN += changedcolumnlist[j];
          } else {
            T_CHANGE_COLUMN += "," + changedcolumnlist[j];
          }
        }
        if (resdArray.length > 0) {
          const resultsResidual: any =
            await Model.insertResidualChnagesForApproval(
              T_RISKID,
              T_RESIDUAL_PROBABILITY,
              T_RESIDUAL_CONSEQUENCES,
              T_RESIDUAL_RISK,
              plantCode,
              compCode,
              T_CREATEDBY
            );
        }
        //end for col val change
        let results: any = 0;
        if (resdArray.length > 0) {
          rowsAffected += Number("1");
        } else {
          results = await Model.updateshematrixdetailsdata(
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
            trviewer1,
            rvonecmnt,
            trviewer2,
            rvtwocmnt
          );
          rowsAffected += Number(results.rowsAffected);
        }
      }
    }
    return res.status(200).json(rowsAffected);
  } catch (error) {
    console.log(error)
    return res.status(400).json(error);
  }
};

// get SHE MAtrix chart Details by Risk ID
export const getSHEMatrixChartDetails = async (req: Request, res: Response) => {
  try {
    var plantcd = req.body.plantCd;
    var compCode = req.body.companyCd;
    var division = req.body.division;
    var department = req.body.depart;
    var section = req.body.sect;
    var riskOwner = req.body.riskOwner;
    var testresult = [];
    var CONSEQ = ["C1", "C2", "C3", "C4", "C5"];
    var Prob_Occur = ["L1", "L2", "L3", "L4", "L5"];
    for (var i = 0; i < CONSEQ.length; i++) {
      for (var j = 0; j < Prob_Occur.length; j++) {
        var newobjjj = { coln: "", colval: "" };

        var results2: any = await Model.getSHEMatrixChartData(
          division,
          department,
          section,
          CONSEQ[i],
          Prob_Occur[j],
          plantcd,
          compCode,
          riskOwner
        );
        var Check: any;
        results2.rows[0].map(function (data: any) {
          // stage=(x[0]);

          newobjjj.coln = CONSEQ[i] + Prob_Occur[j];
          newobjjj.colval = data;
        });
        testresult.push(newobjjj);
      }
    }

    return res.status(200).json(testresult);
  } catch (error) {
    return res.status(400).json(error);
  }
};
// get She matrix chart count details
export const getSHEMatrixDeatilsDataListByRISKChart = async (
  req: Request,
  res: Response
) => {
  try {
    var plantcd = req.body.plantcd;
    var compCode = req.body.companycd;
    var cseq = req.body.conseq;
    var probocc = req.body.proboccr;
    var div = req.body.division;
    var dept = req.body.department;
    var sec = req.body.section;
    var rowner = req.body.riskowner;

    const results: any = await Model.getSHEMatrixDeatilsDataListByProbandconseq(
      plantcd,
      compCode,
      cseq,
      probocc,
      div,
      dept,
      sec,
      rowner
    );
    let table: any = [];
    let header: any = [];
    let fullData: any = [];
    for (let i = 0; i < results.metaData.length; i++) {
      header.push(results.metaData[i].name);
    }

    for (let i = 0; i < results.rows.length; i++) {
      let arr = results.rows[i];
      let jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }
    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};
// get SHE MAtrix chart Details by Risk ID
export const getSHEMatrixResidualChartDetails = async (
  req: Request,
  res: Response
) => {
  try {
    var plantcd = req.body.plantCd;
    var compCode = req.body.companyCd;
    var division = req.body.division;
    var department = req.body.depart;
    var section = req.body.sect;
    var riskOwner = req.body.riskOwner;
    var testresult = [];
    var CONSEQ = ["C1", "C2", "C3", "C4", "C5"];
    var Prob_Occur = ["L1", "L2", "L3", "L4", "L5"];
    for (var i = 0; i < CONSEQ.length; i++) {
      for (var j = 0; j < Prob_Occur.length; j++) {
        var newobjjj = { coln: "", colval: "" };

        var results2: any = await Model.getSHEMatrixresidualChartData(
          division,
          department,
          section,
          CONSEQ[i],
          Prob_Occur[j],
          plantcd,
          compCode,
          riskOwner
        );
        var Check: any;
        results2.rows[0].map(function (data: any) {
          // stage=(x[0]);

          newobjjj.coln = CONSEQ[i] + Prob_Occur[j];
          newobjjj.colval = data;
        });
        testresult.push(newobjjj);
      }
    }

    return res.status(200).json(testresult);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// Get SHE Matrix pending details
export const getPendingSHEMatrixDetails = async (
  req: Request,
  res: Response
) => {
  try {
    var plantcd = req.body.plantCode;
    var compCode = req.body.compCode;
    var Approver = req.body.ApproverID;
    var Sec = req.body.section;
    var Acttype = req.body.Actiontype;
    const results: any = await Model.GETPENDINGSHEMatrixDetails(
      plantcd,
      compCode,
      Approver,
      Sec,
      Acttype
    );
    let table: any = [];
    let header: any = [];
    let fullData: any = [];
    for (let i = 0; i < results.metaData.length; i++) {
      header.push(results.metaData[i].name);
    }

    for (let i = 0; i < results.rows.length; i++) {
      let arr = results.rows[i];
      let jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }
    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};
// Get SHE Matrix DCI pending details
export const getPendingResidualSHEMatrixDetails = async (
  req: Request,
  res: Response
) => {
  try {
    var plantcd = req.body.plantCode;
    var compCode = req.body.compCode;
    var Approver = req.body.ApproverID;

    const results: any = await Model.GETPENDINGResidualSHEMatrixDetails(
      plantcd,
      compCode,
      Approver
    );
    let table: any = [];
    let header: any = [];
    let fullData: any = [];
    for (let i = 0; i < results.metaData.length; i++) {
      header.push(results.metaData[i].name);
    }

    for (let i = 0; i < results.rows.length; i++) {
      let arr = results.rows[i];
      let jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }
    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};
// get ALL SHE MAtrix  Details
export const getALLSHEMatrixDetails = async (req: Request, res: Response) => {
  try {
    var plantcd = req.body.plantcd;
    var compCode = req.body.companycd;

    const results: any = await Model.getALLSHEMatrixDetails(plantcd, compCode);
    let table: any = [];
    let header: any = [];
    let fullData: any = [];
    for (let i = 0; i < results.metaData.length; i++) {
      header.push(results.metaData[i].name);
    }

    for (let i = 0; i < results.rows.length; i++) {
      let arr = results.rows[i];
      let jsonObj: any = {};
      header.forEach((key: any, i: any) => (jsonObj[key] = arr[i]));
      table.push(jsonObj);
    }
    return res.status(200).json(table);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const updateapprovalshematrixdetailsdata = async (
  req: Request,
  res: Response
) => {
  try {
    var { newData, userId, plantCode, compCode } = req.body;
    var rowsAffected: number = 0;
    for (var i = 0; i < newData.length; i++) {
      var ele = newData[i];
      var Division = ele.T_DIVISION;
      var Department = ele.T_DEPARTMENT;
      var Section = ele.T_SECTION;
      var T_RISKID = ele.T_RISKID;
      var T_RISK_APPRV_COMMENT = ele.T_RISK_APPRV_COMMENT;
      var T_RISK_APPRV_STATUS = ele.T_RISK_APPRV_STATUS;
      var userId = userId;
      var plantcd = plantCode;
      var Company = compCode;

      var RiskApprover = "";
      // for check rsik Approver

      var RiskApproverCheck: any = await Model.checkRiskApprover(
        Division,
        Department,
        Section,
        userId,
        plantcd,
        Company
      );
      if (RiskApproverCheck.rows.length > 0) {
        RiskApproverCheck.rows[0].map(function (data: any) {
          RiskApprover = data;
        });
      }
      if (RiskApprover.length > 0) {
        const results: any = await Model.updateapprovalshematrixdetailsdata(
          T_RISKID,
          T_RISK_APPRV_COMMENT,
          T_RISK_APPRV_STATUS,
          userId,
          plantcd,
          Company
        );
        rowsAffected += Number(results.rowsAffected);
      }
      if (RiskApprover.length == 0) {
        rowsAffected += Number("99");
      }
    }
    return res.status(200).json(rowsAffected);
  } catch (error) {
    return res.status(400).json(error);
  }
};

//insert SHEMatrix Master Data
export const insertSHEMatrixData = async (req: Request, res: Response) => {
  try {
    var Division = req.body.Division;
    var Department = req.body.Department;
    var Section = req.body.Section;
    var Line = req.body.Line;
    var Job = req.body.Job;
    var Activity = req.body.Activity;
    var Hazard = req.body.Hazard;
    var HAZARDOUSEVENT = req.body.HAZARDOUSEVENT;
    var CAUSE = req.body.CAUSE;
    var CONSEQUNCEIMPACT = req.body.CONSEQUNCEIMPACT;
    var PEOPLEASSET = req.body.PEOPLEASSET;
    var EXISTINGSAFEGUARD = req.body.EXISTINGSAFEGUARD;
    var CONSEQ = req.body.CONSEQ;
    var PROBOCCR = req.body.PROBOCCR;
    var RISK = req.body.RISK;
    var RECOMMRED = req.body.RECOMMRED;
    var RESIDPROB = req.body.RESIDPROB;
    var RESDICONSEQ = req.body.RESDICONSEQ;
    var RESDIRISK = req.body.RESDIRISK;
    var RISKCOMM = req.body.RISKCOMM;
    var RISKOWNER = req.body.RISKOWNER;
    var plantcd = req.body.plantcd;
    var Company = req.body.Company;
    var CreatedBy = req.body.CreatedBy;
    var RiskID = "";
    var PRVRISKID = "";
    var riskowneremail = "";
    var riskownername = "";
    var revone="";
    var revtwo="";
    // for previous RiskID identification
    var objresponse = { RiskID: "", SavedStatus: "" };
    var resultscheckriskid: any = await Model.getPrevRiskID(
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
    if (resultscheckriskid.rows.length > 0) {
      resultscheckriskid.rows[0].map(function (data: any) {
        PRVRISKID = data;
      });
    }
    if (PRVRISKID.length == 0) {
      // max risk id calculation
      var results1: any = await Model.getmaxRiskID(
        Division,
        Department,
        Section,
        plantcd,
        Company
      );
      var Check4: any;
      if (results1.rows.length > 0) {
        results1.rows[0].map(function (data: any) {
          // stage=(x[0]);
          RiskID = data;
        });
      }
      //for reviewer
      if (plantcd == "0783") {
        revone="806760-Kunjan Kumar";
        revtwo="158524-Amol Prakashrao Mahajan";       
      }else if (plantcd == "055") {
        revone="806760-Kunjan Kumar";
        revtwo="807603-Subrat Kumar Sahoo";       
      }
      else if (plantcd == "056") {
        revone="806760-Kunjan Kumar";
        revtwo="808195-Akash Tiwar";       
      }
// end for reviwer
      // var verifySoapUserDetails =
      //   await soapHandeler.UserDetailsByPersonalNumber(RISKOWNER);
      // get user name and email details
      try{
      const verifySoapUserDetails: any =
        await Model.UserDetailsByPersonalNumber(RISKOWNER);
      if (verifySoapUserDetails.outBinds.ls_results != "") {
        var employeedetails =
          verifySoapUserDetails.outBinds.ls_results.split("-");
        riskowneremail = employeedetails[0];
        riskownername = employeedetails[1];
      } else {
        riskowneremail = RISKOWNER;
        riskownername = RISKOWNER;
      }
    }catch(e){
      riskowneremail = RISKOWNER;
      riskownername = RISKOWNER;
    }
      if (RiskID.length == 0) {
        if (plantcd == "0783") {
          if (Department == "Khopoli Shared Services") {
            RiskID = "RKSSR.0001";
          } else if (Department == "Khopoli LDP") {
            RiskID = "RKLDP.0001";
          } else if (Department == "Khopoli CRM") {
            RiskID = "RKCRM.0001";
          } else if (Department == "Khopoli Tubes") {
            RiskID = "RKTUB.0001";
          } else if (Department == "Khopoli PP&Util") {
            RiskID = "RKPUT.0001";
          } else if (Department == "Khopoli Quality") {
            RiskID = "RKQLT.0001";
          } else if (Department == "Khopoli Central Function") {
            RiskID = "RKCNT.0001";
          } else if (Department == "Khopoli Hosur") {
            RiskID = "RKHOS.0001";
          }
          // RiskID='RK'+Department.substring(0, 4).toUpperCase()
        }
        if (plantcd == "0742") {
          if (Department == "Angul CRM") {
            RiskID = "RACRM.0001";
          }        
          if (Department == "BF-2") {
            RiskID = "RABF2.0001";
          }        
        }
        if (plantcd == "0761") {
          if (Department == "Sahibabad CRM") {
            RiskID = "RSCRM.0001";
          }        
          if (Department == "Sahibabad Coated") {
            RiskID = "RSCTD.0001";
          } 
          if (Department == "Sahibabad Finishing & Dispatch") {
            RiskID = "RSFDP.0001";
          }   
          if (Department == "Sahibabad Shared Services") {
            RiskID = "RSSDS.0001";
          }  
          if (Department == "Sahibabad Quality") {
            RiskID = "RSQLT.0001";
          }  
          if (Department == "Sahibabad Other Services") {
            RiskID = "RSOTS.0001";
          }  
          if (Department == "Sahibabad Logistics") {
            RiskID = "RSLGS.0001";
          }  
          if (Department == "Sahibabad Tubes") {
            RiskID = "RSTUB.0001";
          }  
        
          //RiskID = "SK" + Department.substring(0, 4).toUpperCase();
        }
      }
      if (RiskID.length > 0) {
        const results: any = await Model.insertSHEMatrixData(
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
        // if (verifySoapUserDetails.EmployeeEmail.length > 0) {
        //   const resultsRowner: any = await Model.insertSHEMatrixRiskOwnerData(
        //     RiskID,
        //     plantcd,
        //     Company,
        //     RISKOWNER,
        //     JSON.parse(verifySoapUserDetails.EmployeeEmail),
        //     JSON.parse(verifySoapUserDetails.EmployeeName),
        //     CreatedBy
        //   );
        // }
        if (riskowneremail != "") {
          const resultsRowner: any = await Model.insertSHEMatrixRiskOwnerData(
            RiskID,
            plantcd,
            Company,
            RISKOWNER,
            riskowneremail,
            riskownername,
            // JSON.parse(verifySoapUserDetails.EmployeeEmail),
            // JSON.parse(verifySoapUserDetails.EmployeeName),
            CreatedBy
          );
        }
        const resultsshemtrxdtl: any = await Model.insertshematrixdetailsdata(
          RiskID,
          HAZARDOUSEVENT,
          CAUSE,
          CONSEQUNCEIMPACT,
          PEOPLEASSET,
          EXISTINGSAFEGUARD,
          CONSEQ,
          PROBOCCR,
          RISK,
          RECOMMRED,
          RESIDPROB,
          RESDICONSEQ,
          RESDIRISK,
          RISKOWNER,
          RISKCOMM,
          CreatedBy,
          plantcd,
          Company,
          revone,
          revtwo
        );
        if (objresponse.RiskID !== null) {
          objresponse.RiskID = RiskID;
          objresponse.SavedStatus = "1";
        } else {
          objresponse.RiskID = RiskID;
          objresponse.SavedStatus = "0";
        }
        return res.status(200).json(objresponse);
      } else {
        objresponse.RiskID = RiskID;
        objresponse.SavedStatus = "99";
        return res.status(200).json(objresponse); // for riskid generation issue
      }
    } else {
      objresponse.RiskID = PRVRISKID;
      objresponse.SavedStatus = "100";
      return res.status(200).json(objresponse);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const uploadfiles = async (req: any, res: Response, next: any) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    var RISKID = req.file.originalname.split(".");
    var RID = RISKID[0] + "." + RISKID[1];
    const results: any = await Model.updatefileforSheMatrix(
      RID,
      req.file.originalname
    );
    if (Number(results.rowsAffected) > 0) {
      res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
      });
    } else {
      res.status(500).send({
        message: "Could not upload the file",
      });
    }
  } catch (err: any) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 5MB!",
      });
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

export const getDefaultRiskOwner = async (req: Request, res: Response) => {
  try {
    var Division = req.body.Division;
    var Department = req.body.Department;
    var Section = req.body.section;
    var plantcd = req.body.plantCode;
    var Company = req.body.compCode;

    var RiskApprover = "";
    // for check rsik Approver

    var RiskApproverCheck: any = await Model.getDefaultRiskOwner(
      Division,
      Department,
      Section
    );
    if (RiskApproverCheck.rows.length > 0) {
      RiskApproverCheck.rows[0].map(function (data: any) {
        RiskApprover = data;
      });
    }

    return res.status(200).json(RiskApprover);
  } catch (error) {
    return res.status(400).json(error);
  }
};

//Update SHEMatrix Master Data
export const UpdateSHEMatrixRejectedData = async (
  req: Request,
  res: Response
) => {
  try {
    var Division = req.body.Division;
    var Department = req.body.Department;
    var Section = req.body.Section;
    var Line = req.body.Line;
    var Job = req.body.Job;
    var Activity = req.body.Activity;
    var Hazard = req.body.Hazard;
    var HAZARDOUSEVENT = req.body.HAZARDOUSEVENT;
    var CAUSE = req.body.CAUSE;
    var CONSEQUNCEIMPACT = req.body.CONSEQUNCEIMPACT;
    var PEOPLEASSET = req.body.PEOPLEASSET;
    var EXISTINGSAFEGUARD = req.body.EXISTINGSAFEGUARD;
    var CONSEQ = req.body.CONSEQ;
    var PROBOCCR = req.body.PROBOCCR;
    var RISK = req.body.RISK;
    var RECOMMRED = req.body.RECOMMRED;
    var RESIDPROB = req.body.RESIDPROB;
    var RESDICONSEQ = req.body.RESDICONSEQ;
    var RESDIRISK = req.body.RESDIRISK;
    var RISKCOMM = req.body.RISKCOMM;
    var RISKOWNER = req.body.RISKOWNER;
    var plantcd = req.body.plantcd;
    var Company = req.body.Company;
    var CreatedBy = req.body.CreatedBy;
    var RiskID = req.body.RISKID;
    var PRVRISKID = "";
    var riskowneremail = "";
    var riskownername = "";
    // for previous RiskID identification
    var objresponse = { RiskID: "", SavedStatus: "" };
    // var verifySoapUserDetails = await soapHandeler.UserDetailsByPersonalNumber(
    //   RISKOWNER
    // );
    // get user name and email details
    const verifySoapUserDetails: any = await Model.UserDetailsByPersonalNumber(
      RISKOWNER
    );
    if (verifySoapUserDetails.outBinds.ls_results != "") {
      var employeedetails =
        verifySoapUserDetails.outBinds.ls_results.split("-");
      riskowneremail = employeedetails[0];
      riskownername = employeedetails[1];
    } else {
      riskowneremail = RISKOWNER;
      riskownername = RISKOWNER;
    }
    if (RiskID.length > 0) {
      //UpdateSHEMatrixRejectedData  insertshematrixdetailsdata
      const resultsshemtrxdtl: any = await Model.UpdateSHEMatrixRejectedData(
        RiskID,
        HAZARDOUSEVENT,
        CAUSE,
        CONSEQUNCEIMPACT,
        PEOPLEASSET,
        EXISTINGSAFEGUARD,
        CONSEQ,
        PROBOCCR,
        RISK,
        RECOMMRED,
        RESIDPROB,
        RESDICONSEQ,
        RESDIRISK,
        RISKOWNER,
        RISKCOMM,
        CreatedBy,
        plantcd,
        Company,
        "147850-Kapil Modi",
        "158524-Amol Prakashrao Mahajan"
      );
      if (Number(resultsshemtrxdtl.rowsAffected) > 0) {
        // if (verifySoapUserDetails.EmployeeEmail.length > 0) {
        //   const resultsRowner: any =
        //     await Model.UpdateRejectedSHEMatrixRiskOwnerData(
        //       RiskID,
        //       plantcd,
        //       Company,
        //       RISKOWNER,
        //       JSON.parse(verifySoapUserDetails.EmployeeEmail),
        //       JSON.parse(verifySoapUserDetails.EmployeeName),
        //       CreatedBy
        //     );
        if (verifySoapUserDetails.outBinds.ls_results != "") {
          const resultsRowner: any =
            await Model.UpdateRejectedSHEMatrixRiskOwnerData(
              RiskID,
              plantcd,
              Company,
              RISKOWNER,
              riskowneremail,
              riskownername,
              // JSON.parse(verifySoapUserDetails.EmployeeEmail),
              // JSON.parse(verifySoapUserDetails.EmployeeName),
              CreatedBy
            );

          const riskstatus: any = await Model.updatesheriskstatus(
            RiskID,
            CreatedBy
          );
        }
        objresponse.RiskID = RiskID;
        objresponse.SavedStatus = "1";
      } else {
        objresponse.RiskID = RiskID;
        objresponse.SavedStatus = "0";
      }
      return res.status(200).json(objresponse);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

// update DCI approval of shematrix data
export const updateDCIapprovalshematrixdetailsdata = async (
  req: Request,
  res: Response
) => {
  try {
    var { newData, userId, plantCode, compCode } = req.body;
    var rowsAffected: number = 0;
    for (var i = 0; i < newData.length; i++) {
      var ele = newData[i];
      var Division = ele.T_DIVISION;
      var Department = ele.T_DEPARTMENT;
      var Section = ele.T_SECTION;
      var T_RISKID = ele.T_RISKID;
      var T_RISK_APPRV_COMMENT = ele.T_RISK_APPRV_COMMENT;
      var T_RISK_APPRV_STATUS = ele.T_RISK_APPRV_STATUS;
      var T_RESIDUAL_PROBABILITY = ele.T_RESIDUAL_PROBABILITY;
      var T_RESIDUAL_CONSEQUENCES = ele.T_RESIDUAL_CONSEQUENCES;
      var T_RESIDUAL_RISK = ele.T_RESIDUAL_RISK;
      var userId = userId;
      var plantcd = plantCode;
      var Company = compCode;

      var RiskApprover = "";
      // for check rsik Approver

      var RiskApproverCheck: any = await Model.checkDCIRiskApprover(
        Division,
        Department,
        Section,
        userId,
        plantcd,
        Company
      );
      if (RiskApproverCheck.rows.length > 0) {
        RiskApproverCheck.rows[0].map(function (data: any) {
          RiskApprover = data;
        });
      }
      if (RiskApprover.length > 0) {
        const results: any = await Model.updateDCIapprovalshematrixdetailsdata(
          T_RISKID,
          T_RISK_APPRV_COMMENT,
          T_RISK_APPRV_STATUS,
          userId,
          plantcd,
          Company,
          T_RESIDUAL_PROBABILITY,
          T_RESIDUAL_CONSEQUENCES,
          T_RESIDUAL_RISK
        );
        rowsAffected += Number(results.rowsAffected);
      }
      if (RiskApprover.length == 0) {
        rowsAffected += Number("99");
      }
    }
    return res.status(200).json(rowsAffected);
  } catch (error) {
    return res.status(400).json(error);
  }
};

//get Approver Section List
export const getApproverSectionList = async (req: Request, res: Response) => {
  try {
    var plantcd = req.body.plantCd;
    var compCode = req.body.companyCd;
    var personalno = req.body.personalno;
    const results: any = await Model.getApproverSectionList(
      plantcd,
      compCode,
      personalno
    );
    const list: any = [];
    results.rows.map(function (x: any) {
      list.push(x[0]);
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const filedownload = async (req: any, res: any) => {
  var fileName = req.body.filename || null;
  if (fileName?.length > 0) {
    let directoryPath = ""
    if (env?.deploy === 'Y') {
      directoryPath = "/var/www/html/" + "/shedatafiles/";
    } else {
      directoryPath = "D:/MY Project/CRM_TSK_NODE/" + "/shedatafiles/";
    }
    //  var _basedir ="D:\\NewTSMAPI\\public\\"; //__dirname;
    // const directoryPath="D:/Angul MES/NewTSMAPI/public/SheMatrixFile/UploadedFile/";
    await res.download(directoryPath + fileName, fileName, (err: any) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  } else {
    res.status(500).send({
      message: "File not found",
    });
  }
};
