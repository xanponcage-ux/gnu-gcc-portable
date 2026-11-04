import { Router } from "express";
import auth from "../middlewares/authenticationMiddleware";
import {handleSwap} from "../repository/LD01S011Query";
import UserModel from "../models/usersModel";
const router=Router();
for(const action of ["batches","order","swap"]){
  router.post("/"+action,auth.bearer,async(req,res)=>{
    try {
      const a:any=await UserModel.prototype.AuthDetails(req.user as any,"LD01S011","0780");
      const flags=a.outBinds;
      if(flags?.PS_AUTH_USER_SCR!=="Y" || flags?.PS_AUTH_USER_TSM!=="Y" || (action==="swap" && flags.LS_READ_WRITE_FLAG!=="RL_RW")){
        res.status(403).json({message:"Not authorized for LD01S011."});return;
      }
      res.json(await handleSwap(action,req.body));}
    catch(e){res.status(400).json({message:e instanceof Error?e.message:"Order swap failed."});}
  });
}
export default router;
