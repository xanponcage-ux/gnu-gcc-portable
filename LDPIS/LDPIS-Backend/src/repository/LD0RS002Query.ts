import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";
import { ResponceData } from "../utils";

export const getRmList = async (status: any) => {
  try {
    let sql = ` select DISTINCT LOM_ID_PAR_COIL_NO from V_LDP_PRODN
        WHERE LOM_CD_STATUS= :status
        and LOM_CD_EPA='0780'`;
    let binds = {
      status: status,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeNoList = async (rmBatch: any, status: any) => {
  try {
    let sql = `select DISTINCT LOM_ID_BATCH from V_LDP_PRODN
        WHERE LOM_CD_STATUS = '${status}'
        and LOM_CD_EPA ='0780' `;

    if (rmBatch !== "") {
      sql += ` AND LOM_ID_PAR_COIL_NO = '${rmBatch}'`;
    }
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getPipeInfo = async (req: any) => {
  try {
    //Changed to accomodate pipe wt calculation logic
    let sql = `SELECT LOM_ID_BATCH, LOM_ID_PAR_COIL_NO,LOM_MS_PIECE_ACTL, 
    LOM_SEC1, LOM_SEC2,LOM_LENGTH AS LENGTH,LOM_ID_ORDER_CUS,
    LOM_ID_ORD_ITEM_CUS,LOM_NO_MATNR, LOM_SUR_FINISH SUR_FIN, LOM_END_FINISH END_FIN,
    TBP_WALL_THK_END_10 WALL_THICK_END, TBP_DEPTH_10 DEPTH_MM, TBP_WIDTHS_10 WIDTH_MM,
    (SELECT GEOMETRY FROM V_YMPCT_TUB_MATL WHERE MANDT = '600'
     AND MATNR = LOM_NO_MATNR) GEO
    FROM V_LDP_PRODN, V_BARE_PDO 
    WHERE (LOM_ID_BATCH = TBP_BATCH_NO or lom_id_par_coil_no = TBP_BATCH_NO)
    AND LOM_CD_EPA = TBP_PLANT_CD
    AND TBP_CD_PROC = '1' 
    AND LOM_ID_BATCH = :rmBatch `;

    // let sql = `SELECT LOM_ID_BATCH, LOM_ID_PAR_COIL_NO,LOM_MS_PIECE_ACTL,
    // LOM_SEC1, LOM_SEC2,LOM_LENGTH AS LENGTH,LOM_ID_ORDER_CUS,
    // LOM_ID_ORD_ITEM_CUS,LOM_NO_MATNR, LOM_SUR_FINISH SUR_FIN, LOM_END_FINISH END_FIN
    //               FROM V_LDP_PRODN
    //               WHERE LOM_ID_BATCH = :rmBatch
    //               AND LOM_CD_EPA ='0780'`;

    let binds = {
      rmBatch: req.RM_BATCH,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const tempInsert = async (newReworkData: any, parting: any) => {
  try {
    const sql = `call LDPDBA.LD0RB003(
      P_PLANT_CD   => :P_PLANT_CD,
      P_PARTED_PIPE   => :P_PARTED_PIPE,
      P_MOTHER_PIPE   => :P_MOTHER_PIPE,
      P_WEIGHT_PARTED   => :P_WEIGHT_PARTED,
      P_LENGTH_PARTED   => :P_LENGTH_PARTED,
      P_PART_COUNT   => :P_PART_COUNT,
      P_RESULT   => :P_RESULT,
      P_REMARK   => :P_REMARK,
      P_INSPECTOR   => :P_INSPECTOR,
      P_PARTING_FLAG   => :P_PARTING_FLAG,
      P_DECISION => :P_DECISION,
      P_MATERIAL => :P_MATERIAL,
      p_sur_finish => :p_sur_finish,
      p_end_finish => :p_end_finish,
      p_new_thk => :p_new_thk,
      LS_OUT_FLAG   => :LS_OUT_FLAG
      )`;

    let binds = {};
    binds = {
      P_PLANT_CD: "0780",
      P_PARTED_PIPE: newReworkData?.PIPEID,
      P_MOTHER_PIPE: newReworkData?.RM_BATCH,
      P_WEIGHT_PARTED: newReworkData?.PIPE_WEIGHT,
      P_LENGTH_PARTED: newReworkData?.LENGTH,
      P_PART_COUNT: newReworkData?.PARTNO,
      P_RESULT: newReworkData?.RESULT ? newReworkData?.RESULT : "OK",
      P_REMARK: newReworkData?.REMARK,
      P_INSPECTOR: newReworkData?.INSPECTOR,
      P_PARTING_FLAG: parting,
      P_DECISION: newReworkData?.txtDecision?.substr(0, 1) ?? "",
      P_MATERIAL: newReworkData?.txtMatNo ?? "",
      p_sur_finish: newReworkData?.SUR_FIN ?? "",
      p_end_finish: newReworkData?.END_FIN ?? "",
      p_new_thk: newReworkData?.EWI_SEC1 ?? "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };

    // console.log("bindsTemp: ", binds);

    let resTemp = await query.executeQuery(sql, binds);
    console.log("resTemp: ", resTemp);
    return resTemp;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const insertPipeDetails = async (newReworkData: any, parting: any) => {
  try {
    const sql = `call LDPDBA.LD0RB004(
      P_PLANT_CD => :P_PLANT_CD,
      P_MOTHER_PIPE => :P_MOTHER_PIPE,
      P_PART_COUNT => :P_PART_COUNT,
      P_PARTING_FLAG => :P_PARTING_FLAG,
      LS_OUT_FLAG => :LS_OUT_FLAG
      )`;

    let binds = {};
    binds = {
      P_PLANT_CD: "0780",
      P_MOTHER_PIPE: newReworkData?.[0]?.RM_BATCH,
      P_PART_COUNT: newReworkData?.[0]?.PARTNO,
      P_PARTING_FLAG: parting,
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    // console.log("bindsFin: ", binds);

    let resFin = await query.executeQuery(sql, binds);
    console.log("resFin: ", resFin);
    return resFin;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getMaterialNo = async (data: any) => {
  try {
    let sql = "";
    // console.log(data);
    if (data?.type === "SCRAP") {
      sql = ` select CD_VALUE MAT_NO, CD_VALUE ||' - '|| CD_DESC MAT_DESC from V_CODES WHERE CD_TYPE='TB042A'`;
    } else if (data?.type === "DOWNGRADE") {
      sql = `select TDM_DWN_MATNR_NO AS MAT_NO from  V_DOWNGRADE_MATL,V_LDP_PRODN
      WHERE TDM_CD_PLANT='0780' 
      AND TDM_MATNR_NO=LOM_NO_MATNR
      AND LOM_ID_BATCH='${data?.pipeid}'
      AND TDM_CATEGORY='FG_MAT'`;
    }

    // console.log("MATNO: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const dltTempData = async (mBatch: any) => {
  try {
    let sql = ` DELETE FROM v_bare_pdo_temp
            WHERE tbp_par_coil_no = '${mBatch}' AND tbp_cd_proc = 'R'
            AND NVL(TBP_FLD_NO_130,'-') ='FG-REWORK' `;

    // console.log("sql:: ", sql);
    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//Added for pipe wt calculation logic
export const getPipeWeight = async (data: any) => {
  try {
    const sql = `SELECT f_get_piece_actl(
            :p_plant ,
            :p_batch_id ,
            :p_no_pcs ,
            :p_length ,
            :p_od,
            :p_id,
            :p_thickness,
            :p_depth,
            :p_width,
            :p_geo
        ) as WEIGHT FROM dual`;

    let binds = {
      p_plant: data?.p_plant ?? "",
      p_batch_id: data?.p_batch_id ?? "",
      p_no_pcs: "1",
      p_length: data?.p_length ?? "",
      p_od: data?.p_od ?? "",
      p_id: "0",
      p_thickness: data.p_thickness ?? "",
      p_depth: data?.p_depth ?? "",
      p_width: data?.p_width ?? "",
      p_geo: data?.p_geo ?? "",
    };
    // console.log(binds);
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getGeometry = async (data: any) => {
  try {
    let sql = `select geometry from v_ympct_tub_matl 
    where mandt='600' and matnr='${data?.matNo}'`;

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

//Material Tab Apis
export const getMatTabData = async (props: any) => {
  try {
    let sql = `select lom_id_batch BATCHID,LOM_SEC1 Thk
      ,LOM_SEC2 Odia
      ,LOM_LENGTH LENGTH
      ,LOM_MS_PIECE_ACTL net_wt
      ,LOM_TDC_ACTL Grade
      ,LOM_CD_STATUS Status
      ,LOM_PLANNED_PROC Planned_Proc
      ,LOM_PASSED_PROC Passed_Proc
      ,LOM_CD_CURR_PROC curr_proc
      ,LOM_CD_NEXT_PROC Next_Proc
      ,LOM_ID_PAR_COIL_NO Parent_Batch
      ,LOM_ID_FIRST_PAR   Mother_Batch
      ,LOM_ID_ORDER_CUS Ord
      ,LOM_ID_ORD_ITEM_CUS Item
      ,LOM_MILL_NO Mill_No
      ,LOM_SAMPL_TAG Sample_Tag
      ,To_char(LOM_TS_CREATION,'yyyy-MM-dd HH24:MI:SS') Batch_crt_dt
      ,LOM_TAGGED_BATCH TAGGED_BATCH
      --,LOM_NO_MATNR MAT_NO
      ,LOM_SUR_FINISH SUR_FIN
      ,LOM_END_FINISH END_FIN
      from v_ldp_prodn
      where lom_cd_status in ('WF' ) -- FIXED
      and LOM_SE_UPD_FL = 'Y'
      ORDER BY Batch_crt_dt DESC`;

    return await query.executeQuery(sql);
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const validateData = async (data: any) => {
  try {
    const sql = `SELECT LDPDBA.F_VALIDATE_ATTR(
        :p_batch,
        :p_new_material,
        :ls_new_thk,
        :ls_new_length
    ) AS result FROM dual`;

    let binds = {
      p_batch: data?.batchId ?? "",
      p_new_material: data?.matnr ?? "",
      ls_new_thk: data?.thick ?? "",
      ls_new_length: data?.length ?? "",
    };

    let result = await query.executeQuery(sql, binds);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const saveData = async (data: any) => {
  try {
    const sql = `call LDLTB004(
        LS_BATCH    => :LS_BATCH,
        ls_sur_fn   => :ls_sur_fn,
        ls_end_fn   => :ls_end_fn,
        ls_thk    => :ls_thk,
        ls_length   => :ls_length,
        ls_fg_matnr   => :ls_fg_matnr,
        ls_comment    => :ls_comment,
        ls_spl_comment  => :ls_spl_comment,
        LS_OUT_FLAG   => :LS_OUT_FLAG
        )`;

    let binds = {
      LS_BATCH: data?.batchId ?? "",
      ls_sur_fn: data?.surFin ?? "",
      ls_end_fn: data?.endFin ?? "",
      ls_thk: data?.thick ?? "",
      ls_length: data?.length ?? "",
      ls_fg_matnr: data?.matnr ?? "",
      ls_comment: data?.comment ?? "",
      ls_spl_comment: data?.splComment ?? "",
      LS_OUT_FLAG: {
        type: oracledb.STRING,
        dir: oracledb.BIND_OUT,
        maxSize: 500,
      },
    };
    // console.log("binds:: ", binds);
    let result = await query.executeQuery(sql, binds);
    // console.log("result: ", result);
    return result?.outBinds?.LS_OUT_FLAG;
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getUserAccess = async () => {
  try {
    return {
      matTabAccess: await ResponceData(
        await query.executeQuery(
          `select cd_value users from v_codes where cd_type = 'TB049'`
        )
      ),
      splComntAccess: await ResponceData(
        await query.executeQuery(
          `select cd_value users from v_codes where cd_type = 'TB050'`
        )
      ),
    };
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};

export const getDropdown = async () => {
  try {
    return {
      surfCond: await ResponceData(
        await query.executeQuery(
          `select distinct OPD_SUR_COND SURF_COND from v_ord_path_dtls`
        )
      ),
      endFin: await ResponceData(
        await query.executeQuery(
          `select distinct OPD_END_FINISH END_FIN from v_ord_path_dtls`
        )
      ),
    };
  } catch (error) {
    console.log(error);
    throw new Error.InternalServerErrorMsg(error);
  }
};
