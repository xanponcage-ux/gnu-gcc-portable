import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";


export const getProcessChartList = async (Plant: any,Action:any) => {
  var status = (Action === 'REACTIVATE') ? ['N', 'D'] : ['A']
  try {
     const statusPlaceholders = status.map((_, i) => `:status${i}`).join(', ');
    let sql = `SELECT distinct PCM_PCHART_NO FROM V_PROC_CHART_MAST
WHERE PCM_STATUS in (${statusPlaceholders})
AND PCM_PLANT=:Plant ORDER BY 1`;
    const binds : any = {
      Plant :Plant,
    };
    status.forEach((val, i) => { 
      binds[`status${i}`] = val;
  });

    console.log(binds)
    console.log(sql)
    return await query.executeQuery(sql, binds);
  } catch (error) {
    throw new Error.InternalServerError("Error!");
  }
};

export const InsertProcChartData = async (
  Plant: any,
  Action: any ,
  ProcessChart: any,
  Version: any,
  Prod_Version:any,
  QualityCode: any,
  TDCNo: any,
  ProductGroup: any,
  GradeDesc: any,
  ProductApplication: any,
  ProductCategory: any,
  Remarks :any,
) => {
  try {
    const sql = `call TUBEDBA.SMCB001(
    P_PLANT =>:P_PLANT,
    P_DECISION =>:P_DECISION,
    P_PROC_CHRT =>:P_PROC_CHRT,
    P_VERSION =>:P_VERSION,
    P_PCM_PROD_VERSION =>:P_PCM_PROD_VERSION,
    P_PCM_QCODE =>:P_PCM_QCODE,
    P_PCM_TDC_NO =>:P_PCM_TDC_NO,
    P_PCM_PROD_GRP =>:P_PCM_PROD_GRP,
    P_PCM_GRADE_DESC =>:P_PCM_GRADE_DESC,
    P_PCM_GRADE_APPL =>:P_PCM_GRADE_APPL,
    P_PCM_PROD_SUBGRP =>:P_PCM_PROD_SUBGRP,
    P_PCM_REMARKS =>:P_PCM_REMARKS,
    LS_OUT_FLAG =>:LS_OUT_FLAG)`;
    // const sql = `call C1CVB001 (
    //   LS_CD_EPA => :LS_CD_EPA1,
    //   LS_ORDER_NO => :LS_ORDER_NO,
    //   LN_ITEM_NO => :LN_ITEM_NO,
    //   LS_BATCH_ID => :LS_BATCH_ID,
    //   BTS => :BTS,
    //   TOT_COIL_QTY => :TOT_COIL_QTY,
    //   LS_REMARKS => :LS_REMARKS,
    //   LN_ALLOTED_QTY => :LN_ALLOTED_QTY,
    //   LS_SFG_MATNR => :LS_SFG_MATNR,
    //   LS_OUT_FLAG => :LS_OUT_FLAG         
    //   )`;

    const binds = {
      P_PLANT: Plant,
      P_DECISION: Action,
      P_PROC_CHRT: ProcessChart,
      P_VERSION: Number(Version),
      P_PCM_PROD_VERSION: Number(Prod_Version),
      P_PCM_QCODE: QualityCode,
      P_PCM_TDC_NO: TDCNo,
      P_PCM_PROD_GRP: ProductGroup,
      P_PCM_GRADE_DESC: GradeDesc , 
      P_PCM_GRADE_APPL: ProductApplication, // need to confirm mismatch
      P_PCM_PROD_SUBGRP: ProductCategory,   // need to confirm mismatch
      P_PCM_REMARKS:Remarks,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerError("Error!");
  }
};

export const getProcessChartData = async (params: {
  Plant: any,
  ProcessChart: any,
  Version: any,
  ProductGroup: any,
  ProductGroupDesc: any,
  QualityCode: any,
  ProductCategory: any,
  TDCNo: any,
  ProductApplication: any,
  GradeDesc: any
  Action: any
}) => {
  console.log("in query page")
  console.log(params)
  try {

    const toNullIfEmpty = (v: any) => {
      if (v === undefined || v === null) return null;
      const s = String(v).trim();
      return s.length ? s : null;
    };

    // let binds = {
    //   plant: params.Plant,
    //   processChart: '',
    //   productGroup: params.ProductGroup,
    //   qualityCode: params.QualityCode,
    //   tdcno: params.TDCNo,
    //   gradeDesc: params.GradeDesc
    // };


    const binds: Record<string, any> = {
      plant: toNullIfEmpty(params.Plant),
    };


    let sql = `select 
            PCM_PCHART_NO,
            PCM_VERSION,
            PCM_QCODE,
            PCM_TDC_NO,
            PCM_GRADE_DESC,
            PCM_GRADE_APPL,
            DECODE(PCM_STATUS,'C','Draft','A','Released','N','Not Active',' ') PCM_STATUS,
            PCM_PROD_GRP,PCM_PROD_SUBGRP,
            PCM_PROD_VERSION,PGM_PGRP_DESC,
            PCM_PROD_CATG
            from v_proc_chart_mast, v_prod_grp_mast 
            where PCM_PROD_GRP = PGM_PROD_GRP
            and PCM_PROD_VERSION = PGM_VERSION
            and PCM_PROD_SUBGRP = PGM_PROD_SUBGRP
            AND PCM_PLANT=:plant`
    if (params.Action ==='REACTIVATE') {
          sql += ` AND PCM_STATUS in('N','D')`;
        }else{
          sql += ` AND PCM_STATUS in('A')`;
        }
    // ProcessChart
    if (params.ProcessChart && params.ProcessChart !== '') {
      sql += ` AND pcm_pchart_no LIKE NVL(TRIM(UPPER(:processChart)), pcm_pchart_no)`;
      binds.processChart = String(params.ProcessChart).trim();
    }

    // TDCNo
    if (params.TDCNo && params.TDCNo !== '') {
      sql += ` AND UPPER(PCM_TDC_NO) LIKE UPPER(NVL(TRIM(:tdcNo), PCM_TDC_NO))`;
      binds.tdcNo = String(params.TDCNo).trim();
    }

    // QualityCode
    if (params.QualityCode && params.QualityCode !== '') {
      sql += ` AND UPPER(PCM_QCODE) LIKE UPPER(NVL(TRIM(:qualityCode), PCM_QCODE))`;
      binds.qualityCode = String(params.QualityCode).trim();
    }

    // ProductGroup
    if (params.ProductGroup && params.ProductGroup !== '') {
      sql += ` AND UPPER(PCM_PROD_GRP) LIKE UPPER(NVL(TRIM(:productGroup), PCM_PROD_GRP))`;
      binds.productGroup = String(params.ProductGroup).trim();
    }

    // GradeDesc
    if (params.GradeDesc && params.GradeDesc !== '') {
      sql += ` AND UPPER(PCM_GRADE_DESC) LIKE UPPER(NVL(TRIM(:gradeDesc), PCM_GRADE_DESC))`;
      binds.gradeDesc = String(params.GradeDesc).trim();
    }

    sql += ' ORDER BY 1,2 DESC';

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


export const getProcessChartSpec = async (params: { 
  Plant: any,
  ProcessChart: any,
  Version: any
}) => {
  const toNullIfEmpty = (v: any) => {
    if (v === undefined || v === null) return null;
    const s = String(v).trim();
    return s.length ? s : null;
  };

  try {

    console.log("In query page")
    console.log(params)
    const binds: Record<string, any> = {
      plant: toNullIfEmpty(params.Plant)
    };
    let sql =  `SELECT pcm_pchart_no, pcm_grade_desc,  
        SUM(a1) "%C (MIN_AIM)", 
        SUM(a2) "%C (MAX_AIM)", 
        SUM(a3) "%Mn (MIN_AIM)", 
        SUM(a4) "%Mn (MAX_AIM)", 
        SUM(a5) "%Si (MIN_AIM)", 
        SUM(a6) "%Si (MAX_AIM)", 
        SUM(a7) "%S (MIN_AIM)", 
        SUM(a8) "%S (MAX_AIM)", 
        SUM(a9) "%P (MIN_AIM)", 
        SUM(a10) "%P (MAX_AIM)", 
        SUM(a11) "%Cr (MIN_AIM)", 
        SUM(a12) "%Cr (MAX_AIM)", 
        SUM(a13) "%V (MIN_AIM)", 
        SUM(a14) "%V (MAX_AIM)", 
        SUM(a15) "N ppm (MIN_AIM)", 
        SUM(a16) "N ppm (MAX_AIM)", 
        SUM(a17) "Al (MIN_AIM)", 
        SUM(a18) "Al (MAX_AIM)", 
        SUM(a19) "Nb (MIN_AIM)", 
        SUM(a20) "Nb (MAX_AIM)", 
        SUM(a21) "Ti (MIN_AIM)", 
        SUM(a22) "Ti (MAX_AIM)", 
        SUM(a23) "B (MIN_AIM)", 
        SUM(a24) "B (MAX_AIM)",        
        SUM(a25) "%C (MIN_ACHV)", 
        SUM(a26) "%C (MAX_ACHV)",  
        SUM(a27) "%Mn (MIN_ACHV)", 
        SUM(a28) "%Mn (MAX_ACHV)",  
        SUM(a29) "%Si (MIN_ACHV)", 
        SUM(a30) "%Si (MAX_ACHV)",  
        SUM(a31) "%S (MIN_ACHV)", 
        SUM(a32) "%S (MAX_ACHV)",  
        SUM(a33) "%P (MIN_ACHV)", 
        SUM(a34) "%P (MAX_ACHV)",  
        SUM(a35) "%Cr (MIN_ACHV)", 
        SUM(a36) "%Cr (MAX_ACHV)",  
        SUM(a37) "%V (MIN_ACHV)", 
        SUM(a38) "%V (MAX_ACHV)",  
        SUM(a39) "N ppm (MIN_ACHV)", 
        SUM(a40) "N ppm (MAX_ACHV)",  
        SUM(a41) "Al (MIN_ACHV)", 
        SUM(a42) "Al (MAX_ACHV)",  
        SUM(a43) "Nb (MIN_ACHV)", 
        SUM(a44) "Nb (MAX_ACHV)",  
        SUM(a45) "Ti (MIN_ACHV)", 
        SUM(a46) "Ti (MAX_ACHV)",  
        SUM(a47) "B (MIN_ACHV)", 
        SUM(a48) "B (MAX_ACHV)"     
  From ( 
  SELECT pcm_pchart_no, pcm_grade_desc,  
  decode(pcs_mic_cd,'C',PCS_MIC_AIM_MIN) a1, 
  decode(pcs_mic_cd,'C',PCS_MIC_AIM_MAX) a2, 
  decode(pcs_mic_cd,'MN',PCS_MIC_AIM_MIN) a3, 
  decode(pcs_mic_cd,'MN',PCS_MIC_AIM_MAX) a4, 
  decode(pcs_mic_cd,'SI',PCS_MIC_AIM_MIN) a5, 
  decode(pcs_mic_cd,'SI',PCS_MIC_AIM_MAX) a6, 
  decode(pcs_mic_cd,'S',PCS_MIC_AIM_MIN) a7, 
  decode(pcs_mic_cd,'S',PCS_MIC_AIM_MAX ) a8, 
  decode(pcs_mic_cd,'P',PCS_MIC_AIM_MIN) a9, 
  decode(pcs_mic_cd,'P',PCS_MIC_AIM_MAX) a10, 
  decode(pcs_mic_cd,'CR',PCS_MIC_AIM_MIN) a11, 
  decode(pcs_mic_cd,'CR',PCS_MIC_AIM_MAX) a12, 
  decode(pcs_mic_cd,'V',PCS_MIC_AIM_MIN) a13, 
  decode(pcs_mic_cd,'V',PCS_MIC_AIM_MAX) a14, 
  decode(pcs_mic_cd,'N',PCS_MIC_AIM_MIN) a15, 
  decode(pcs_mic_cd,'N',PCS_MIC_AIM_MAX) a16, 
  decode(pcs_mic_cd,'AL',PCS_MIC_AIM_MIN)a17, 
  decode(pcs_mic_cd,'AL',PCS_MIC_AIM_MAX)a18, 
  decode(pcs_mic_cd,'NB',PCS_MIC_AIM_MIN)a19, 
  decode(pcs_mic_cd,'NB',PCS_MIC_AIM_MAX)a20, 
  decode(pcs_mic_cd,'TI',PCS_MIC_AIM_MIN)a21, 
  decode(pcs_mic_cd,'TI',PCS_MIC_AIM_MAX)a22, 
  decode(pcs_mic_cd,'B',PCS_MIC_AIM_MIN)a23, 
  decode(pcs_mic_cd,'B',PCS_MIC_AIM_MAX)a24, 
  decode(pcs_mic_cd,'C',PCS_MIC_Ach_MIN)a25, 
  decode(pcs_mic_cd,'C',PCS_MIC_Ach_Max)a26, 
  decode(pcs_mic_cd,'MN',PCS_MIC_ACH_MIN) a27, 
  decode(pcs_mic_cd,'MN',PCS_MIC_ACH_MAX) a28, 
  decode(pcs_mic_cd,'SI',PCS_MIC_ACH_MIN) a29, 
  decode(pcs_mic_cd,'SI',PCS_MIC_ACH_MAX) a30, 
  decode(pcs_mic_cd,'S',PCS_MIC_ACH_MIN) a31, 
  decode(pcs_mic_cd,'S',PCS_MIC_ACH_MAX) a32, 
  decode(pcs_mic_cd,'P',PCS_MIC_ACH_MIN) a33, 
  decode(pcs_mic_cd,'P',PCS_MIC_ACH_MAX) a34, 
  decode(pcs_mic_cd,'CR',PCS_MIC_ACH_MIN) a35, 
  decode(pcs_mic_cd,'CR',PCS_MIC_ACH_MAX) a36, 
  decode(pcs_mic_cd,'V',PCS_MIC_ACH_MIN) a37, 
  decode(pcs_mic_cd,'V',PCS_MIC_ACH_MAX) a38, 
  decode(pcs_mic_cd,'N',PCS_MIC_ACH_MIN) a39, 
  decode(pcs_mic_cd,'N',PCS_MIC_ACH_MAX) a40, 
  decode(pcs_mic_cd,'AL',PCS_MIC_ACH_MIN) a41, 
  decode(pcs_mic_cd,'AL',PCS_MIC_ACH_MAX) a42, 
  decode(pcs_mic_cd,'NB',PCS_MIC_ACH_MIN) a43, 
  decode(pcs_mic_cd,'NB',PCS_MIC_ACH_MAX) a44, 
  decode(pcs_mic_cd,'TI',PCS_MIC_ACH_MIN) a45, 
  decode(pcs_mic_cd,'TI',PCS_MIC_ACH_MAX) a46, 
  decode(pcs_mic_cd,'B',PCS_MIC_ACH_MIN) a47, 
  decode(pcs_mic_cd,'B',PCS_MIC_ACH_MAX) a48 
  FROM v_proc_chart_mast, v_proc_chart_spec  
  WHERE pcm_pchart_no = pcs_pchart_no  
  AND pcm_version = pcs_version 
  AND PCM_PLANT = PCS_CD_PLANT
  and pcm_status = 'A'`    
 if (params.Plant && params.Plant !== '') {
   sql += ` AND PCM_PLANT LIKE NVL(TRIM(UPPER(:plant)), PCM_PLANT)`;
      binds.plant = String(params.Plant).trim();
    }
    if (params.ProcessChart && params.ProcessChart !== '') {
      sql += ` AND pcm_pchart_no LIKE NVL(TRIM(UPPER(:processChart)), pcm_pchart_no)`;
      binds.processChart = String(params.ProcessChart).trim();
    }

    if (params.Version && params.Version !== '') {
      sql += ` AND pcm_version LIKE NVL(TRIM(UPPER(:version)), pcm_version)`;
      binds.version = String(params.Version).trim();
    }
   sql += `GROUP BY pcm_pchart_no, pcm_grade_desc,pcs_mic_cd,PCS_MIC_AIM_MIN,PCS_MIC_AIM_MAX,PCS_MIC_Ach_MIN,PCS_MIC_ACH_MAX  
  ) group by pcm_pchart_no, pcm_grade_desc order by pcm_pchart_no`

    console.log(sql)
    console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error)
    throw new Error.InternalServerError("Error!");

  }
}