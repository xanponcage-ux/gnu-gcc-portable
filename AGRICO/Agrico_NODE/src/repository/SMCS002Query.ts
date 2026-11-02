import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";


export const getHeatList = async (Plant: any) => {
  try {
      let sql = `SELECT DISTINCT ODM_HEAT_NO FROM V_OGS_DECI_MAST 
      WHERE ODM_PLANT=:Plant`;
    const binds : any = {
      Plant :Plant,
    };
    console.log(binds)
    console.log(sql)
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const getHeatDetails = async (params: {
    plant: any,
    ProdDtFrm: any,
    ProdDtTo: any,
    Decision: any,
    HeatNo: any,
    PcNo: any,
    Caster: any,
    Status: any,
}) => {
  console.log("in query page")
  console.log(params)
  try {
    const binds: Record<string, any> = {
      plant: params.plant,
      ProdDtFrm: params.ProdDtFrm,
      ProdDtTo: params.ProdDtTo,
      HeatNo: params.HeatNo,
      PcNo: params.PcNo,
      Caster: params.Caster,
    };
      let sql=``;
    if (['1', '2', '3', '4', '5'].includes(params.Decision)){
     sql = `SELECT * FROM (
                SELECT TO_CHAR(ODM_PROD_DT,'DD-MON - YYYY')ODM_PROD_DT,ODM_HEAT_NO,ODM_CASTER_NO,DECODE(SUBSTR(UPPER(ODM_SEQ_NO),1,1),'S',SUBSTR(ODM_SEQ_NO,2),ODM_SEQ_NO) SEQ_NO, 
                ODM_PC_NO, (SELECT PCM_GRADE_DESC FROM V_PROC_CHART_MAST WHERE PCM_PCHART_NO = ODM_PC_NO AND PCM_VERSION = ODM_PC_VERSION AND PCM_PLANT = ODM_PLANT) AIM_GRADE,
                ODM_QNTY, ODM_NO_OF_PCS, ODM_SEC, ODM_LENGTH, DECODE(ODM_PROD_GRP_DECI, 'Y', 'N', 'Y') DEV_PROC_PARAM, ODM_ADVICE_INSP, DECODE(ODM_INSP_REQ_L2, 'Y', 'Y', 'N') INSP_PENDING_AS_PER_PLAN,
                ODM_PARTIAL_TAG, ODM_AUTO_DECI, ODM_QNTY_PENDING, DECODE(ODM_CHEM_DECI_L3, NULL, DECODE(ODM_CHEM_DECI, 'Y', 'OK', 'N', 'NOT OK', ''), DECODE(ODM_CHEM_DECI_L3, 'Y', 'OK', 'N', 'NOT OK', '')) Chemistry, 'NORMAL' STATUS, '' TRANSITION,
                    ODM_HOLD_STATUS, ODM_HOLD_REM, ODM_UNHOLD_REM  
                FROM V_OGS_DECI_MAST 
                WHERE ODM_PLANT=:plant
                    AND ODM_HEAT_NO = NVL(:HeatNo, ODM_HEAT_NO)
                    AND  ODM_PC_NO = NVL(:PcNo, ODM_PC_NO)
                    AND TRUNC(ODM_PROD_DT) >= NVL(TO_DATE(:ProdDtFrm, 'YYYY-MM-DD'), ODM_PROD_DT)
                    AND TRUNC(ODM_PROD_DT) <= NVL(TO_DATE(:ProdDtTo, 'YYYY-MM-DD'), ODM_PROD_DT)
                    AND(ODM_HEAT_NO LIKE 'M%' OR ODM_HEAT_NO LIKE 'V%' OR ODM_HEAT_NO LIKE 'T%') 
                    AND ODM_CASTER_NO = NVL(:Caster, ODM_CASTER_NO)
            UNION ALL 
                SELECT TO_CHAR(TO_DATE(SUBSTR(OMM_TIMESTAMP, 1, 19), 'DD-MM-YYYY HH24:MI:SS'))ODM_PROD_DT, ODM_HEAT_NO, ODM_CASTER_NO, DECODE(SUBSTR(UPPER(ODM_SEQ_NO), 1, 1), 'S', SUBSTR(ODM_SEQ_NO, 2), ODM_SEQ_NO) SEQ_NO,
                OMM_MERGED_PC, (SELECT PCM_GRADE_DESC FROM V_PROC_CHART_MAST WHERE PCM_PCHART_NO = OMM_MERGED_PC AND PCM_VERSION = (SELECT MAX(PCM_VERSION) FROM V_PROC_CHART_MAST WHERE PCM_PCHART_NO = OMM_MERGED_PC) 
                AND PCM_PLANT = ODM_PLANT) AIM_GRADE, OMM_TOTAL_QNTY, 0, OMM_SEC, ODM_LENGTH,
                DECODE(ODM_PROD_GRP_DECI, 'Y', 'N', 'Y') DEV_PROC_PARAM, ODM_ADVICE_INSP, DECODE(ODM_INSP_REQ_L2, 'Y', 'Y', 'N') INSP_PENDING_AS_PER_PLAN, ODM_PARTIAL_TAG, ODM_AUTO_DECI,
                OMM_TOTAL_QNTY, DECODE(ODM_CHEM_DECI_L3, NULL, DECODE(ODM_CHEM_DECI, 'Y', 'OK', 'N', 'NOT OK', ''), DECODE(ODM_CHEM_DECI_L3, 'Y', 'OK', 'N', 'NOT OK', '')) Chemistry, 'SALVAGED/MERGED', '' TRANSITION,
                    ODM_HOLD_STATUS, ODM_HOLD_REM, ODM_UNHOLD_REM FROM V_OGS_MERGING_MAST, V_OGS_DECI_MAST
                WHERE ODM_PLANT=:plant
                    AND OMM_MERGED_HEAT = NVL(:HeatNo, OMM_MERGED_HEAT)
                    AND OMM_STATUS = 'A' 
                    AND OMM_MERGED_HEAT = ODM_HEAT_NO 
                    AND OMM_MERGED_PC = NVL(:PcNo, OMM_MERGED_PC)
                    AND TO_DATE(SUBSTR(OMM_TIMESTAMP, 1, 10), 'DD-MM-YYYY') >= NVL(TO_DATE(:ProdDtFrm, 'YYYY-MM-DD'), TO_DATE(SUBSTR(OMM_TIMESTAMP, 1, 10), 'DD-MM-YYYY'))
                    AND TO_DATE(SUBSTR(OMM_TIMESTAMP, 1, 10), 'DD-MM-YYYY') <= NVL(TO_DATE(:ProdDtTo, 'YYYY-MM-DD'), TO_DATE(SUBSTR(OMM_TIMESTAMP, 1, 10), 'DD-MM-YYYY'))
                    AND OMM_LOCATION = NVL(NULL, OMM_LOCATION) 
            ) ORDER BY ODM_HEAT_NO `
    }else{
      sql =`SELECT * FROM ( 
            SELECT TO_CHAR(ODM_PROD_DT,'DD-MON-YYYY')ODM_PROD_DT,ODM_HEAT_NO,ODM_CASTER_NO,DECODE(SUBSTR(UPPER(ODM_SEQ_NO),1,1),'S',SUBSTR(ODM_SEQ_NO,2),ODM_SEQ_NO) SEQ_NO, 
            ODM_PC_NO, (SELECT PCM_GRADE_DESC FROM V_PROC_CHART_MAST WHERE PCM_PCHART_NO=ODM_PC_NO AND PCM_VERSION=ODM_PC_VERSION AND PCM_PLANT=ODM_PLANT) AIM_GRADE,
            ODM_QNTY, ODM_NO_OF_PCS, ODM_SEC, ODM_LENGTH, DECODE(ODM_PROD_GRP_DECI,'Y','N','Y') DEV_PROC_PARAM,ODM_ADVICE_INSP,
            DECODE(ODM_INSP_REQ_L2,'Y','Y','N') INSP_PENDING_AS_PER_PLAN,ODM_PARTIAL_TAG,ODM_AUTO_DECI,ODM_QNTY_PENDING, 
            DECODE(ODM_CHEM_DECI_L3,NULL,DECODE(ODM_CHEM_DECI,'Y','OK','N','NOT OK',''), DECODE(ODM_CHEM_DECI_L3,'Y','OK','N','NOT OK','')) Chemistry, 'NORMAL' STATUS, '' TRANSITION,
            ODM_HOLD_STATUS, ODM_HOLD_REM ,ODM_UNHOLD_REM  
            FROM V_OGS_DECI_MAST,V_OGS_DECI_DTLS 
            WHERE  ODD_INSP_DECI='N' 
              AND ODM_PLANT=:plant
              AND ODD_HEAT_NO=ODM_HEAT_NO 
              AND ODD_PC_NO=ODM_PC_NO 
              --AND ODD_INSP_TYPE=' + ddl_DecisionStatus.SelectedValue + '
              AND ODM_HEAT_NO= NVL(:HeatNo,ODM_HEAT_NO) 
              AND  ODM_PC_NO= NVL(:PcNo,ODM_PC_NO)  
              AND TRUNC(ODM_PROD_DT)>= NVL(TO_DATE(:ProdDtFrm, 'YYYY-MM-DD'),ODM_PROD_DT)  
              AND TRUNC(ODM_PROD_DT)<= NVL(TO_DATE(:ProdDtTo, 'YYYY-MM-DD'),ODM_PROD_DT) 
              AND ( ODM_HEAT_NO LIKE 'M%' OR ODM_HEAT_NO LIKE 'V%' OR ODM_HEAT_NO LIKE 'T%' ) 
              AND ODM_CASTER_NO=NVL(:Caster,ODM_CASTER_NO) 
            UNION ALL 
            SELECT TO_CHAR(TO_DATE(SUBSTR(OMM_TIMESTAMP,1,19),'DD-MM-YYYY HH24:MI:SS'))ODM_PROD_DT,ODM_HEAT_NO,ODM_CASTER_NO, 
            DECODE(SUBSTR(UPPER(ODM_SEQ_NO),1,1),'S',SUBSTR(ODM_SEQ_NO,2),ODM_SEQ_NO) SEQ_NO, 
            OMM_MERGED_PC, (SELECT PCM_GRADE_DESC FROM V_PROC_CHART_MAST WHERE PCM_PCHART_NO=OMM_MERGED_PC AND PCM_VERSION=(SELECT MAX(PCM_VERSION) FROM V_PROC_CHART_MAST WHERE PCM_PCHART_NO = OMM_MERGED_PC) 
            AND PCM_PLANT=ODM_PLANT) AIM_GRADE, 
            OMM_TOTAL_QNTY, 0 ,OMM_SEC, ODM_LENGTH,  
            DECODE(ODM_PROD_GRP_DECI,'Y','N','Y') DEV_PROC_PARAM,ODM_ADVICE_INSP, DECODE(ODM_INSP_REQ_L2,'Y','Y','N') INSP_PENDING_AS_PER_PLAN,ODM_PARTIAL_TAG,ODM_AUTO_DECI, 
            OMM_TOTAL_QNTY,
            DECODE(ODM_CHEM_DECI_L3,NULL,DECODE(ODM_CHEM_DECI,'Y','OK','N','NOT OK',''), DECODE(ODM_CHEM_DECI_L3,'Y','OK','N','NOT OK','')) Chemistry, 'SALVAGED/MERGED' , '' TRANSITION,   
            ODM_HOLD_STATUS, ODM_HOLD_REM ,ODM_UNHOLD_REM 
            FROM V_OGS_MERGING_MAST, V_OGS_DECI_MAST ,V_OGS_DECI_DTLS 
            WHERE 
              ODD_INSP_DECI='N'
              AND ODM_PLANT=:plant 
              AND ODD_HEAT_NO= ODM_HEAT_NO 
              AND ODD_PC_NO= ODM_PC_NO
              --AND ODD_INSP_TYPE=' + ddl_DecisionStatus.SelectedValue + '
              AND OMM_MERGED_HEAT = NVL(:HeatNo,OMM_MERGED_HEAT)
              AND OMM_STATUS='A' 
              AND OMM_MERGED_HEAT = ODM_HEAT_NO 
              AND OMM_MERGED_PC= NVL(:PcNo,OMM_MERGED_PC) 
              AND TO_DATE(SUBSTR(OMM_TIMESTAMP,1,10),'DD-MM-YYYY') >= NVL(TO_DATE(:ProdDtFrm,'YYYY-MM-DD'),TO_DATE(SUBSTR(OMM_TIMESTAMP,1,10),'DD-MM-YYYY') )
              AND TO_DATE(SUBSTR(OMM_TIMESTAMP,1,10),'DD-MM-YYYY') <= NVL(TO_DATE(:ProdDtTo,'YYYY-MM-DD'),TO_DATE(SUBSTR(OMM_TIMESTAMP,1,10),'DD-MM-YYYY') ) 
              AND OMM_LOCATION=NVL(NULL,OMM_LOCATION) 
            ) ORDER BY ODM_HEAT_NO`
    }    


    // `select 
    //         PCM_PCHART_NO,
    //         PCM_VERSION,
    //         PCM_QCODE,
    //         PCM_TDC_NO,
    //         PCM_GRADE_DESC,
    //         PCM_GRADE_APPL,
    //         DECODE(PCM_STATUS,'C','Draft','A','Released','N','Not Active',' ') PCM_STATUS,
    //         PCM_PROD_GRP,PCM_PROD_SUBGRP,
    //         PCM_PROD_VERSION,PGM_PGRP_DESC,
    //         PCM_PROD_CATG
    //         from v_proc_chart_mast, v_prod_grp_mast 
    //         where PCM_PROD_GRP = PGM_PROD_GRP
    //         and PCM_PROD_VERSION = PGM_VERSION
    //         and PCM_PROD_SUBGRP = PGM_PROD_SUBGRP
    //         AND PCM_PLANT=:plant`
    // if (params.Action ==='REACTIVATE') {
    //       sql += ` AND PCM_STATUS in('N','D')`;
    //     }else{
    //       sql += ` AND PCM_STATUS in('A')`;
    //     }
    // ProcessChart
    // if (params.ProcessChart && params.ProcessChart !== '') {
    //   sql += ` AND pcm_pchart_no LIKE NVL(TRIM(UPPER(:processChart)), pcm_pchart_no)`;
    //   binds.processChart = String(params.ProcessChart).trim();
    // }

    // // TDCNo
    // if (params.TDCNo && params.TDCNo !== '') {
    //   sql += ` AND UPPER(PCM_TDC_NO) LIKE UPPER(NVL(TRIM(:tdcNo), PCM_TDC_NO))`;
    //   binds.tdcNo = String(params.TDCNo).trim();
    // }

    // QualityCode
    // if (params.QualityCode && params.QualityCode !== '') {
    //   sql += ` AND UPPER(PCM_QCODE) LIKE UPPER(NVL(TRIM(:qualityCode), PCM_QCODE))`;
    //   binds.qualityCode = String(params.QualityCode).trim();
    // }

    // ProductGroup
    // if (params.ProductGroup && params.ProductGroup !== '') {
    //   sql += ` AND UPPER(PCM_PROD_GRP) LIKE UPPER(NVL(TRIM(:productGroup), PCM_PROD_GRP))`;
    //   binds.productGroup = String(params.ProductGroup).trim();
    // }

    // GradeDesc
    // if (params.GradeDesc && params.GradeDesc !== '') {
    //   sql += ` AND UPPER(PCM_GRADE_DESC) LIKE UPPER(NVL(TRIM(:gradeDesc), PCM_GRADE_DESC))`;
    //   binds.gradeDesc = String(params.GradeDesc).trim();
    // }
    console.log('SQL:', sql);
    console.log('Binds:', binds);
    console.log('in query page')
    // return demoData
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.error(error);
    throw new Error.InternalServerError("Error!");
  }

}
