import query from "../infrastructure/database/querys";
import Error from "../models/errors";
import oracledb from "oracledb";



// export const getPlant = async () => {
//   try {
//     const sql = `SELECT DISTINCT CD_VALUE
//         FROM V_CODES WHERE  CD_TYPE='TB065'`;
//     // let binds = [`${id}`];
//     return await query.executeQuery(sql);
//   } catch (error) {
//     throw new Error.InternalServerError("Error!");
//   }
// };

export const getFgProdData = async (Plant: any, fromDate :any, toDate:any) => {
  try {
      let sql = `SELECT * FROM V_MDMISKPI_REMARKS WHERE 
      MR_PLANT ='All Tubes' AND
       MR_DATE BETWEEN TO_DATE(:FROMDATE,'DD-MON-YYYY') AND TO_DATE(:TODATE,'DD-MON-YYYY')order by MR_DATE desc`;
    let binds: any = {
      // PLANT: Plant,
      FROMDATE: fromDate,
      TODATE: toDate,
    };

    console.log('sql->', sql);
    console.log('binds->', binds);
    return await query.executeQuery(sql, binds);
  } catch (err) {
    // Keep your custom error type usage
    throw new Error.InternalServerError("Failed to fetch compaign details data." + err);
  }
};

export const updateRemarks = async (Plant: any,REMARKS: any,OSP: any) => {
  try {
    var sql = `UPDATE TUBEDBA.T_MDMISKPI_REMARKS SET 
    MR_REMARKS = :REMARKS,
    MR_OSP=:OSP,
    MR_UPDATED_BY = USER,
    MR_UPDATED_DATE = SYSDATE
    WHERE 
    MR_DATE = TRUNC(SYSDATE-1)
    AND MR_PLANT= :PLANT`;

    const binds = {
      REMARKS: REMARKS,
      PLANT: Plant,
      OSP : OSP,
    };
    return await query.executeQuery(sql, binds);
  } catch (error) {
    console.log('updateRemarks error -> ', error);
    throw new Error.InternalServerError("Error!");
  }
};