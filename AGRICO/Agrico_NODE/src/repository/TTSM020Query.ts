import query from "../infrastructure/database/querys";
import { Post } from "../typed/typed";
import Error from "../models/errors";
import oracledb from "oracledb";

export const getTubePlanData = async (plant: any ,Order1: any,Item: any,div: any,orderType: any,MatNo: any,ORDDTFROM: any,ORDDTTO: any,tdc: any,thickFrm: any,thickTo: any,widthFrm: any,widthTo: any,cust: any) => {
    try {
    
  //  let  sql = `SELECT EOP_ID_ORDER,EOP_NO_ITEM,EOP_SEC1,EOP_SEC2,EOP_LENGTH,EOP_FINISH,EOP_ID,EOP_OD,EOP_FG_MATNR,EOP_FG_MATNR_DESC,
  //  EOP_QTY,EOP_BAL_QTY,EOP_FREE_FG_STOCK,EOP_NET_BAL_QTY,EOP_WIP_QTY,EOP_WIP_SO_QTY,EOP_TOT_WIP,EOP_BAL_TO_PROD,EOP_RM_QTY,
  //  EOP_FREE_FG_STOCK,EOP_NET_BAL_QTY,EOP_WIP_QTY,EOP_WIP_SO_QTY,EOP_TOT_WIP,EOP_BAL_TO_PROD,EOP_RM_QTY,
  //  EOP_REQ_RM_QTY,EOP_RM_QTY_SHORTFALL,EOP_SFG_MATNR_BOM,EOP_SFG_MATNR_DESC,EOP_RM_MATNR_BOM,EOP_CUST_CD,EOP_CUST_NM,EOP_CITY,
  //  EOP_ORD_EDGE,EOP_CD_EPA,EOP_ORD_DT,EOP_SALES_ORG,EOP_SALES_OFFICE,EOP_REF_STD,EOP_RM_MATNR_DESC,EOP_SHIP_TO,
  //   (Select name1 from v_kna1 where mandt='600' and kunnr = EOP_SHIP_TO and rownum=1 )Ship_To_Party_Desc,
  //  EOP_OLD_MATNR,EOP_REGION,EOP_STATE,EOP_MAT_GRP,EOP_DISPATCHED_QTY,EOP_SO_ASSIGNED_QTY,EOP_TOT_SO_PROD_QTY,
  //  EOP_END_FINISH,EOP_RM_MATNR_PCODE,EOP_RM_MATNR_QCODE,EOP_RM_MATNR_THK
  //  FROM V_EPA_ORDER_PROG WHERE EOP_CD_EPA  =:plant`;

  ///////////

      // let sql = `
      // SELECT  
      //         NVL(EOP_CD_EPA , ' ') Plant
      //       ,NVL(EOP_ID_ORDER , ' ') OrderNo
      //       ,NVL(EOP_NO_ITEM , 0) OrderItem
      //       ,NVL(EOP_SEC1 , 0) Thickness
      //       ,NVL(EOP_SEC2 , 0) Width_Odia
      //       ,NVL(EOP_CUST_CD , ' ')  Cust_Code
      //       ,NVL(EOP_CUST_NM , ' ')    Cust_NM
      //       ,NVL(EOP_QTY , 0)    Ord_Qty
      //       ,NVL(EOP_BAL_TO_PROD,0) Balance_To_Plan_TO
      //       ,NVL(EOP_WIP_QTY ,0) WIP_KG
      //       ,NVL(EOP_FG ,0) FG_KG
      //       ,NVL(EOP_QA ,0) QA_KG
      //       ,NVL(EOP_SCHEDULED,0) Schedule_in_KG
      //       ,NVL(EOP_ALLOTED ,0) Alloted_TO
      //       ,NVL(EOP_PKG,0)    Pending_For_PKG_KG
      //       ,NVL(EOP_FREE_FG_STOCK,0 ) RM_Free_Stock_TO
      //       ,NVL(EOP_DISPATCHED_QTY,0) Dispatched_TO
      //       ,NVL(EOP_LENGTH , 0) Length
      //       ,NVL(EOP_FINISH , ' ') Finish
      //       ,NVL(EOP_ID , 0) Idia
      //       ,NVL(EOP_OD , 0) Odia
      //       ,NVL(EOP_FG_MATNR , ' ')   FG_Matnr
      //       ,NVL(EOP_FG_MATNR_DESC , ' ') FG_Matnr_Desc
      //       ,NVL(EOP_SFG_MATNR_BOM , ' ') SFG_Matnr
      //       ,NVL(EOP_SFG_MATNR_DESC , ' ') SFG_Matnr_Desc
      //       ,NVL(EOP_RM_MATNR_BOM , ' ')   RM_Matnr
      //       ,NVL(EOP_RM_MATNR_DESC , ' ') RM_Matnr_Desc
      //       ,NVL(EOP_CITY , ' ')       City
      //       ,NVL(EOP_ORD_EDGE , ' ')   Order_Edge
      //       ,TO_CHAR(EOP_ORD_DT,'DD-MON-YYYY HH24:MI:SS')     Order_Crt_DT
      //       ,NVL(EOP_SALES_ORG, ' ')  Sales_Org
      //       ,NVL(EOP_SALES_OFFICE , ' ') Sales_Office
      //       ,NVL(EOP_REGION , ' ') Region
      //       ,NVL(EOP_STATE , ' ') Status
      //       ,NVL(EOP_MAT_GRP , ' ') Mat_Group
      //       ,NVL(EOP_END_FINISH , ' ') End_Finish
      //       ,NVL(EOP_CD_COMP , ' ')   Comp
      //       ,NVL(EOP_ACTIVE_STATUS , ' ') Order_Active_Flag,
      //       NVL(EOP_QTY-((EOP_FG/1000) + (EOP_WIP_QTY/1000)),0) BTR,
      //       NVL(EOP_QTY-((EOP_FG/1000)),0) BTF,
      //       NVL(EOP_QTY-((EOP_FG/1000) + (EOP_WIP_QTY/1000) - (EOP_ALLOTED/1000)),0) BTA
      //       ,NVL(( SELECT DISTINCT ENC_ORDER_TYPE FROM V_END_CUST_ORD_EPA WHERE EOP_CD_EPA = ENC_CD_EPA AND EOP_ID_ORDER = ENC_ID_ORDER AND EOP_NO_ITEM = ENC_NO_ITEM AND ROWNUM = 1 ) , ' ') ORDER_TYPE
      //       FROM V_EPA_ORDER_PROG
      //       WHERE EOP_CD_EPA  =:plant `


       /////////////////////////////////////

       let sql = `  SELECT 
       EOP_CD_EPA --0
      ,TO_CHAR(EOP_ORD_DT, 'DD-MM-YYYY') Ord_Crt_Dt  --1
      ,EOP_ID_ORDER Order_no  --2
      ,EOP_NO_ITEM  Order_Item  ---3
      ,EOP_ORDER_TYPE Order_Type ---4
      ,NVL(EOP_DIV, ' ') Division -- EOP_DIV         ---5
      ,NVL(EOP_SALES_OFFICE, ' ') SalesOffice     ----6
      ,EOP_CUST_NM MarkCustNm    ---7
      ,EOP_FG_MATNR FGMaterial            ----8
      ,EOP_FG_MATNR_DESC FGMaterialDesc   ---9
      ,NVL(EOP_END_FINISH, ' ') End_Finish              ----10
      ,EOP_SEC2 Odia_Width                ----11
      ,EOP_ID IDIA                          ---12
      ,EOP_SEC1 Thickness                 -----13
      ,EOP_LENGTH Length1                  -----14
      ,EOP_RECV_PLANT RecvPlant                       ----15
      ,EOP_QTY OrdQty                     -----16
      ,EOP_DISPATCHED_QTY Dispatched         
      ,EOP_FG FG_Ton                      -----17
      ,EOP_TOT_WIP WIP_Ton                ----18
      ,EOP_SO_ASSIGNED_QTY gr_qty                           ----19
      ,EOP_TOT_SO_PROD_QTY bal_to_gr                        ---20
      ,EOP_BAL_QTY  BTR_Ton               ---21   WITHOUT TOLERANCE
      ,EOP_ALLOTED    RMAlloted           ---22
      ,(EOP_BAL_QTY- EOP_ALLOTED ) BTA_RM_TON      ---23
      ,(EOP_QTY-EOP_DISPATCHED_QTY) BTD   --24
      ,ROUND((SYSDATE-EOP_ORD_DT)) Age_Days      --25
      ,NVL(EOP_SFG_MATNR_BOM, ' ')      sfgMaterial  --26
      ,NVL(EOP_SFG_MATNR_DESC, ' ')     sfgMaterial_Desc ---27
      ,NVL((SELECT NVL(TDCNO,'') FROM YMT_MATCHAR WHERE MANDT='600' AND MATNR=EOP_RM_MATNR_BOM AND ROWNUM=1), ' ') RM_TDC           ---28
      ,NVL((SELECT OUT_DIA FROM V_YMPCT_TUB_MATL WHERE MANDT='600' AND MATNR=EOP_SFG_MATNR_BOM), 0) SFG_ODIA      --29
      ,NVL((SELECT IN_DIA FROM V_YMPCT_TUB_MATL WHERE MANDT='600' AND MATNR=EOP_SFG_MATNR_BOM), 0)  SFG_IDIA      --30
      ,NVL((SELECT THICKNESS FROM V_YMPCT_TUB_MATL WHERE MANDT='600' AND MATNR=EOP_SFG_MATNR_BOM), 0) SFG_THK    --31
      ,NVL((SELECT LENGTH FROM V_YMPCT_TUB_MATL WHERE MANDT='600' AND MATNR=EOP_SFG_MATNR_BOM), 0) SFG_LENGTH ----- SFG_LENGTH
      ,NVL((SELECT NVL(PCODE,'') FROM YMT_MATCHAR WHERE MANDT='600' AND MATNR=EOP_RM_MATNR_BOM AND ROWNUM=1), ' ') FG_PCODE           ---32
      ,NVL((SELECT GRADE FROM V_YMPCT_TUB_MATL WHERE MANDT='600' AND MATNR=EOP_FG_MATNR), ' ') FG_GRADE     --33
      ,NVL(EOP_SALES_ORG, ' ') SalesOrg
      ,EOP_SHIP_TO ||'-'||EOP_SHIP_TO_PARTY ship_to_party
      ,NVL(EOP_MAT_GRP, ' ') MAT_GRP
      ,NVL(DRAW_TYPE, ' ') DrawType
      ,EOP_MK_SPEC_COMPLETE Material_Spec
      ,NVL(SUR_FINISH, ' ') SurfFinish
       ,NVL(CATEGORY, ' ') Categ
         ,NVL(CLASS, ' ')  Class
           ,NVL(GEOMETRY, ' ') Geometry
      ,EOP_CUST_CD CUST_CD
      ,NVL(EOP_RM_MATNR_BOM, ' ')      RMMaterial  --26
      ,NVL(EOP_RM_MATNR_DESC, ' ')     RMMaterial_Desc ---27
      ,EOP_ORD_EDGE ORDER_EDGE
      ,EOP_CITY
      ,EOP_ORD_EDGE
      ,EOP_REGION
      ,TO_CHAR(EOP_CRT_DT, 'DD-MM-YYYY HH24:MI:SS') AS LAST_REFRESH_TIME
      ,EOP_CD_COMP  COMP
      ,EOP_ACTIVE_STATUS ORDER_STATUS
      ,EOP_BAL_TO_PLAN
      , EOP_FG
      , EOP_QA   
      , EOP_SCHEDULED             ---67
      , EOP_PKG  
      ,EOP_FREE_FG_STOCK
      ,EOP_BTF BTF
      ,NVL(TO_CHAR(EOP_DT_ORD_FULFILL, 'DD-MM-YYYY'),' ') AS DT_ORD_FULFILL
      ,decode(EOP_DT_ORD_FULFILL , null,'',ROUND(EOP_DT_ORD_FULFILL-EOP_ORD_DT)) LEAD_DAY
      FROM V_EPA_ORDER_PROG, v_ympct_tub_matl
      WHERE  EOP_FG_MATNR = matnr(+)
      AND EOP_ORD_DT >= SYSDATE-365
      AND EOP_CD_EPA  =:plant `


      type jsonObj = {
        [key: string]: any;  
      };
      var binds:jsonObj = {};
      binds.plant=plant;
      if (Order1 == "") {
        sql = sql + ""
      }
      else
      {
        binds.Order1=Order1;
  
        sql =  sql + " And EOP_ID_ORDER =:Order1 ";
      }
      if (MatNo == '') {
        sql = sql + ""
      }
      else
      {
        binds.MatNo=MatNo;
        sql =  sql +" And EOP_FG_MATNR like '%'||:MatNo||'%' ";
      }
      if (Item == '') {
        sql =   sql + ""
      }
      else
      {
        binds.Item=Item;
        sql =  sql +" And EOP_NO_ITEM =:Item ";
      }
      if (div == '') {
        sql =   sql + ""
      }
      else
      {
        binds.div=div;
        sql =  sql +" And EOP_DIV =:div ";
      }
      if (orderType == '') {
        sql =   sql + ""
      }
      else
      {
        binds.orderType=orderType;
        sql =  sql +" And EOP_ORDER_TYPE =:orderType ";
      }
      if (tdc == '') {
        sql =  sql + ""
      }
      else
      {
        binds.tdc=tdc;
        sql =  sql +" And EOP_RM_MATNR_TDC = :tdc ";
      }
      if (thickFrm == '') {
        sql =  sql + ""
      }
      else
      {
        binds.thickFrm=thickFrm;
        binds.thickTo=thickTo;
        sql =   sql +" And EOP_SEC1 BETWEEN  NVL(:thickFrm,EOP_SEC1) AND NVL(:thickTo,EOP_SEC1) ";
      }
      if (widthFrm == '') {
        sql =  sql + ""
      }
      else
      {
        binds.widthFrm=widthFrm;
        binds.widthTo=widthTo;
        sql =  sql +" And EOP_OD BETWEEN  NVL(:widthFrm,EOP_OD) AND NVL(:widthTo,EOP_OD) ";
      }
      if (ORDDTFROM == '') {
        sql =  sql + ""
      }
      else
      {
        binds.ORDDTFROM=ORDDTFROM;
        binds.ORDDTTO=ORDDTTO;
        sql =  sql +"       And TRUNC(EOP_ORD_DT) BETWEEN NVL(:ORDDTFROM, TRUNC(EOP_ORD_DT)) And  NVL(:ORDDTTO, NVL(:ORDDTFROM, TRUNC(EOP_ORD_DT))) ";
      }
  if (cust == "")
  {
    sql =sql + ""
  }
  else
   {
    binds.cust=cust;
    sql = sql + " and EOP_CUST_CD =:cust ";
   }
     
   sql += ` ORDER BY EOP_CD_EPA,ORDER_NO,ORDER_ITEM,ORD_CRT_DT `;

      console.log("/////////////////////////",sql,binds)
      return await query.executeQuery(sql, binds);
    
    } 
    catch (error) {
      throw new Error.InternalServerError("Error!");
      
    }
  };

  export const getPlanModalData = async (plant: any,Order1: any,Item: any) => {
    try {
      // const sql = `SELECT * FROM V_TUBE_PLANNING WHERE MANDT='600'and VBELN=:Order1 AND POSNR=:Item AND WERKS=:plant`;
      const sql  = `SELECT NVL(EOM_CD_EPA , ' ') PLANT,  NVL(EOM_ID_BATCH , ' ') BATCH, NVL(EOM_MS_GROSS_CAL , 0) NET_WT , NVL(EOM_CD_STATUS , ' ') STATUS
            FROM V_EPA_PRODN
            WHERE EOM_CD_ePA= :plant
            AND EOM_ID_ORDER_CUS= :Order1
            AND EOM_ID_ORD_ITEM_CUS = :Item`;

      let binds = {plant:plant,Order1:Order1,Item:Item};
      
      return await query.executeQuery(sql, binds);
    } catch (error) {
      throw new Error.InternalServerError("Error!");
    }
  };

  export const getOdiaFrm = async (plant : any) => {
    try {
        const sql = `SELECT DISTINCT round(ENC_SEC2_MAX,3) ENC_SEC2_MAX FROM V_END_CUST_ORD_ePA
        WHERE ENC_CD_EPA=:plant
        AND ENC_ST_ORDER='A'
        ORDER BY 1 DESC`;
        const binds = {
            plant : plant
                    }
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};


export const getOdiaTo = async (plant : any) => {
    try {
        const sql = `SELECT DISTINCT  round(ENC_IDIA,3) ENC_IDIA
        FROM V_END_CUST_ORD_ePA
        WHERE ENC_CD_EPA= :plant
        AND ENC_ST_ORDER='A'
        ORDER BY 1 DESC`;
        const binds = {
            plant : plant
                    }
        return await query.executeQuery(sql, binds);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};

export const getOrderType = async (plant : any) => {
  try {
      const sql = ` SELECT DISTINCT CD_DESC EOP_ORDER_TYPE FROM V_CODES 
      WHERE CD_TYPE = 'TB052' AND CD_VALUE  = :plant `;
      const binds = {
          plant : plant
                  }
                  console.log(sql, binds)
      return await query.executeQuery(sql, binds);
  } catch (error) {
      throw new Error.InternalServerError("Error!");
  }
};

export const getRefresh = async () => {
    try {
        const sql = `call P_INSERT_ORDER_PROG()`;
        return await query.executeQuery(sql);
    } catch (error) {
        throw new Error.InternalServerError("Error!");
    }
};