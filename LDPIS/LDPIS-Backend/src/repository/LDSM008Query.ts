import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import moment from "moment";
import e from "express";

export const EqpMastQuery = async (plantCode: any, processLine: any) => {
  try {
    const sql = `select FL_LOC_CD,FL_DESc
    from V_FUNC_LOC_DTL a`;
    const binds = {
      plantCode: plantCode,
      // processLine: processLine,
    };
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const equipData = async (plantCode: any, compCode: any, p_line: any) => {
  try {
    const sql = `select FL_EQUIP_CD,FL_EQUIP_CD_DESC
    from V_FUNC_LOC_DTL`;
    const binds = {
      plantCode: plantCode,
      // p_line: p_line,
    };
    return await query.executeQuery(sql);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const FacCodeQuery = async (plantCode: any, compCode: any) => {
  try {
    const sql = `SELECT DISTINCT FAO_CD_FAC_MAST facCode FROM V_FACILITY_OUTAGE_TUBE
    WHERE FAO_COMP_CD =:compCode
    AND FAO_PLANT_CD =:plantCode`;
    const binds = {
      plantCode: plantCode,
      compCode: compCode,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const delayDataQuery = async (
  dateFrom: any,
  dateTo: any,
  processLine: any,
  selectShift: any,
  resouceCode: any,
  EqpCD: any,
  FaqCD: any,
  plantCode: any,
  compCode: any
) => {
  try {
    let sql = `SELECT a.fao_dt_outage AS outage_dt, a.fao_cd_sh_outage,FAO_UPDATED_BY,DELAY_AGENT,DELAY_CODE,FAO_CREATED_BY,
          round(SYSDATE-a.fao_dt_outage)as newdate,
           ROUND((fao_tm_stop_en - fao_tm_stop_st) * 24, 2) DURATION,fao_cd_process,FAO_RESOURCE,FAO_PLANT_CD,
          a.fao_tm_stop_st, a.fao_tm_stop_en, a.fao_ts_rec_create, a.fao_dt_piece_upd,
          a.fao_id_operator, a.fao_cd_outage, a.fao_id_coil, a.fao_remarks,
          a.fao_cd_eqp_mast, a.fao_cd_fac_mast, a.FAO_CD_TRBL_TYP,
          (select distinct tom_description from V_TRBL_OUT_CD c,
            V_FACILITY_OUTAGE_TUBE d
          where c.tom_cd_outage=a.fao_cd_outage)as DESCP,
          (select distinct tom_description from V_TRBL_OUT_CD c,
            V_FACILITY_OUTAGE_TUBE d
            where c.tom_cd_outage=a.fao_cd_outage)as DESCP,
            FAO_PLANT_CD,
            (select distinct TSM_STAGE_DESC from V_STAGE_MASTER
            WHERE TSM_STAGE=fao_cd_process
            AND TSM_COMPANY_CD=FAO_COMP_CD AND TSM_PLANT_CD=FAO_PLANT_CD)as ProceDesc,
          (select TPM_SUB_PLANTNAME  from V_PLANT_MASTER_TUBE
            where TPM_SUB_PLANTCD=:plantCode)as plantDesc,
            (select a.TMM_MACHINE_DESC from V_MACHINE_MASTER a
             where a.TMM_PLANT_CD=FAO_PLANT_CD
             AND a.TMM_MACHINE_NO=FAO_RESOURCE)RESDESC,
          a.FAO_TS_CREATE_DB
          FROM V_FACILITY_OUTAGE_TUBE a, V_TRBL_OUT_CD b
          WHERE b.tom_cd_outage(+) = a.fao_cd_outage
          AND b.tom_cd_process(+) = a.fao_cd_process
          AND b.tom_plant_cd(+)=a.fao_plant_cd
          AND b.tom_comp_cd(+)=a.fao_comp_cd
          AND TRUNC(fao_dt_outage) BETWEEN :dateFrom AND  :dateTo
          AND fao_cd_process = :processLine
          AND a.FAO_RESOURCE=:resouceCode
          AND FAO_COMP_CD =:compCode
          AND FAO_PLANT_CD =:plantCode`;
    type jsonObj = {
      [key: string]: any;
    };

    var binds: jsonObj = {};

    binds.dateFrom = dateFrom;
    binds.dateTo = dateTo;
    binds.processLine = processLine;
    binds.resouceCode = resouceCode;
    binds.plantCode = plantCode;
    binds.compCode = compCode;
    if (selectShift == "All")
      sql = sql + " and FAO_CD_SH_OUTAGE in ('A','B','C') ";
    else {
      sql = sql + " and FAO_CD_SH_OUTAGE in ('" + selectShift + "') ";
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
export const delayCheck = async (
  dateFrom: any,
  dateTo: any,
  processLine: any,
  selectShift: any,
  resouceCode: any,
  EqpCD: any,
  FaqCD: any,
  plantCode: any,
  compCode: any
) => {
  try {
    let sql = `SELECT a.fao_dt_outage AS outage_dt, a.fao_cd_sh_outage,FAO_UPDATED_BY,DELAY_AGENT,DELAY_CODE,FAO_CREATED_BY,
          round(SYSDATE-a.fao_dt_outage)as newdate,
           ROUND((fao_tm_stop_en - fao_tm_stop_st) * 24, 2) DURATION,fao_cd_process,FAO_RESOURCE,
          a.fao_tm_stop_st, a.fao_tm_stop_en, a.fao_ts_rec_create, a.fao_dt_piece_upd,
          a.fao_id_operator, a.fao_cd_outage, a.fao_id_coil, a.fao_remarks,
          a.fao_cd_eqp_mast, a.fao_cd_fac_mast, a.FAO_CD_TRBL_TYP,
          (select distinct tom_description from V_TRBL_OUT_CD c,
            V_FACILITY_OUTAGE_TUBE d
          where c.tom_cd_outage=a.fao_cd_outage)as DESCP,
          FAO_PLANT_CD,
          (select distinct TSM_STAGE_DESC from V_STAGE_MASTER
            WHERE TSM_STAGE=fao_cd_process
            AND TSM_COMPANY_CD=FAO_COMP_CD AND TSM_PLANT_CD=FAO_PLANT_CD)as ProceDesc,
          (select TPM_SUB_PLANTNAME  from V_PLANT_MASTER_TUBE  A
            where TPM_SUB_PLANTCD=:plantCode)as plantDesc,
            (select a.TMM_MACHINE_DESC from V_MACHINE_MASTER a
             where a.TMM_PLANT_CD=FAO_PLANT_CD
             AND a.TMM_MACHINE_NO=FAO_RESOURCE)RESDESC,
          a.FAO_TS_CREATE_DB
          FROM V_FACILITY_OUTAGE_TUBE a, V_TRBL_OUT_CD b
          WHERE b.tom_cd_outage(+) = a.fao_cd_outage
          AND DELAY_AGENT is NULL
          AND DELAY_CODE is NULL
          AND b.tom_cd_process(+) = a.fao_cd_process
          AND b.tom_plant_cd(+)=a.fao_plant_cd
          AND b.tom_comp_cd(+)=a.fao_comp_cd
          AND TRUNC(fao_dt_outage) BETWEEN :dateFrom AND  :dateTo
          AND fao_cd_process = :processLine
          AND a.FAO_RESOURCE=:resouceCode
          AND FAO_COMP_CD =:compCode
          AND FAO_PLANT_CD =:plantCode`;
    type jsonObj = {
      [key: string]: any;
    };

    var binds: jsonObj = {};

    binds.dateFrom = dateFrom;
    binds.dateTo = dateTo;
    binds.processLine = processLine;
    binds.resouceCode = resouceCode;
    binds.plantCode = plantCode;
    binds.compCode = compCode;
    if (selectShift == "All")
      sql = sql + " and FAO_CD_SH_OUTAGE in ('A','B','C') ";
    else {
      sql = sql + " and FAO_CD_SH_OUTAGE in ('" + selectShift + "') ";
    }
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("delayData", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//Reason Query
export const getRsnQuery = async (plantCode: any, compCode: any) => {
  try {
    const sql = `SELECT tom_cd_outage, tom_description FROM V_TRBL_OUT_CD WHERE TOM_CD_PROCESS='L' 
    AND TOM_COMP_CD =:compCode
    AND TOM_PLANT_CD =:plantCode 
    ORDER BY tom_cd_outage`;
    const binds = {
      plantCode: plantCode,
      compCode: compCode,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log("getRsnQuery", error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//Add Reason Query
export const addReasonData = async (plantCode: any, compCode: any) => {
  try {
    const sql = `SELECT tom_cd_outage, tom_description FROM V_TRBL_OUT_CD WHERE TOM_CD_PROCESS='L' 
    AND TOM_COMP_CD =:compCode
    AND TOM_PLANT_CD =:plantCode 
    ORDER BY tom_cd_outage`;
    const binds = {
      plantCode: plantCode,
      compCode: compCode,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

//Delay Agent Query
export const delayAgent = async (plantCode: any, compCode: any) => {
  try {
    let sql = `select TDR_LEG_CD,TDR_LEG_DESC from v_delay_reason
    where TDP_PLANT= :plantCode`;
    const binds = {
      plantCode: plantCode,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

//Delay Code Query
export const delayCode = async (
  compCode: any,
  agency: any,
  plantCode: any,
  process: any
) => {
  try {
    let sql = `select TDR_STAGE_CD,TDR_DESC from v_delay_reason_dtl
    where tdr_leg_cd= :agency
    and tdr_plant_cd= :plantCode
    and TDR_LEG_SUB_CD= :process`;
    const binds = {
      plantCode: plantCode,
      agency: agency,
      process: process,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

//Delete Query
export const deleteBrkQuery = async (
  stDate: any,
  enDate: any,
  p_line: any,
  eqpMast: any,
  faqMast: any,
  plantCode: any,
  compCode: any
) => {
  try {
    const sql = `delete from V_FACILITY_OUTAGE_TUBE where FAO_TM_STOP_ST= to_date(:stDate,'DD-MON-YYYY HH:MI:SS PM') and FAO_TM_STOP_EN= to_date(:enDate,'DD-MON-YYYY HH:MI:SS PM') and FAO_CD_PROCESS = :p_line and FAO_CD_EQP_MAST = :eqpMast and FAO_CD_FAC_MAST = :faqMast
    AND FAO_COMP_CD =:compCode
    AND FAO_PLANT_CD =:plantCode`;
    const binds = {
      stDate: stDate,
      enDate: enDate,
      p_line: p_line,
      eqpMast: eqpMast,
      faqMast: faqMast,
      compCode: compCode,
      plantCode: plantCode,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

//Update
export const updateRsnQuery = async (
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
) => {
  try {
    let sql = "";
    if (isDelete === true) {
      let UsrID = await query.executeQuery(`
      select CD_VALUE from V_CODES 
      where CD_TYPE = 'DELAYDLT'`);
      if (
        UsrID.rows &&
        UsrID.rows.length > 0 &&
        UsrID.rows[0]?.length > 0 &&
        UsrID.rows[0][0] &&
        UsrID.rows[0][0] == modify_user
      ) {
        sql = `DELETE FROM V_FACILITY_OUTAGE_TUBE 
        WHERE FAO_DT_OUTAGE = TO_DATE('${outageDt}', 'DD-MON-YYYY HH24:MI:SS')
        AND FAO_CD_PROCESS = '${processCd}'
        AND FAO_TM_STOP_ST = TO_DATE('${stDate}', 'DD-MON-YYYY HH24:MI:SS')
        and FAO_RESOURCE = '${resource}'`;
      } else {
        throw new Error.InternalServerError("User not authorized!");
      }
    } else {
      sql = `update V_FACILITY_OUTAGE_TUBE set FAO_REMARKS = '${remarks}', FAO_UPDATED_BY=SUBSTR('${modify_user}', 1, 6), FAO_DELAY_AGENT='${delayAgent}', FAO_DELAY_CODE='${delayCode}', FAO_PLANT_CD = '${plantCode}', FAO_RESOURCE ='${resource}',FAO_TS_UPDATE_DB=SYSDATE, FAO_TM_STOP_EN=TO_DATE('${enDate}','DD/MM/YYYY HH24:MI:SS') 
      WHERE FAO_DT_OUTAGE = TO_DATE('${outageDt}', 'DD-MON-YYYY HH:MI:SS PM')
      AND FAO_CD_PROCESS = '${processCd}'
      AND FAO_TM_STOP_ST = TO_DATE('${stDate}', 'DD-MON-YYYY HH:MI:SS PM')
      and FAO_RESOURCE = '${resource}'`;
    }

    return await query.executeQuery(sql);
  } catch (error: any) {
    throw new Error.DBERROR(error?.toString());
  }
};

//Quipment
export const eqpFacQuery = async (
  reason: any,
  Reason: any,
  plantCode: any,
  compCode: any
) => {
  try {
    const sql = `Select tom_cd_fac_mas, tom_cd_eqp_mast From V_TRBL_OUT_CD Where  tom_cd_outage = NVL(:reason,:Reason) And tom_cd_process = 'L' AND TOM_COMP_CD =:compCode
    AND TOM_PLANT_CD =:plantCode`;
    const binds = {
      reason: reason,
      Reason: Reason,
      plantCode: plantCode,
      compCode: compCode,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

//Update Break
export const updBrkQuery = async (
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
) => {
  try {
    const sql = `update V_FACILITY_OUTAGE_TUBE set FAO_REMARKS = :remarks,FAO_CD_OUTAGE = :reason,FAO_UPDATED_BY= SUBSTR(:PersonalNo, 1, 6),DELAY_CODE=:delayCode,DELAY_AGENT=:delayAgent,FAO_CD_EQP_MAST=:EquipCD,FAO_TS_UPDATE_DB=SYSDATE, FAO_TM_STOP_EN=substr(F_Tatadate(TO_DATE(:endDate, 'DD-MON-YYYY HH24:MI:SS')),1,1) 
    where FAO_TM_STOP_ST= to_date(:startDate,'DD-MON-YYYY HH:MI:SS PM')
    and FAO_CD_PROCESS = :p_line 
    AND FAO_COMP_CD =:compCode
    AND FAO_PLANT_CD =:plantCode`;
    const binds = {
      endDate: endDate,
      reason: reason,
      // Reason:Reason,
      remarks: remarks,
      // Remarks:Remarks,
      EquipCD: EquipCD,
      // OutageRsnDesc:OutageRsnDesc,
      p_line: p_line,
      startDate: startDate,
      // Shift:Shift,
      PersonalNo: PersonalNo,
      plantCode: plantCode,
      compCode: compCode,
      delayAgent: delayAgent,
      delayCode: delayCode,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

//Insert
export const insertBrkQuery = async (
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
) => {
  try {
    var rem1 = remarks;
    var rsn1 = reason;
    if (remarks == null || remarks == undefined || remarks.length == 0) {
      rem1 = Remarks;
    }
    if (reason == null || reason == undefined || reason.length == 0) {
      rsn1 = Reason;
    }
    const sql = `
            INSERT INTO V_FACILITY_OUTAGE_TUBE(
                FAO_CD_PROCESS,
                FAO_TM_STOP_ST,
                FAO_TM_STOP_EN,
                FAO_CD_OUTAGE,
                FAO_CD_SH_OUTAGE,
                FAO_DT_OUTAGE,
                FAO_CREATED_BY,
                FAO_TS_COIL_CREATE,
                FAO_TS_REC_CREATE,
                FAO_REMARKS,
                fao_cd_eqp_mast,
                fao_cd_rsn_out,
                fao_plant_cd,
                fao_comp_cd,
                DELAY_CODE,
                DELAY_AGENT,
                FAO_ID_COIL,
                FAO_RESOURCE
            )
        VALUES (
                :P_Line,
                TO_DATE(:startDate, 'DD-MON-YYYY HH:MI:SS PM'),
                TO_DATE(:endDate, 'DD-MON-YYYY HH:MI:SS PM'),
                :rsn1,
                :Shift,
                to_date(:outDt, 'DD-MON-YYYY'),
                SUBSTR(:operator, 1, 6),
                SYSDATE,
                SYSDATE,
                :rem1,
                :EquipCD,
                :OutageRsnDesc,
                :plant,
                :company,
                :delayCode,
                :delayAgent,
                :coilNo,
                :resouceCode

            )
            `;
    const binds = {
      endDate: endDate,
      rsn1: rsn1,
      rem1: rem1,
      EquipCD: EquipCD,
      OutageRsnDesc: OutageRsnDesc,
      p_line: p_line,
      operator: operator,
      outDt: outDt,
      startDate: startDate,
      Shift: Shift,
      company: company,
      plant: plant,
      delayAgent: delayAgent,
      delayCode: delayCode,
      coilNo: coilNo,
      resouceCode: resouceCode,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

//Insert New Delay Data
export const insertDelayData = async (
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
) => {
  try {
    const sql = `INSERT INTO V_FACILITY_OUTAGE_TUBE (
      fao_dt_outage,
      fao_cd_sh_outage,
      fao_tm_stop_st,
      fao_tm_stop_en,
      fao_cd_outage,
      fao_remarks,
      fao_cd_eqp_mast,
      fao_ts_rec_create,
      fao_created_by,
      fao_delay_agent,
      fao_delay_code,
      fao_plant_cd,
      fao_comp_cd,
      fao_cd_process,
      fao_resource
  ) VALUES (
    substr(F_Tatadate(TO_DATE(:toDate, 'DD-MON-YYYY HH24:MI:SS')),2),
    substr(F_Tatadate(TO_DATE(:toDate, 'DD-MON-YYYY HH24:MI:SS')),1,1),
    TO_DATE(:fromDate,'DD/MM/YYYY HH24:MI:SS'),
    TO_DATE(:toDate,'DD/MM/YYYY HH24:MI:SS'),
    :delayCode,
    :remark,
    :equipCode,
     SYSDATE,
    SUBSTR(:createdUser, 1, 6),
    :delayAgent,
    :reason,
    :plantCode,
    :compCode,
    :processLine,
    :resouceCode
  )`;
    const binds = {
      //shift: shift,
      reason: reason,
      remark: remark,
      // coilNo: coilNo,
      equipCode: equipCode,
      createdUser: createdUser,
      plantCode: plantCode,
      compCode: compCode,
      fromDate: fromDate,
      toDate: toDate,
      delayCode: delayCode,
      delayAgent: delayAgent,
      processLine: processLine,
      resouceCode: resouceCode,
    };
    return await query.executeQuery(sql, binds);
  } catch (error: any) {
    throw new Error.DBERROR(error?.toString());
  }
};

export const displayDelayData = async (
  shift: any,
  plantCode: any,
  fromDate: any,
  toDate: any,
  processLine: any,
  resouceCode: any
) => {
  try {
    let sql = `select * 
    from V_FACILITY_OUTAGE_TUBE
    where FAO_PLANT_CD = '${plantCode}'`;
    if (processLine) {
      sql += ` and FAO_CD_PROCESS = '${processLine}'`;
    }
    if (resouceCode) {
      sql += ` and FAO_RESOURCE = '${resouceCode}'`;
    }
    if (fromDate && fromDate !== "" && toDate !== "") {
      sql += ` And trunc(fao_dt_outage) BETWEEN '${fromDate}' AND '${toDate}'`;
    } else if (fromDate) {
      sql += ` and trunc(fao_dt_outage) = '${fromDate}'`;
    } else if (toDate) {
      sql += ` and trunc(fao_dt_outage) = '${toDate}'`;
    }
    if (shift) {
      sql += ` and FAO_CD_SH_OUTAGE = '${shift}'`;
    }
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//process Line

// export const processLine = async (plantCode: any, compCode: any) => {
//   try {
//     const sql = `select TSM_STAGE,TSM_STAGE_DESC from V_STAGE_MASTER
//     WHERE TSM_COMPANY_CD=:compCode AND TSM_PLANT_CD=:plantCode`;
//     const binds = {
//       plantCode: plantCode,
//       compCode: compCode,
//     };
//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

//plant Line

// export const plantList = async (plantCode: any, compCode: any) => {
//   try {
//     const sql = `select TPM_SUB_PLANTCD,TPM_SUB_PLANTNAME from V_PLANT_MASTER_TUBE
//     where TPM_PLANT_CD=:plantCode
//     AND TPM_GROUP != 'S'`;
//     const binds = {
//       plantCode: plantCode,
//       // compCode: compCode,
//     };
//     return await query.executeQuery(sql, binds);
//   } catch (error) {
//     throw new Error.InternalServerErrorMsg(error);
//   }
// };

export const plantList = async (ad: any) => {
  try {
    const sql = `SELECT DISTINCT EGP_CD_EPA|| ' - ' || EGP_EPA_DESC EGP_CD_EPA,EGP_CD_EPA,EPL_BUSINESS_UNIT,EPL_CD_COMP FROM V_EPA_GROUP_PLANT , v_epa_proc_line WHERE EGP_CD_EPA = EPL_CD_EPA AND UPPER(EGP_GRP_USER)= :0 AND  EPL_ACTIVE_PLANT_FL='A' ORDER BY 1`;
    let binds = [`${ad}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const processLine = async (Plant: any) => {
  try {
    let sql = `Select EPL_CD_PROCESS, EPL_CD_PROCESS||' - '||EPL_PROC_LINE_DESC EPL_DESC
    FROM V_EPA_PROC_LINE 
    WHERE EPL_CD_EPA= :0 AND EPL_CD_PROCESS not in ('V','K','W') 
    union
    Select cd_value EPL_CD_PROCESS, cd_value||' - '||cd_desc EPL_DESC
    from v_codes
    where cd_type='TB035'`;
    let binds = [`${Plant}`];
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const resourceData = async (
  plantCode: any,
  compCode: any,
  plmStatus: any,
  stageCd: any
) => {
  try {
    // const sql = `select * from v_proc_line_machine
    // where plm_cd_epa=:plantCode
    // and PLM_CD_PROCESS=:stageCd
    // AND PLM_ACTIVE_STATUS=:plmStatus
    //  `;
    const sql = `SELECT PLM_WCNT_CODE||' , '||PLM_WCNT_DESC FROM V_PROC_LINE_MACHINE WHERE PLM_CD_EPA=:0 AND PLM_CD_PROCESS =:1 AND PLM_ACTIVE_STATUS='A' Order by PLM_WCNT_CODE`;
    let binds = [`${plantCode}`, `${stageCd}`];
    return await query.executeQuery(sql, binds);
    // const sql = `select TMM_MACHINE_NO,TMM_MACHINE_DESC from V_MACHINE_MASTER where TMM_PLANT_CD=:plantCode
    // and TMM_STAGE_CD=:stageCd`;
  } catch (error) {
    throw new Error.InternalServerErrorMsg(error);
  }
};
