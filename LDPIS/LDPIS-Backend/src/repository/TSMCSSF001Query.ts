import oracledb from "oracledb";
import Query from "../infrastructure/database/querys";
import Error from "../models/errors";

export const getPlantList = async (pno: any) => {
  try {
    // const sql = `select distinct T_DIVISION from   LDPDBA.T_SHE_RISK_MST  where T_PLANT_CD=:plantcd and T_COMP_CD=:compcode`;
    const sql = `select CD_DESC as PLANT_CD, CD_DESC1 as COMP_CD from V_CODES
  where CD_TYPE = 'EPA200S'
  and CD_VALUE in (select EGP_CD_EPA from V_EPA_GROUP_PLANT
  where EGP_GRP_USER = :pno) `;
    const binds = {
      pno: pno,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getdivisonList = async (plantcd: any, compCode: any) => {
  try {
    // const sql = `select distinct T_DIVISION from   LDPDBA.T_SHE_RISK_MST  where T_PLANT_CD=:plantcd and T_COMP_CD=:compcode`;
    const sql = `SELECT
                      T_MSTDATA_VALUE as T_DIVISION,
                      T_PLANT_CD PLANT_CD, T_COMP_CD COMP_CD
                FROM  LDPDBA.T_SHE_RISK_MST_PRIMARYDATA 
               where T_MSTDATA_TYPE='DIVISION'  and T_COMP_CD in (select CD_DESC1 from V_CODES
  where CD_TYPE = 'EPA200S'
  and CD_VALUE in (select EGP_CD_EPA from V_EPA_GROUP_PLANT
  where EGP_GRP_USER = :pno)) and T_PLANT_CD in (select CD_DESC from V_CODES
  where CD_TYPE = 'EPA200S'
  and CD_VALUE in (select EGP_CD_EPA from V_EPA_GROUP_PLANT
  where EGP_GRP_USER = :pno)) `;
    const binds = {
      pno: plantcd,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getDepartmentList = async (
  plantcd: any,
  Division: any,
  compCode: any
) => {
  try {
    // const sql = ` select distinct T_DEPARTMENT from
    //                      LDPDBA.T_SHE_RISK_MST
    //                where T_PLANT_CD=:plantcd and T_DIVISION=:division
    //                     and T_COMP_CD=:compcode `;
    const sql = `select 
                        distinct T_MSTDATA_VALUE 
                  from   LDPDBA.T_SHE_RISK_MST_PRIMARYDATA 
                 where  T_MSTDATA_TYPE='DEPARTMENT' and T_PARENT_MST_VALUE=:division 
                         and T_PLANT_CD=:plantcd and T_COMP_CD=:compcode and ACTIVE='Y' 
              order by T_MSTDATA_VALUE       
                  `;
    var binds = {
      plantcd: plantcd,
      compcode: compCode,
      division: Division,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getSectionList = async (
  plantcd: any,
  Department: any,
  compCode: any,
  dvson: any
) => {
  try {
    // const sql = ` select distinct T_SECTION from
    //   LDPDBA.T_SHE_RISK_MST  where T_PLANT_CD=:plantcd and T_DEPARTMENT=:department and T_DIVISION=:Division and T_COMP_CD=:compcode `;
    const sql = ` 
      select 
                        distinct T_MSTDATA_VALUE 
                  from   LDPDBA.T_SHE_RISK_MST_PRIMARYDATA 
                 where  T_MSTDATA_TYPE='SECTION' and T_PARENT_MST_VALUE=:department 
                         and T_PLANT_CD=:plantcd and T_COMP_CD=:compcode and ACTIVE='Y'
              order by T_MSTDATA_VALUE    
                  `;
    var binds = {
      plantcd: plantcd,
      compcode: compCode,
      department: Department,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getRiskDataList = async (
  plantcd: any,
  compCode: any,
  dvson: any
) => {
  try {
    const sql = ` select T_RISKID from   LDPDBA.T_SHE_RISK_MST 
      where T_PLANT_CD=:plantcd and T_COMP_CD=:compcode and T_DIVISION=:T_DIVISION and T_ACTIVE= '1'
     -- and T_DEPARTMENT=:T_DEPARTMENT  and T_SECTION=:T_SECTION and T_ACTIVE= '1' 
      `;
    var binds = {
      plantcd: plantcd,
      compcode: compCode,
      T_DIVISION: dvson,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getSHEMasterList = async (
  plantcd: any,
  compCode: any,
  dvson: any,
  Department: any,
  Section: any
) => {
  try {
    const sql = ` select T_DIVISION ,T_DEPARTMENT  ,T_SECTION ,T_LINE_AREA,T_JOB  ,T_ACTIVITY ,
                           T_RISKID ,T_HAZARD 
                      from   LDPDBA.T_SHE_RISK_MST 
                     where T_DIVISION=:division  and T_DEPARTMENT=:department  
                          and T_SECTION=:section and T_PLANT_CD=:plantcd 
                          and T_COMP_CD=:compcode `;
    var binds = {
      plantcd: plantcd,
      compcode: compCode,
      division: dvson,
      department: Department,
      section: Section,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getSHEMatrixDeatilsDataListByRiskID = async (
  plantcd: any,
  compCode: any,
  RiskID: any
) => {
  try {
    const sql = ` select distinct a.T_DIVISION ,a.T_DEPARTMENT  ,a.T_SECTION ,a.T_LINE_AREA,a.T_JOB  ,a.T_ACTIVITY ,
                            a.T_RISKID ,a.T_HAZARD 
                           ,b.T_HAZARDOUS_EVENT,T_CAUSE,T_CONSEQUNCE_IMPACT,T_PEOPLE_ASSET,T_EXISTING_SAFEGUARD,T_CONSEQUENCES,T_PROBABILITY_OCCURANCE, T_RISK,  
                           T_RECOMMENDATION_REDUCING,T_RESIDUAL_PROBABILITY , T_RESIDUAL_CONSEQUENCES ,T_RESIDUAL_RISK,
                           (select distinct (T_OWNER_PERSONALNO||'-'||T_OWNER_NAME)  from  LDPDBA.T_SHE_RISK_OWNER where T_OWNER_PERSONALNO=b.T_RISK_OWNER and T_RISKID=b.T_RISKID) T_RISK_OWNER ,
                           --(select distinct T_OWNER_PERSONALNO from  LDPDBA.T_SHE_RISK_OWNER where T_OWNER_PERSONALNO=b.T_RISK_OWNER) T_RISK_OWNER ,
                           T_RISK_COMMUNICATION ,T_VERSION 
                      from  LDPDBA.T_SHE_RISK_MST a  join  LDPDBA.T_SHE_RISK_DTL b on a.T_RISKID=b.T_RISKID                
                     where  a.T_Active='1' and a.T_PLANT_CD=:plantcd and  a.T_COMP_CD=:compcode and b.T_RISKID=:T_RISKID
                     order by T_VERSION
    `;
    var binds = {
      plantcd: plantcd,
      compcode: compCode,
      T_RISKID: RiskID,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const GETSHEMatrixDetailsBYRiskID = async (
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
) => {
  try {
    var sourceRiskID = (RiskID as string).split(",");
    let str = ``;
    if (division.length == 0 && depart.length == 0) {
      str += ` and 1=1 `;
    }
    if (division.length > 0 && depart.length == 0) {
      str += ` and T_DIVISION='${division}' `;
    }
    if (division.length > 0 && depart.length > 0 && sect.length == 0) {
      str += ` and T_DIVISION='${division}'  and T_DEPARTMENT='${depart}'  `;
    }
    if (division.length > 0 && depart.length > 0 && sect.length > 0) {
      str += ` and T_DIVISION='${division}'  and T_DEPARTMENT='${depart}' and T_SECTION='${sect}' `;
    }
    //PeopleAsset ,Consequences,ProbablityOccurance,Risk,ResidualProbability,ResidualConsequence,ResidualRisk
    if (PeopleAsset && PeopleAsset.length > 0) {
      str += ` and T_PEOPLE_ASSET='${PeopleAsset}'  `;
    }
    if (Consequences && Consequences.length > 0) {
      str += ` and T_CONSEQUENCES='${Consequences}'  `;
    }
    if (ProbablityOccurance && ProbablityOccurance.length > 0) {
      str += ` and T_PROBABILITY_OCCURANCE='${ProbablityOccurance}'  `;
    }
    if (Risk && Risk.length > 0) {
      str += ` and T_RISK='${Risk}'  `;
    }
    if (ResidualProbability && ResidualProbability.length > 0) {
      str += ` and T_RESIDUAL_PROBABILITY='${ResidualProbability}'  `;
    }
    if (ResidualConsequence && ResidualConsequence.length > 0) {
      str += ` and T_RESIDUAL_CONSEQUENCES='${ResidualConsequence}'  `;
    }
    if (ResidualRisk && ResidualRisk.length > 0) {
      str += ` and T_RESIDUAL_RISK='${ResidualRisk}'  `;
    }
    if (ROwner && ROwner.length > 0) {
      str += ` and T_RISK_OWNER='${ROwner}'  `;
    }
    var sql = ` select distinct  rnk,T_RISKID,T_VERSION, T_DIVISION ,T_DEPARTMENT  ,T_SECTION ,T_LINE_AREA,T_JOB  ,T_ACTIVITY ,
    T_HAZARD ,T_HAZARDOUS_EVENT,T_CAUSE,T_CONSEQUNCE_IMPACT,T_PEOPLE_ASSET,T_EXISTING_SAFEGUARD,T_CONSEQUENCES,T_PROBABILITY_OCCURANCE, T_RISK,  
   T_RECOMMENDATION_REDUCING,T_RESIDUAL_PROBABILITY , T_RESIDUAL_CONSEQUENCES ,T_RESIDUAL_RISK,T_RISK_OWNER ,T_RISK_OWNERNEW,
     T_RISK_COMMUNICATION ,T_VERSION ,T_CHANGE_COLUMN,rnk ,T_REVIEWER_ONE_COMMENT, T_REVIEWER_ONE, T_REVIEWER_TWO_COMMENT, T_REVIEWER_TWO ,T_SHE_RISK_FILE,IL3OFFICER            
from 	(
select a.T_DIVISION ,a.T_DEPARTMENT  ,a.T_SECTION ,a.T_LINE_AREA,a.T_JOB  ,a.T_ACTIVITY ,
    a.T_RISKID ,a.T_HAZARD 
   ,b.T_HAZARDOUS_EVENT,T_CAUSE,T_CONSEQUNCE_IMPACT,T_PEOPLE_ASSET,T_EXISTING_SAFEGUARD,T_CONSEQUENCES,T_PROBABILITY_OCCURANCE, T_RISK,  
   T_RECOMMENDATION_REDUCING,T_RESIDUAL_PROBABILITY , T_RESIDUAL_CONSEQUENCES ,T_RESIDUAL_RISK,
    b.T_RISK_OWNER ,
   (select distinct (T_OWNER_PERSONALNO||'-'||T_OWNER_NAME) T_OWNER_PERSONALNO from  LDPDBA.T_SHE_RISK_OWNER where T_OWNER_PERSONALNO=b.T_RISK_OWNER and T_RISKID=b.T_RISKID) T_RISK_OWNERNEW ,
     T_RISK_COMMUNICATION ,T_VERSION ,
   T_CHANGE_COLUMN, T_REVIEWER_ONE_COMMENT, T_REVIEWER_ONE, T_REVIEWER_TWO_COMMENT, T_REVIEWER_TWO,b.T_SHE_RISK_FILE,             
   (select distinct TSA_OWNER from  LDPDBA.T_she_risk_Aprv where TSA_TYPE='RiskApprover' 
   and TSA_DEPARTMENT=a.T_DEPARTMENT and TSA_SECTION=a.T_SECTION 
   and TSA_DIVISION=a.T_DIVISION and TSA_ACTIVE='Y' and ROWNUM=1 and TSA_PLANT_CD=:plantcd and TSA_COMPANY_CD=:compcode) IL3OFFICER,
   (select distinct TSA_OWNER from  LDPDBA.T_she_risk_Aprv where TSA_TYPE='SafetyOfficer' 
   and TSA_DEPARTMENT=a.T_DEPARTMENT and TSA_SECTION=a.T_SECTION 
   and TSA_DIVISION=a.T_DIVISION and TSA_ACTIVE='Y' and ROWNUM=1 and TSA_PLANT_CD=:plantcd and TSA_COMPANY_CD=:compcode) SAFETYOFFICER,
RANK () OVER ( PARTITION BY  a.T_RISKID
ORDER BY	     b.T_VERSION	DESC
) AS rnk
from  LDPDBA.T_SHE_RISK_MST a left join  LDPDBA.T_SHE_RISK_DTL b on a.T_RISKID=b.T_RISKID                
   where  a.T_PLANT_CD=:plantcd and  a.T_COMP_CD=:compcode and a.T_Active='1' and a.T_RISK_APPRV_STATUS='Y' ) 
   where rnk <= 1  ${str} 
    `;
    var binds = {
      plantcd: plantcd,
      compcode: compCode,
    };
    if (RiskID && RiskID.length > 0 && RiskID != "") {
      sql += `AND ((T_RISKID) IN (`;

      for (var i = 0; i < sourceRiskID.length; i++) {
        sql += i > 0 ? ", :" + i : ":" + i;
        binds[i] = sourceRiskID[i];
      }
      sql += `))`;
    }
    sql += ` order by T_RISKID `;
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const ownersList = async (plantcd: any, compCode: any) => {
  try {
    const sql = ` select distinct T_OWNER_NAME,T_OWNER_PERSONALNO 
                     from  LDPDBA.T_SHE_RISK_OWNER where T_PLANT_CD=:plantcd and T_COMP_CD=:compcode   order by T_OWNER_NAME `;
    var binds = {
      plantcd: plantcd,
      compcode: compCode,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getAuthUserForSHEMatrix = async (
  plantcd: any,
  compCode: any,
  userId: any,
  RiskID: any
) => {
  try {
    const sql = ` select T_OWNER_PERSONALNO   from   LDPDBA.T_SHE_RISK_OWNER  
               where T_PLANT_CD=:plantcd and T_COMP_CD=:compCode  and T_RISKID=:RiskID
                 and T_OWNER_PERSONALNO=LPAD(:userId, 6)`;
    var binds = {
      plantcd: plantcd,
      compcode: compCode,
      userId: userId,
      RiskID: RiskID,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
//check previously defined data
export const Checkinsertedversionofriskid = async (
  T_RISKID: any,
  plantCode: any,
  compCode: any
) => {
  try {
    const sql = `select nvl( max(T_VERSION),0) Versionc
    from  LDPDBA.T_SHE_RISK_DTL where T_RISKID=:T_RISKID
     and T_PLANT_CD=:plantCode  and T_COMP_CD=:compCode `;
    var binds = {
      T_RISKID: T_RISKID,
      plantCode: plantCode,
      compCode: compCode,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
//check column value changes
export const checkcolumnvaluechanges = async (
  T_RISKID: any,
  T_VERSION: any,
  colvalue: any,
  colname: any
) => {
  try {
    const sql = `select LDPDBA.GET_COLUMNCHANGEDSTATUS(:T_RISKID,:T_VERSION,:colvalue,:colname) from dual `;
    var binds = {
      T_RISKID: T_RISKID,
      T_VERSION: T_VERSION,
      colvalue: colvalue,
      colname: colname,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
//end
//update matrix data
export const updatenewshematrixdetailsdata = async (
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
) => {
  try {
    var T_RISKID = T_RISKID;
    var T_HAZARDOUS_EVENT = T_HAZARDOUS_EVENT;
    var T_CAUSE = T_CAUSE;
    var T_CONSEQUNCE_IMPACT = T_CONSEQUNCE_IMPACT;
    var T_PEOPLE_ASSET = T_PEOPLE_ASSET;
    var T_EXISTING_SAFEGUARD = T_EXISTING_SAFEGUARD;
    var T_CONSEQUENCES = T_CONSEQUENCES;
    var T_PROBABILITY_OCCURANCE = T_PROBABILITY_OCCURANCE;
    var T_RISK = T_RISK;
    var T_RECOMMENDATION_REDUCING = T_RECOMMENDATION_REDUCING;
    var T_RESIDUAL_PROBABILITY = T_RESIDUAL_PROBABILITY;
    var T_RESIDUAL_CONSEQUENCES = T_RESIDUAL_CONSEQUENCES;
    var T_RESIDUAL_RISK = T_RESIDUAL_RISK;
    var T_RISK_OWNER = T_RISK_OWNER;
    var T_RISK_COMMUNICATION = T_RISK_COMMUNICATION;
    var T_CREATEDBY = T_CREATEDBY;
    var plantCode = plantCode;
    var compCode = compCode;
    var REVIEWER_ONE = REVIEWER_ONE;
    var T_REVIEWER_ONE_COMMENT = T_REVIEWER_ONE_COMMENT;
    var REVIEWER_TWO = REVIEWER_TWO;
    var T_REVIEWER_TWO_COMMENT = T_REVIEWER_TWO_COMMENT;
    const sql = ` 
    insert into  LDPDBA.T_SHE_RISK_DTL(T_RISKID,T_HAZARDOUS_EVENT,T_CAUSE,T_CONSEQUNCE_IMPACT,T_PEOPLE_ASSET,T_EXISTING_SAFEGUARD,
            T_CONSEQUENCES, T_PROBABILITY_OCCURANCE,T_RISK,T_RECOMMENDATION_REDUCING,T_RESIDUAL_PROBABILITY,T_RESIDUAL_CONSEQUENCES,
            T_RESIDUAL_RISK,T_RISK_COMMUNICATION,T_RISK_OWNER,T_VERSION,T_CREATEDBY,T_CREATEDDATE,T_PLANT_CD,T_COMP_CD,
            T_REVIEWER_ONE, T_REVIEWER_ONE_COMMENT,T_REVIEWER_TWO,T_REVIEWER_TWO_COMMENT)
          
        
             select distinct :T_RISKID,:T_HAZARDOUS_EVENT,:T_CAUSE,:T_CONSEQUNCE_IMPACT,:T_PEOPLE_ASSET,:T_EXISTING_SAFEGUARD,
             :T_CONSEQUENCES, :T_PROBABILITY_OCCURANCE,:T_RISK,:T_RECOMMENDATION_REDUCING,:T_RESIDUAL_PROBABILITY,:T_RESIDUAL_CONSEQUENCES,
             :T_RESIDUAL_RISK,:T_RISK_COMMUNICATION,:T_RISK_OWNER,1,:T_CREATEDBY,sysdate,:T_PLANT_CD,:T_COMP_CD,:T_REVIEWER_ONE,:T_REVIEWER_ONE_COMMENT,:T_REVIEWER_TWO,:T_REVIEWER_TWO_COMMENT
             from  LDPDBA.T_SHE_RISK_DTL


     
                   `;
    const binds = {
      T_RISKID: T_RISKID,
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
      T_RISK_COMMUNICATION: T_RISK_COMMUNICATION,
      T_RISK_OWNER: T_RISK_OWNER,
      T_CREATEDBY: T_CREATEDBY,
      T_PLANT_CD: plantCode,
      T_COMP_CD: compCode,
      T_REVIEWER_ONE: REVIEWER_ONE,
      T_REVIEWER_ONE_COMMENT: T_REVIEWER_ONE_COMMENT,
      T_REVIEWER_TWO: REVIEWER_TWO,
      T_REVIEWER_TWO_COMMENT: T_REVIEWER_TWO_COMMENT,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateshematrixdetailsdata = async (
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
) => {
  try {
    var T_RISKID = T_RISKID;
    var T_HAZARDOUS_EVENT = T_HAZARDOUS_EVENT;
    var T_CAUSE = T_CAUSE;
    var T_CONSEQUNCE_IMPACT = T_CONSEQUNCE_IMPACT;
    var T_PEOPLE_ASSET = T_PEOPLE_ASSET;
    var T_EXISTING_SAFEGUARD = T_EXISTING_SAFEGUARD;
    var T_CONSEQUENCES = T_CONSEQUENCES;
    var T_PROBABILITY_OCCURANCE = T_PROBABILITY_OCCURANCE;
    var T_RISK = T_RISK;
    var T_RECOMMENDATION_REDUCING = T_RECOMMENDATION_REDUCING;
    var T_RESIDUAL_PROBABILITY = T_RESIDUAL_PROBABILITY;
    var T_RESIDUAL_CONSEQUENCES = T_RESIDUAL_CONSEQUENCES;
    var T_RESIDUAL_RISK = T_RESIDUAL_RISK;
    var T_RISK_OWNER = T_RISK_OWNER;
    var T_RISK_COMMUNICATION = T_RISK_COMMUNICATION;
    var T_CREATEDBY = T_CREATEDBY;
    var T_CHANGE_COLUMN = T_CHANGE_COLUMN;
    var plantCode = plantCode;
    var compCode = compCode;
    var REVIEWER_ONE = REVIEWER_ONE;
    var T_REVIEWER_ONE_COMMENT = T_REVIEWER_ONE_COMMENT;
    var REVIEWER_TWO = REVIEWER_TWO;
    var T_REVIEWER_TWO_COMMENT = T_REVIEWER_TWO_COMMENT;
    const sql = `   

       insert into  LDPDBA.T_SHE_RISK_DTL(T_RISKID,T_HAZARDOUS_EVENT,T_CAUSE,T_CONSEQUNCE_IMPACT,T_PEOPLE_ASSET,T_EXISTING_SAFEGUARD,
        T_CONSEQUENCES, T_PROBABILITY_OCCURANCE,T_RISK,T_RECOMMENDATION_REDUCING,T_RESIDUAL_PROBABILITY,T_RESIDUAL_CONSEQUENCES,
        T_RESIDUAL_RISK,T_RISK_COMMUNICATION,T_RISK_OWNER,T_VERSION,T_CHANGE_COLUMN,T_CREATEDBY,T_CREATEDDATE,T_PLANT_CD,T_COMP_CD,
        T_REVIEWER_ONE, T_REVIEWER_ONE_COMMENT,T_REVIEWER_TWO,T_REVIEWER_TWO_COMMENT)
select distinct :T_RISKID,:T_HAZARDOUS_EVENT,:T_CAUSE,:T_CONSEQUNCE_IMPACT,:T_PEOPLE_ASSET,:T_EXISTING_SAFEGUARD,
  :T_CONSEQUENCES, :T_PROBABILITY_OCCURANCE,:T_RISK,:T_RECOMMENDATION_REDUCING,:T_RESIDUAL_PROBABILITY,:T_RESIDUAL_CONSEQUENCES,
  :T_RESIDUAL_RISK,:T_RISK_COMMUNICATION,:T_RISK_OWNER,( select (max(T_VERSION)+1) from  LDPDBA.T_SHE_RISK_DTL where T_RISKID=:T_RISKID   )
  ,:T_CHANGE_COLUMN,:T_CREATEDBY,sysdate,:T_PLANT_CD,:T_COMP_CD,:T_REVIEWER_ONE,:T_REVIEWER_ONE_COMMENT,:T_REVIEWER_TWO,:T_REVIEWER_TWO_COMMENT
   from  LDPDBA.T_SHE_RISK_DTL  
    
                   `;
    const binds = {
      T_RISKID: T_RISKID,
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
      T_RISK_COMMUNICATION: T_RISK_COMMUNICATION,
      T_RISK_OWNER: T_RISK_OWNER,
      T_CREATEDBY: T_CREATEDBY,
      T_CHANGE_COLUMN: T_CHANGE_COLUMN,
      T_PLANT_CD: plantCode,
      T_COMP_CD: compCode,
      T_REVIEWER_ONE: REVIEWER_ONE,
      T_REVIEWER_ONE_COMMENT: T_REVIEWER_ONE_COMMENT,
      T_REVIEWER_TWO: REVIEWER_TWO,
      T_REVIEWER_TWO_COMMENT: T_REVIEWER_TWO_COMMENT,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//check she matrix residual risk chart gross residual risk data
export const getSHEMatrixChartData = async (
  division: any,
  department: any,
  section: any,
  CONSEQ: any,
  Prob_Occur: any,
  plantcd: any,
  compCode: any,
  riskOwner: any
) => {
  try {
    let str = ``;
    if (division.length == 0 && department.length == 0) {
      str += ` and 1=1 `;
    }
    if (division.length > 0 && department.length == 0) {
      str += ` and a.T_DIVISION='${division}' `;
    }
    if (division.length > 0 && department.length > 0 && section.length == 0) {
      str += ` and a.T_DIVISION='${division}'  and a.T_DEPARTMENT='${department}'  `;
    }
    if (division.length > 0 && department.length > 0 && section.length > 0) {
      str += ` and a.T_DIVISION='${division}'  and a.T_DEPARTMENT='${department}' and a.T_SECTION='${section}' `;
    }

    if (riskOwner.length > 0) {
      str += ` and b.T_RISK_OWNER='${riskOwner}' `;
    }
    var sql = `SELECT count(T_RISK) Tcount
      FROM  LDPDBA.T_SHE_RISK_MST a join   LDPDBA.T_SHE_RISK_DTL b on a.T_RiskID=b.T_RiskID
      where  a.T_ACTIVE=1 and A.T_RISK_APPRV_STATUS='Y'
      and b.T_CONSEQUENCES=:T_CONSEQUENCES AND b.T_PROBABILITY_OCCURANCE=:T_PROBABILITY_OCCURANCE 
      and b.T_VERSION=(select max(c.T_Version) from  LDPDBA.T_SHE_RISK_DTL c where c.T_RiskID=b.T_RiskID)
      and a.T_PLANT_CD=:plantCode  and a.T_COMP_CD=:compCode ${str} `;
    var binds = {
      T_CONSEQUENCES: CONSEQ,
      T_PROBABILITY_OCCURANCE: Prob_Occur,
      plantCode: plantcd,
      compCode: compCode,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//check she matrix chart gross risk data
export const getSHEMatrixresidualChartData = async (
  division: any,
  department: any,
  section: any,
  CONSEQ: any,
  Prob_Occur: any,
  plantcd: any,
  compCode: any,
  riskOwner: any
) => {
  try {
    let str = ``;
    if (division.length == 0 && department.length == 0) {
      str += ` and 1=1 `;
    }
    if (division.length > 0 && department.length == 0) {
      str += ` and a.T_DIVISION='${division}' `;
    }
    if (division.length > 0 && department.length > 0 && section.length == 0) {
      str += ` and a.T_DIVISION='${division}'  and a.T_DEPARTMENT='${department}'  `;
    }
    if (division.length > 0 && department.length > 0 && section.length > 0) {
      str += ` and a.T_DIVISION='${division}'  and a.T_DEPARTMENT='${department}' and a.T_SECTION='${section}' `;
    }
    if (riskOwner.length > 0) {
      str += ` and b.T_RISK_OWNER='${riskOwner}' `;
    }
    var sql = `SELECT count(T_RESIDUAL_RISK) Tcount
      FROM  LDPDBA.T_SHE_RISK_MST a join   LDPDBA.T_SHE_RISK_DTL b on a.T_RiskID=b.T_RiskID
      where  a.T_ACTIVE=1 and A.T_RISK_APPRV_STATUS='Y'
      and b.T_RESIDUAL_CONSEQUENCES=:T_CONSEQUENCES AND b.T_RESIDUAL_PROBABILITY=:T_PROBABILITY_OCCURANCE 
      and b.T_VERSION=(select max(c.T_Version) from  LDPDBA.T_SHE_RISK_DTL c where c.T_RiskID=b.T_RiskID)
      and a.T_PLANT_CD=:plantCode  and a.T_COMP_CD=:compCode ${str} `;
    var binds = {
      T_CONSEQUENCES: CONSEQ,
      T_PROBABILITY_OCCURANCE: Prob_Occur,
      plantCode: plantcd,
      compCode: compCode,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//GET PENDINGSHE MatrixDetails
export const GETPENDINGSHEMatrixDetails = async (
  plantcd: any,
  compCode: any,
  Approver: any,
  section: any,
  Actiontype: any
) => {
  try {
    var status = "";
    if (Actiontype == "Reject") {
      status = "X";
    }
    if (Actiontype == "Return") {
      status = "R";
    }
    if (Actiontype == "Pending") {
      status = "P";
    }
    let str = ``;
    if (section.length == 0 && Actiontype.length == 0) {
      str += ` and a.T_RISK_APPRV_STATUS in('P' ,'R','X') `;
    }
    if (section.length > 0) {
      str += ` and a.T_SECTION='${section}' `;
    }
    if (Actiontype.length > 0) {
      str += ` and a.T_RISK_APPRV_STATUS='${status}'  `;
    }
    var sql = ` 
                    select a.T_DIVISION ,a.T_DEPARTMENT  ,a.T_SECTION ,a.T_LINE_AREA,a.T_JOB  ,a.T_ACTIVITY ,
                    a.T_RISKID ,a.T_HAZARD ,(case when  a.T_RISK_APPRV_STATUS='P' then 'Pending' 
                    when a.T_RISK_APPRV_STATUS='A' then 'Approved' 
                    when a.T_RISK_APPRV_STATUS='X' then 'Rejected' 
                    when a.T_RISK_APPRV_STATUS='R' then 'Returned' end) T_RISK_APPRV_STATUS,a. T_RISK_APPRV_COMMENT
                  ,b.T_HAZARDOUS_EVENT,T_CAUSE,T_CONSEQUNCE_IMPACT,T_PEOPLE_ASSET,T_EXISTING_SAFEGUARD,T_CONSEQUENCES,T_PROBABILITY_OCCURANCE, T_RISK,  
                  T_RECOMMENDATION_REDUCING,T_RESIDUAL_PROBABILITY , T_RESIDUAL_CONSEQUENCES ,T_RESIDUAL_RISK,
                    b.T_RISK_OWNER ,
                  (select distinct (T_OWNER_PERSONALNO||'-'||T_OWNER_NAME) T_OWNER_PERSONALNO from  LDPDBA.T_SHE_RISK_OWNER where T_OWNER_PERSONALNO=b.T_RISK_OWNER and T_RISKID=b.T_RISKID) T_RISK_OWNERNEW ,
                    T_RISK_COMMUNICATION ,T_VERSION ,
                  T_CHANGE_COLUMN, T_REVIEWER_ONE_COMMENT, T_REVIEWER_ONE, T_REVIEWER_TWO_COMMENT, T_REVIEWER_TWO ,
                  (select distinct TSA_OWNER from  LDPDBA.T_she_risk_Aprv where TSA_TYPE='RiskApprover' 
                  and TSA_DEPARTMENT=a.T_DEPARTMENT and TSA_SECTION=a.T_SECTION 
                  and TSA_DIVISION=a.T_DIVISION and TSA_ACTIVE='Y' and ROWNUM=1 and TSA_PLANT_CD=:plantcd and TSA_COMPANY_CD=:compcode) IL3OFFICER
                from  LDPDBA.T_SHE_RISK_MST a left join  LDPDBA.T_SHE_RISK_DTL b on a.T_RISKID=b.T_RISKID                
                  where  a.T_PLANT_CD=:plantcd and  a.T_COMP_CD=:compcode and a.T_Active='1' --and a.T_RISK_APPRV_STATUS in('P' ,'R')
                and ( a.T_DEPARTMENT in(
                          select distinct TSA_DEPARTMENT from  LDPDBA.T_she_risk_Aprv where TSA_DIVISION=a.T_DIVISION and TSA_DEPARTMENT=a.T_DEPARTMENT 
                          and  TSA_SECTION = a.T_SECTION and TSA_OWNER=:Approver  and TSA_COMPANY_CD=:compcode and TSA_PLANT_CD=:plantcd and TSA_TYPE='RiskApprover'
                       )
                       or b.T_RISK_OWNER=:Approver
                      )
                and T_VERSION=(
                  select max(T_VERSION) from  LDPDBA.T_SHE_RISK_DTL where T_RISKID=b.T_RISKID
                  )  ${str} 
        `;
    var binds = {
      plantcd: plantcd,
      compcode: compCode,
      Approver: Approver,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//GET PENDING Residual DCI Approval SHE MatrixDetails
export const GETPENDINGResidualSHEMatrixDetails = async (
  plantcd: any,
  compCode: any,
  Approver: any
) => {
  try {
    var sql = ` 
                  select a.T_DIVISION ,a.T_DEPARTMENT  ,a.T_SECTION ,a.T_LINE_AREA,a.T_JOB  ,a.T_ACTIVITY ,
                  a.T_RISKID ,a.T_HAZARD ,(case when  c.T_STATUS='P' then 'Pending' when c.T_STATUS='A' then 'Appeoved'
                  when c.T_STATUS='R' then 'Rejected' end) T_RISK_APPRV_STATUS,c.T_REMARKS  T_RISK_APPRV_COMMENT
                ,b.T_HAZARDOUS_EVENT,b.T_CAUSE,b.T_CONSEQUNCE_IMPACT,b.T_PEOPLE_ASSET,b.T_EXISTING_SAFEGUARD,b.T_CONSEQUENCES,b.T_PROBABILITY_OCCURANCE,b.T_RISK,  
                b.T_RECOMMENDATION_REDUCING,c.T_RESIDUAL_PROBABILITY ,c.T_RESIDUAL_CONSEQUENCES ,c.T_RESIDUAL_RISK,
                  b.T_RISK_OWNER ,
                (select distinct (T_OWNER_PERSONALNO||'-'||T_OWNER_NAME) T_OWNER_PERSONALNO from  LDPDBA.T_SHE_RISK_OWNER where T_OWNER_PERSONALNO=b.T_RISK_OWNER and T_RISKID=b.T_RISKID) T_RISK_OWNERNEW ,
                 b.T_RISK_COMMUNICATION ,b.T_VERSION ,
                b.T_CHANGE_COLUMN, b.T_REVIEWER_ONE_COMMENT, b.T_REVIEWER_ONE,b.T_REVIEWER_TWO_COMMENT, b.T_REVIEWER_TWO ,b.T_SHE_RISK_FILE 
              from  LDPDBA.T_SHE_RISK_MST a left join  LDPDBA.T_SHE_RISK_DTL b on a.T_RISKID=b.T_RISKID                
                 join  LDPDBA.T_SHE_RESIDUAL_RISK_TRANSCTION c on b.T_RISKID=c.T_RISKID
                where  a.T_PLANT_CD=:plantcd and  a.T_COMP_CD=:compcode and a.T_Active='1' 
                and c.T_STATUS in('P','R')
              and ( a.T_DEPARTMENT in(
                        select distinct TSA_DEPARTMENT from  LDPDBA.T_she_risk_Aprv where TSA_DIVISION=a.T_DIVISION and TSA_DEPARTMENT=a.T_DEPARTMENT 
                        and  TSA_SECTION = a.T_SECTION and TSA_OWNER=:Approver  and TSA_COMPANY_CD=:compcode and TSA_PLANT_CD=:plantcd and TSA_TYPE='DCIApprover'
                     )
                     or b.T_RISK_OWNER=:Approver
                    )
              and b.T_VERSION=(
                select max(T_VERSION) from  LDPDBA.T_SHE_RISK_DTL where T_RISKID=b.T_RISKID
                )
              and c.T_CREATEDDATE in(
                  select max(T_CREATEDDATE) from  LDPDBA.T_SHE_RESIDUAL_RISK_TRANSCTION  where T_RISKID=b.T_RISKID
                )     
               
      `;
    var binds = {
      plantcd: plantcd,
      compcode: compCode,
      Approver: Approver,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getALLSHEMatrixDetails = async (plantcd: any, compCode: any) => {
  try {
    const sql = ` select distinct a.T_RISK_APPRV_STATUS, a.T_DIVISION ,a.T_DEPARTMENT  ,a.T_SECTION ,a.T_LINE_AREA,a.T_JOB  ,a.T_ACTIVITY ,
                      a.T_RISKID ,a.T_HAZARD 
                    ,b.T_HAZARDOUS_EVENT,T_CAUSE,T_CONSEQUNCE_IMPACT,T_PEOPLE_ASSET,T_EXISTING_SAFEGUARD,T_CONSEQUENCES,T_PROBABILITY_OCCURANCE, T_RISK,  
                    T_RECOMMENDATION_REDUCING,T_RESIDUAL_PROBABILITY , T_RESIDUAL_CONSEQUENCES ,T_RESIDUAL_RISK,
                    b.T_RISK_OWNER ,
                    --(select distinct T_OWNER_PERSONALNO from  LDPDBA.T_SHE_RISK_OWNER where T_OWNER_PERSONALNO=b.T_RISK_OWNER) T_RISK_OWNER ,
                    T_RISK_COMMUNICATION ,T_VERSION 
                    from  LDPDBA.T_SHE_RISK_MST a  join  LDPDBA.T_SHE_RISK_DTL b on a.T_RISKID=b.T_RISKID                
                    where  a.T_Active='1' and a.T_PLANT_CD=:plantcd and  a.T_COMP_CD=:compcode and a.T_RISK_APPRV_STATUS='Y' 
                    and T_VERSION=(
                    select max(T_VERSION) from  LDPDBA.T_SHE_RISK_DTL where T_RISKID=b.T_RISKID
                    )
                    order by a.T_DEPARTMENT, a.T_RISKID
                 `;
    var binds = {
      plantcd: plantcd,
      compcode: compCode,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateapprovalshematrixdetailsdata = async (
  T_RISKID: any,
  T_RISK_APPRV_COMMENT: any,
  T_RISK_APPRV_STATUS: any,
  T_CREATEDBY: any,
  plantCode: any,
  compCode: any
) => {
  try {
    var status = "";

    if (T_RISK_APPRV_STATUS == "Reject") {
      status = "X";
    }
    if (T_RISK_APPRV_STATUS == "Return") {
      status = "R";
    }
    if (T_RISK_APPRV_STATUS == "Approve") {
      status = "Y";
    }
    var sql = `
    UPDATE   LDPDBA.T_SHE_RISK_MST 
       SET  T_APPROVED_DATE=sysdate ,
            T_RISK_APPRV_COMMENT=:T_RISK_APPRV_COMMENT,
            T_RISK_APPRV_STATUS=:T_RISK_APPRV_STATUS,
            T_RISK_APPRVED_BY=:T_CREATEDBY
     where T_RISKID=:T_RISKID and T_PLANT_CD=:plantCode   and T_COMP_CD=:compCode  `;

    var sqlhist = `   insert into  LDPDBA.T_RISK_APPROVER_ACTIVITY(TRAC_RISKID,TRAC_STATUS,TRAC_CREATEDON, 
                                  TRAC_CREATEDBY,TRAC_PLANTCD,TRAC_COMPANYCD,TRAC_APPRV_COMMENT)
        values(:T_RISKID,:T_RISK_APPRV_STATUS,sysdate,:T_CREATEDBY,:plantCode,:compCode,
          :T_RISK_APPRV_COMMENT )`;
    const binds = {
      T_RISKID: T_RISKID,
      T_RISK_APPRV_COMMENT: T_RISK_APPRV_COMMENT,
      T_RISK_APPRV_STATUS: status,
      T_CREATEDBY: T_CREATEDBY,
      plantCode: plantCode,
      compCode: compCode,
    };
    await Query.executeQuery(sql, binds);
    return await Query.executeQuery(sqlhist, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const updateDCIapprovalshematrixdetailsdata = async (
  T_RISKID: any,
  T_RISK_APPRV_COMMENT: any,
  T_RISK_APPRV_STATUS: any,
  T_CREATEDBY: any,
  plantCode: any,
  compCode: any,
  T_RESIDUAL_PROBABILITY: any,
  T_RESIDUAL_CONSEQUENCES: any,
  T_RESIDUAL_RISK: any
) => {
  try {
    var status = "";

    if (T_RISK_APPRV_STATUS == "Reject") {
      status = "R";
    } else {
      status = "Y";
    }
    var sql = `
    UPDATE   LDPDBA.T_SHE_RESIDUAL_RISK_TRANSCTION 
       SET  T_UPDATEDDATE=sysdate ,
            T_REMARKS=:T_RISK_APPRV_COMMENT,
            T_STATUS=:T_RISK_APPRV_STATUS,
            T_UPDATEDBY=:T_CREATEDBY
      where T_RISKID=:T_RISKID and T_PLANTCD=:plantCode  and T_COMPCD=:compCode  `;
    if (status == "Y") {
      var sqlhist = `   UPDATE   LDPDBA.T_she_risk_dtl  
                        SET  T_RESIDUAL_RISK=(select T_RESIDUAL_RISK from  LDPDBA.T_SHE_RESIDUAL_RISK_TRANSCTION 
                        where T_RISKID=:T_RISKID and T_CREATEDDATE in(
                                      select max(T_CREATEDDATE) from  LDPDBA.T_SHE_RESIDUAL_RISK_TRANSCTION  
                                      where T_RISKID=:T_RISKID and T_PLANTCD=:plantCode  and T_COMPCD=:compCode)) ,
                              T_RESIDUAL_CONSEQUENCES=(select T_RESIDUAL_CONSEQUENCES from  LDPDBA.T_SHE_RESIDUAL_RISK_TRANSCTION  where T_RISKID=:T_RISKID and T_CREATEDDATE in(
                  select max(T_CREATEDDATE) from  LDPDBA.T_SHE_RESIDUAL_RISK_TRANSCTION  where T_RISKID=:T_RISKID and T_PLANTCD=:plantCode  and T_COMPCD=:compCode
                  )) ,
                              T_RESIDUAL_PROBABILITY=(select T_RESIDUAL_PROBABILITY from  LDPDBA.T_SHE_RESIDUAL_RISK_TRANSCTION  where T_RISKID=:T_RISKID and T_CREATEDDATE in(
                  select max(T_CREATEDDATE) from  LDPDBA.T_SHE_RESIDUAL_RISK_TRANSCTION  where T_RISKID=:T_RISKID and T_PLANTCD=:plantCode  and T_COMPCD=:compCode
                  ))                      
                        where T_RISKID=:T_RISKID and T_PLANT_CD=:plantCode
                          and T_COMP_CD=:compCode
                          and T_VERSION=(
                  select max(T_VERSION) from  LDPDBA.T_SHE_RISK_DTL where T_RISKID=:T_RISKID
                  )  
                    `;
      const finalbinds = {
        T_RISKID: T_RISKID,
        // T_RESIDUAL_RISK:T_RESIDUAL_RISK,
        // T_RESIDUAL_CONSEQUENCES:T_RESIDUAL_CONSEQUENCES,
        // T_RESIDUAL_PROBABILITY:T_RESIDUAL_PROBABILITY,
        plantCode: plantCode,
        compCode: compCode,
      };
      await Query.executeQuery(sqlhist, finalbinds);
    }
    const binds = {
      T_RISKID: T_RISKID,
      T_RISK_APPRV_COMMENT: T_RISK_APPRV_COMMENT,
      T_RISK_APPRV_STATUS: status,
      T_CREATEDBY: T_CREATEDBY,
      plantCode: plantCode,
      compCode: compCode,
    };

    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//check previous risk master entry
export const getPrevRiskID = async (
  Division: any,
  Department: any,
  Section: any,
  Line: any,
  Job: any,
  Activity: any,
  Hazard: any,
  plantcd: any,
  Company: any
) => {
  try {
    const sql = ` SELECT T_RISKID 
    FROM  LDPDBA.T_SHE_RISK_MST 
    WHERE  T_DIVISION=:T_DIVISION and T_DEPARTMENT=:T_DEPARTMENT and T_SECTION=:T_SECTION
    and T_JOB=:T_JOB and  T_ACTIVITY=:T_ACTIVITY  and  T_HAZARD=:T_HAZARD 
    and T_PLANT_CD=:plantcd and T_COMP_CD=:Company and T_ACTIVE='1' and T_RISK_APPRV_STATUS!='R' `;
    var binds = {
      T_DIVISION: Division,
      T_DEPARTMENT: Department,
      T_SECTION: Section,
      T_JOB: Job,
      T_ACTIVITY: Activity,
      T_HAZARD: Hazard,
      plantcd: plantcd,
      Company: Company,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//get max risk id
export const getmaxRiskID = async (
  Division: any,
  Department: any,
  Section: any,
  plantcd: any,
  Company: any
) => {
  try {
    const sql = `select distinct SUBSTR(T_RISKID,1,6)||LPAD(max(SUBSTR(T_RISKID,7,4))+1,4,'0')  RiskID  from 
                     LDPDBA.T_SHE_RISK_MST    
                     WHERE  T_DIVISION=:Division and T_DEPARTMENT=:Department 
                            and T_PLANT_CD=:plantcd and T_COMP_CD=:Company 
                    group by SUBSTR(T_RISKID,1,6) `;
    var binds = {
      Division: Division,
      Department: Department,
      plantcd: plantcd,
      Company: Company,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
// get user details
export const UserDetailsByPersonalNumber = async (riskOwner: any) => {
  try {
    const sql = ` BEGIN 
    :ls_results := LDPDBA.F_GET_USERDETAIL(
      :riskOwner
      );
    END; `;
    const binds = {
      riskOwner: riskOwner,
      ls_results: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const insertSHEMatrixData = async (
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
) => {
  try {
    var Division = Division;
    var Department = Department;
    var Section = Section;
    var Line = Line;
    var Job = Job;
    var Activity = Activity;
    var Hazard = Hazard;
    var plantcd = plantcd;
    var Company = Company;
    var CreatedBy = CreatedBy;
    var RiskID = RiskID;
    const sql = ` INSERT INTO  LDPDBA.T_SHE_RISK_MST(T_DIVISION, T_DEPARTMENT, T_SECTION, T_LINE_AREA, T_JOB,
                     T_ACTIVITY,
                   T_RISKID, T_PLANT_CD, T_COMP_CD, T_HAZARD,T_CREATEDBY,T_CREATEDDATE,T_ACTIVE)
                    SELECT distinct :T_DIVISION, :T_DEPARTMENT, :T_SECTION, :T_LINE_AREA, :T_JOB, 
                    :T_ACTIVITY,:T_RISKID, :T_PLANT_CD, :T_COMP_CD, :T_HAZARD,:T_CREATEDBY,sysdate ,'1'    
                      FROM  LDPDBA.T_SHE_RISK_MST 
                      WHERE NOT EXISTS 
                      (SELECT NULL 
                      FROM  LDPDBA.T_SHE_RISK_MST 
                      WHERE  T_DIVISION=:T_DIVISION and T_DEPARTMENT=:T_DEPARTMENT and T_SECTION=:T_SECTION
                      and T_JOB=:T_JOB and  T_ACTIVITY=:T_ACTIVITY and T_HAZARD=:T_HAZARD
                       and T_PLANT_CD=:T_PLANT_CD and T_COMP_CD=:T_COMP_CD and T_ACTIVE='1' and T_RISK_APPRV_STATUS!='R'                                                          
                      )  
                      `;
    const binds = {
      T_DIVISION: Division,
      T_DEPARTMENT: Department,
      T_SECTION: Section,
      T_LINE_AREA: Line,
      T_JOB: Job,
      T_ACTIVITY: Activity,
      T_RISKID: RiskID,
      T_HAZARD: Hazard,
      T_CREATEDBY: CreatedBy,
      T_PLANT_CD: plantcd,
      T_COMP_CD: Company,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertshematrixdetailsdata = async (
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
) => {
  try {
    var T_RISKID = T_RISKID;
    var T_HAZARDOUS_EVENT = T_HAZARDOUS_EVENT;
    var T_CAUSE = T_CAUSE;
    var T_CONSEQUNCE_IMPACT = T_CONSEQUNCE_IMPACT;
    var T_PEOPLE_ASSET = T_PEOPLE_ASSET;
    var T_EXISTING_SAFEGUARD = T_EXISTING_SAFEGUARD;
    var T_CONSEQUENCES = T_CONSEQUENCES;
    var T_PROBABILITY_OCCURANCE = T_PROBABILITY_OCCURANCE;
    var T_RISK = T_RISK;
    var T_RECOMMENDATION_REDUCING = T_RECOMMENDATION_REDUCING;
    var T_RESIDUAL_PROBABILITY = T_RESIDUAL_PROBABILITY;
    var T_RESIDUAL_CONSEQUENCES = T_RESIDUAL_CONSEQUENCES;
    var T_RESIDUAL_RISK = T_RESIDUAL_RISK;
    var T_RISK_OWNER = T_RISK_OWNER;
    var T_RISK_COMMUNICATION = T_RISK_COMMUNICATION;
    var T_CREATEDBY = T_CREATEDBY;
    var plantCode = plantCode;
    var compCode = compCode;
    var REVIEWER_ONE = REVIEWER_ONE;
    var REVIEWER_TWO = REVIEWER_TWO;

    const binds = {
      T_RISKID: T_RISKID,
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
      T_RISK_COMMUNICATION: T_RISK_COMMUNICATION,
      T_RISK_OWNER: T_RISK_OWNER,
      T_CREATEDBY: T_CREATEDBY,
      T_PLANT_CD: plantCode,
      T_COMP_CD: compCode,
      T_REVIEWER_ONE: REVIEWER_ONE,
      T_REVIEWER_TWO: REVIEWER_TWO,
    };
    const dataSql = await Query.executeQuery(
      `select distinct :T_RISKID,:T_HAZARDOUS_EVENT,:T_CAUSE,:T_CONSEQUNCE_IMPACT,:T_PEOPLE_ASSET,:T_EXISTING_SAFEGUARD,
             :T_CONSEQUENCES, :T_PROBABILITY_OCCURANCE,:T_RISK,:T_RECOMMENDATION_REDUCING,:T_RESIDUAL_PROBABILITY,:T_RESIDUAL_CONSEQUENCES,
             :T_RESIDUAL_RISK,:T_RISK_COMMUNICATION,:T_RISK_OWNER,1,:T_CREATEDBY,sysdate,:T_PLANT_CD,:T_COMP_CD,:T_REVIEWER_ONE,:T_REVIEWER_TWO
             from  LDPDBA.T_SHE_RISK_DTL`,
      binds
    );
    console.log(dataSql);
    let sql = ``;
    if (!(dataSql?.rows?.length > 0)) {
      sql = `insert into  LDPDBA.T_SHE_RISK_DTL(T_RISKID,T_HAZARDOUS_EVENT,T_CAUSE,T_CONSEQUNCE_IMPACT,T_PEOPLE_ASSET,T_EXISTING_SAFEGUARD,
            T_CONSEQUENCES, T_PROBABILITY_OCCURANCE,T_RISK,T_RECOMMENDATION_REDUCING,T_RESIDUAL_PROBABILITY,T_RESIDUAL_CONSEQUENCES,
            T_RESIDUAL_RISK,T_RISK_COMMUNICATION,T_RISK_OWNER,T_VERSION,T_CREATEDBY,T_CREATEDDATE,T_PLANT_CD,T_COMP_CD,
            T_REVIEWER_ONE, T_REVIEWER_TWO)
            values (:T_RISKID,:T_HAZARDOUS_EVENT,:T_CAUSE,:T_CONSEQUNCE_IMPACT,:T_PEOPLE_ASSET,:T_EXISTING_SAFEGUARD,
             :T_CONSEQUENCES, :T_PROBABILITY_OCCURANCE,:T_RISK,:T_RECOMMENDATION_REDUCING,:T_RESIDUAL_PROBABILITY,:T_RESIDUAL_CONSEQUENCES,
             :T_RESIDUAL_RISK,:T_RISK_COMMUNICATION,:T_RISK_OWNER,1,:T_CREATEDBY,sysdate,:T_PLANT_CD,:T_COMP_CD,:T_REVIEWER_ONE,:T_REVIEWER_TWO)
            `;
    } else {
      sql = `insert into  LDPDBA.T_SHE_RISK_DTL(T_RISKID,T_HAZARDOUS_EVENT,T_CAUSE,T_CONSEQUNCE_IMPACT,T_PEOPLE_ASSET,T_EXISTING_SAFEGUARD,
            T_CONSEQUENCES, T_PROBABILITY_OCCURANCE,T_RISK,T_RECOMMENDATION_REDUCING,T_RESIDUAL_PROBABILITY,T_RESIDUAL_CONSEQUENCES,
            T_RESIDUAL_RISK,T_RISK_COMMUNICATION,T_RISK_OWNER,T_VERSION,T_CREATEDBY,T_CREATEDDATE,T_PLANT_CD,T_COMP_CD,
            T_REVIEWER_ONE, T_REVIEWER_TWO)
          
        
             select distinct :T_RISKID,:T_HAZARDOUS_EVENT,:T_CAUSE,:T_CONSEQUNCE_IMPACT,:T_PEOPLE_ASSET,:T_EXISTING_SAFEGUARD,
             :T_CONSEQUENCES, :T_PROBABILITY_OCCURANCE,:T_RISK,:T_RECOMMENDATION_REDUCING,:T_RESIDUAL_PROBABILITY,:T_RESIDUAL_CONSEQUENCES,
             :T_RESIDUAL_RISK,:T_RISK_COMMUNICATION,:T_RISK_OWNER,1,:T_CREATEDBY,sysdate,:T_PLANT_CD,:T_COMP_CD,:T_REVIEWER_ONE,:T_REVIEWER_TWO
             from  LDPDBA.T_SHE_RISK_DTL    
            
     
                   `;
    }
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//Update rejected Risk Details by risk ID
export const UpdateSHEMatrixRejectedData = async (
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
) => {
  try {
    var T_RISKID = T_RISKID;
    var T_HAZARDOUS_EVENT = T_HAZARDOUS_EVENT;
    var T_CAUSE = T_CAUSE;
    var T_CONSEQUNCE_IMPACT = T_CONSEQUNCE_IMPACT;
    var T_PEOPLE_ASSET = T_PEOPLE_ASSET;
    var T_EXISTING_SAFEGUARD = T_EXISTING_SAFEGUARD;
    var T_CONSEQUENCES = T_CONSEQUENCES;
    var T_PROBABILITY_OCCURANCE = T_PROBABILITY_OCCURANCE;
    var T_RISK = T_RISK;
    var T_RECOMMENDATION_REDUCING = T_RECOMMENDATION_REDUCING;
    var T_RESIDUAL_PROBABILITY = T_RESIDUAL_PROBABILITY;
    var T_RESIDUAL_CONSEQUENCES = T_RESIDUAL_CONSEQUENCES;
    var T_RESIDUAL_RISK = T_RESIDUAL_RISK;
    var T_RISK_OWNER = T_RISK_OWNER;
    var T_RISK_COMMUNICATION = T_RISK_COMMUNICATION;
    var T_CREATEDBY = T_CREATEDBY;
    var plantCode = plantCode;
    var compCode = compCode;
    var REVIEWER_ONE = REVIEWER_ONE;
    var REVIEWER_TWO = REVIEWER_TWO;

    const sql = ` 
      Update  LDPDBA.T_SHE_RISK_DTL 
      set T_HAZARDOUS_EVENT=:T_HAZARDOUS_EVENT,
      T_CAUSE=:T_CAUSE ,
      T_CONSEQUNCE_IMPACT=:T_CONSEQUNCE_IMPACT, 
      T_PEOPLE_ASSET=:T_PEOPLE_ASSET,
      T_EXISTING_SAFEGUARD=:T_EXISTING_SAFEGUARD,
      T_CONSEQUENCES=:T_CONSEQUENCES,
      T_PROBABILITY_OCCURANCE=:T_PROBABILITY_OCCURANCE,
      T_RISK=:T_RISK,
      T_RECOMMENDATION_REDUCING=:T_RECOMMENDATION_REDUCING,
      T_RESIDUAL_PROBABILITY=:T_PROBABILITY_OCCURANCE,
      T_RESIDUAL_CONSEQUENCES=:T_CONSEQUENCES,
      T_RESIDUAL_RISK=:T_RISK,
      T_RISK_COMMUNICATION=:T_RISK_COMMUNICATION,
      T_RISK_OWNER=:T_RISK_OWNER,
      T_CREATEDBY=:T_CREATEDBY,
      T_CREATEDDATE=sysdate    where T_RISKID=:T_RISKID 
     
      `;
    const binds = {
      T_RISKID: T_RISKID,
      T_HAZARDOUS_EVENT: T_HAZARDOUS_EVENT,
      T_CAUSE: T_CAUSE,
      T_CONSEQUNCE_IMPACT: T_CONSEQUNCE_IMPACT,
      T_PEOPLE_ASSET: T_PEOPLE_ASSET,
      T_EXISTING_SAFEGUARD: T_EXISTING_SAFEGUARD,
      T_CONSEQUENCES: T_CONSEQUENCES,
      T_PROBABILITY_OCCURANCE: T_PROBABILITY_OCCURANCE,
      T_RISK: T_RISK,
      T_RECOMMENDATION_REDUCING: T_RECOMMENDATION_REDUCING,
      T_RISK_COMMUNICATION: T_RISK_COMMUNICATION,
      T_RISK_OWNER: T_RISK_OWNER,
      T_CREATEDBY: T_CREATEDBY,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
//check previously defined data
export const checkRiskApprover = async (
  Division: any,
  Department: any,
  Section: any,
  userId: any,
  plantcd: any,
  Company: any
) => {
  try {
    const sql = `select distinct TSA_OWNER from  LDPDBA.T_she_risk_Aprv 
    where TSA_DIVISION=:TSA_DIVISION and TSA_DEPARTMENT=:TSA_DEPARTMENT
                          and  TSA_SECTION =:TSA_SECTION and TSA_OWNER=:TSA_OWNER 
                           and TSA_COMPANY_CD=:TSA_COMPANY_CD and TSA_PLANT_CD=:TSA_PLANT_CD
                          and TSA_TYPE='RiskApprover' `;
    var binds = {
      TSA_DIVISION: Division,
      TSA_DEPARTMENT: Department,
      TSA_SECTION: Section,
      TSA_OWNER: userId,
      TSA_COMPANY_CD: Company,
      TSA_PLANT_CD: plantcd,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
//check DCI Approver defined data
export const checkDCIRiskApprover = async (
  Division: any,
  Department: any,
  Section: any,
  userId: any,
  plantcd: any,
  Company: any
) => {
  try {
    const sql = `select distinct TSA_OWNER from  LDPDBA.T_she_risk_Aprv 
   where TSA_DIVISION=:TSA_DIVISION and TSA_DEPARTMENT=:TSA_DEPARTMENT
                         and  TSA_SECTION =:TSA_SECTION and TSA_OWNER=:TSA_OWNER 
                          and TSA_COMPANY_CD=:TSA_COMPANY_CD and TSA_PLANT_CD=:TSA_PLANT_CD
                         and TSA_TYPE='DCIApprover' `;
    var binds = {
      TSA_DIVISION: Division,
      TSA_DEPARTMENT: Department,
      TSA_SECTION: Section,
      TSA_OWNER: userId,
      TSA_COMPANY_CD: Company,
      TSA_PLANT_CD: plantcd,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const insertSHEMatrixRiskOwnerData = async (
  RiskID: any,
  plantcd: any,
  Company: any,
  RISKOWNER: any,
  EmployeeEmail: any,
  EmployeeName: any,
  CreatedBy: any
) => {
  try {
    const sql = ` 
    insert into  LDPDBA.T_she_risk_owner(T_RISKID, T_OWNER_NAME, T_OWNER_MAILID, T_OWNER_PERSONALNO, 
      CREAYEDBY, CREATEDDATE,T_PLANT_CD, T_COMP_CD)          
        
             select distinct :T_RISKID,:T_OWNER_NAME,LOWER(:T_OWNER_MAILID),:T_OWNER_PERSONALNO,:CREAYEDBY,
             sysdate,:T_PLANT_CD,:T_COMP_CD from dual
            `;
    const binds = {
      T_RISKID: RiskID,
      T_OWNER_NAME: EmployeeName,
      T_OWNER_MAILID: EmployeeEmail,
      T_OWNER_PERSONALNO: RISKOWNER,
      CREAYEDBY: CreatedBy,
      T_PLANT_CD: plantcd,
      T_COMP_CD: Company,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const UpdateRejectedSHEMatrixRiskOwnerData = async (
  RiskID: any,
  plantcd: any,
  Company: any,
  RISKOWNER: any,
  EmployeeEmail: any,
  EmployeeName: any,
  CreatedBy: any
) => {
  try {
    const sql = ` update   LDPDBA.T_she_risk_owner
                     set  T_OWNER_NAME=:T_OWNER_NAME,
                          T_OWNER_MAILID=LOWER(:T_OWNER_MAILID),
                          T_OWNER_PERSONALNO=:T_OWNER_PERSONALNO,
                          UPDATEDDATE=sysdate,
                          UPDATEBY=:CREAYEDBY
                  where T_RISKID=:T_RISKID    
                `;
    const binds = {
      T_RISKID: RiskID,
      T_OWNER_NAME: EmployeeName,
      T_OWNER_MAILID: EmployeeEmail,
      T_OWNER_PERSONALNO: RISKOWNER,
      CREAYEDBY: CreatedBy,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const updatesheriskstatus = async (RiskID: any, CreatedBy: any) => {
  try {
    const sql = ` update  LDPDBA.T_she_risk_mst 
                     SET T_RISK_APPRV_STATUS='P',                      
                         T_CREATEDDATE=sysdate,
                         T_CREATEDBY=:CREAYEDBY,
                         T_RISK_APPRV_COMMENT=''
                   WHERE T_RISKID=:T_RISKID    
                `;
    const binds = {
      T_RISKID: RiskID,
      CREAYEDBY: CreatedBy,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const updatefileforSheMatrix = async (RiskID: any, fileName: any) => {
  try {
    const sql = ` 
    Update  LDPDBA.T_SHE_RISK_DTL  set T_SHE_RISK_FILE=:T_SHE_RISK_FILE  where T_RISKID=:T_RISKID
    and T_VERSION=(select max(T_VERSION) from  LDPDBA.T_SHE_RISK_DTL where T_RISKID=:T_RISKID)
            `;
    const binds = {
      T_RISKID: RiskID,
      T_SHE_RISK_FILE: fileName,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getDefaultRiskOwner = async (
  division: any,
  department: any,
  section: any
) => {
  try {
    var sql = `select 
                        TSA_OWNER
                  from  LDPDBA.T_she_risk_Aprv where TSA_TYPE='RiskApprover' 
                  and TSA_DEPARTMENT=:t_department and TSA_SECTION=:TSA_SECTION
                  and TSA_DIVISION=:t_division and TSA_ACTIVE='Y' `;
    var binds = {
      t_division: division,
      t_department: department,
      TSA_SECTION: section,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertResidualChnagesForApproval = async (
  T_RISKID: any,
  T_RESIDUAL_PROBABILITY: any,
  T_RESIDUAL_CONSEQUENCES: any,
  T_RESIDUAL_RISK: any,
  plantCode: any,
  compCode: any,
  T_CREATEDBY: any
) => {
  try {
    const sql = ` 
      insert into  LDPDBA.T_SHE_RESIDUAL_RISK_TRANSCTION(T_RISKID, T_RESIDUAL_PROBABILITY, T_RESIDUAL_CONSEQUENCES,
        T_RESIDUAL_RISK,  T_STATUS, T_CREATEDBY,T_CREATEDDATE,T_PLANTCD ,T_COMPCD)          
          
               select distinct :T_RISKID,:T_RESIDUAL_PROBABILITY,:T_RESIDUAL_CONSEQUENCES,
               :T_RESIDUAL_RISK,'P', :T_CREATEDBY,sysdate,:T_PLANTCD,:T_COMP_CD from dual
              `;
    const binds = {
      T_RISKID: T_RISKID,
      T_RESIDUAL_PROBABILITY: T_RESIDUAL_PROBABILITY,
      T_RESIDUAL_CONSEQUENCES: T_RESIDUAL_CONSEQUENCES,
      T_RESIDUAL_RISK: T_RESIDUAL_RISK,
      T_CREATEDBY: T_CREATEDBY,
      T_PLANTCD: plantCode,
      T_COMP_CD: compCode,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getApproverSectionList = async (
  plantcd: any,
  compCode: any,
  personalno: any
) => {
  try {
    const sql = `select distinct TSA_SECTION  
                    from   LDPDBA.T_she_risk_aprv 
                    where TSA_OWNER=:personalno and TSA_PLANT_CD=:plantcd
                         and TSA_COMPANY_CD=:compCode    
                    `;
    var binds = {
      plantcd: plantcd,
      compcode: compCode,
      personalno: personalno,
    };
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const getSHEMatrixDeatilsDataListByProbandconseq = async (
  plantcd: any,
  compCode: any,
  cseq: any,
  probocc: any,
  division: any,
  department: any,
  section: any,
  rowner: any
) => {
  try {
    let str = ``;
    if (division.length == 0 && department.length == 0) {
      str += ` and 1=1 `;
    }
    if (division.length > 0 && department.length == 0) {
      str += ` and T_DIVISION='${division}' `;
    }
    if (division.length > 0 && department.length > 0 && section.length == 0) {
      str += ` and T_DIVISION='${division}'  and T_DEPARTMENT='${department}'  `;
    }
    if (division.length > 0 && department.length > 0 && section.length > 0) {
      str += ` and T_DIVISION='${division}'  and T_DEPARTMENT='${department}' and T_SECTION='${section}' `;
    }
    if (rowner && rowner.length > 0) {
      str += ` and T_RISK_OWNER='${rowner}'  `;
    }
    var sql = ` select distinct  rnk,T_RISKID,T_VERSION, T_DIVISION ,T_DEPARTMENT  ,T_SECTION ,T_LINE_AREA,T_JOB  ,T_ACTIVITY ,
      T_HAZARD ,T_HAZARDOUS_EVENT,T_CAUSE,T_CONSEQUNCE_IMPACT,T_PEOPLE_ASSET,T_EXISTING_SAFEGUARD,T_CONSEQUENCES,T_PROBABILITY_OCCURANCE, T_RISK,  
     T_RECOMMENDATION_REDUCING,T_RESIDUAL_PROBABILITY , T_RESIDUAL_CONSEQUENCES ,T_RESIDUAL_RISK,T_RISK_OWNER ,T_RISK_OWNERNEW,
       T_RISK_COMMUNICATION ,T_VERSION ,T_CHANGE_COLUMN,rnk ,T_REVIEWER_ONE_COMMENT, T_REVIEWER_ONE, T_REVIEWER_TWO_COMMENT, T_REVIEWER_TWO ,T_SHE_RISK_FILE,IL3OFFICER            
  from 	(
  select a.T_DIVISION ,a.T_DEPARTMENT  ,a.T_SECTION ,a.T_LINE_AREA,a.T_JOB  ,a.T_ACTIVITY ,
      a.T_RISKID ,a.T_HAZARD 
     ,b.T_HAZARDOUS_EVENT,T_CAUSE,T_CONSEQUNCE_IMPACT,T_PEOPLE_ASSET,T_EXISTING_SAFEGUARD,T_CONSEQUENCES,T_PROBABILITY_OCCURANCE, T_RISK,  
     T_RECOMMENDATION_REDUCING,T_RESIDUAL_PROBABILITY , T_RESIDUAL_CONSEQUENCES ,T_RESIDUAL_RISK,
      b.T_RISK_OWNER ,
     (select distinct (T_OWNER_PERSONALNO||'-'||T_OWNER_NAME) T_OWNER_PERSONALNO from  LDPDBA.T_SHE_RISK_OWNER where T_OWNER_PERSONALNO=b.T_RISK_OWNER and T_RISKID=b.T_RISKID) T_RISK_OWNERNEW ,
       T_RISK_COMMUNICATION ,T_VERSION ,
     T_CHANGE_COLUMN, T_REVIEWER_ONE_COMMENT, T_REVIEWER_ONE, T_REVIEWER_TWO_COMMENT, T_REVIEWER_TWO,b.T_SHE_RISK_FILE,             
     (select distinct TSA_OWNER from  LDPDBA.T_she_risk_Aprv where TSA_TYPE='RiskApprover' 
     and TSA_DEPARTMENT=a.T_DEPARTMENT and TSA_SECTION=a.T_SECTION 
     and TSA_DIVISION=a.T_DIVISION and TSA_ACTIVE='Y' and ROWNUM=1 and TSA_PLANT_CD=:plantcd and TSA_COMPANY_CD=:compcode) IL3OFFICER,
     (select distinct TSA_OWNER from  LDPDBA.T_she_risk_Aprv where TSA_TYPE='SafetyOfficer' 
     and TSA_DEPARTMENT=a.T_DEPARTMENT and TSA_SECTION=a.T_SECTION 
     and TSA_DIVISION=a.T_DIVISION and TSA_ACTIVE='Y' and ROWNUM=1 and TSA_PLANT_CD=:plantcd and TSA_COMPANY_CD=:compcode) SAFETYOFFICER,
  RANK () OVER ( PARTITION BY  a.T_RISKID
  ORDER BY	     b.T_VERSION	DESC
  ) AS rnk
  from  LDPDBA.T_SHE_RISK_MST a left join  LDPDBA.T_SHE_RISK_DTL b on a.T_RISKID=b.T_RISKID                
     where  a.T_PLANT_CD=:plantcd and  a.T_COMP_CD=:compcode and a.T_Active='1' and a.T_RISK_APPRV_STATUS='Y' and b.T_CONSEQUENCES=:T_CONSEQUENCES and b.T_PROBABILITY_OCCURANCE=:T_PROBABILITY_OCCURANCE) 
     where rnk <= 1  ${str} 
      `;
    var binds = {
      plantcd: plantcd,
      compcode: compCode,
      T_CONSEQUENCES: cseq,
      T_PROBABILITY_OCCURANCE: probocc,
    };

    sql += ` order by T_RISKID `;
    return await Query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
