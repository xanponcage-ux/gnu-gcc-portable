// Run: node LDPIS/tests/ld11-excel-upload.cjs (Node 22.6+).
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { stripTypeScriptTypes } = require("node:module");
const root = path.resolve(__dirname, "..");
const read = p => fs.readFileSync(path.join(root, p), "utf8");
const helper = read("LDPIS-Frontend/src/views/Mill/ld11ExcelUpload.js").replace(/export /g,"");
const ctx = vm.createContext({});
vm.runInContext(helper+"\nthis.api={parseInspectionRows,mergeInspectionRow,validateInspectionRow};",ctx);
const {parseInspectionRows:parse,mergeInspectionRow:merge,validateInspectionRow:validate}=ctx.api;
const parsed=parse([["Pipe_No","RESULT","PIPE_TEMP_BEFORE_CHROMATE"],["000123","ok",0]]);
assert.equal(parsed[0].pipeNo,"000123");
assert.equal(parsed[0].values.PIPE_TEMP_BEFORE_CHROMATE,0);
assert.equal(parsed[0].values.RESULT,"OK");
for(const rows of [[],[["Pipe_No"]],[["Pipe_No"],[123]],[["Pipe_No"],["A"],["A"]],[["Pipe_No","MATERIAL"],["A","bad"]]]) assert.throws(()=>parse(rows));
const base={PIPE_NO:"A",MATERIAL:"DB",RESULT:"OK",DEGREE_CLEANLINESS:"SA2.5",REMARKS:"Default",INSP_NAME:"Inspector"};
const merged=merge(base,{REMARKS:"Excel",MATERIAL:"BAD",PIPE_TEMP_BEFORE_CHROMATE:0});
assert.equal(merged.MATERIAL,"DB");assert.equal(merged.REMARKS,"Excel");assert.equal(validate(merged),"");
assert(validate({...merged,INSP_NAME:""}));assert(validate({...merged,RESULT:"INVALID"}));
(async()=>{
  const source=read("LDPIS-Backend/src/repository/LD11S001Query.ts");
  const start=source.indexOf("\nexport const getFillData =");
  const next=source.indexOf("\nexport const ",start+1);
  const code=source.slice(start,next<0?undefined:next).replace("export const","const");
  let query;
  const db=vm.createContext({console:{log(){}},Error,query:{executeQuery:async(sql,binds)=>{query={sql,binds};return {};}}});
  vm.runInContext(stripTypeScriptTypes(code)+"\nthis.run=getFillData;",db);
  await db.run({PIPE_NO:"A'B",STATUS:"CC"});
  assert.equal(query.binds.pipeNo,"A'B");assert(!query.sql.includes("A'B"));assert(query.sql.includes("LOM_CD_STATUS = :status"));
  await db.run({ORDNO:"O1",ORDITEM:"1",STATUS:"CC"});
  assert.equal(query.binds.orderNo,"O1");assert.equal(query.binds.orderItem,"1");
  await db.run({STATUS:"CC"});assert(query.sql.includes("AND 1=0"));
  const ui=read("LDPIS-Frontend/src/views/Mill/LD11S001.jsx");
  const s=ui.indexOf("  const bindAppData =");
  const e=ui.indexOf("\n};",s)+4;
  const state={console:{log(){},error(){}},...ctx.api,loading:false,excelRows:[{pipeNo:"A",values:base},{pipeNo:"MISSING",values:base}],
    GetAuthorization:async()=>({accessToken:"test"}),Date,Map,
    document:{getElementById:id=>({value:new Date(Date.now()-(id==="prodStartDate"?3600000:60000)).toISOString()})},
    alertify:{error:m=>{state.error=m;}},setLoading(){},setAppTable:v=>{state.rows=v;},setSelectedAppTable(){},setExcelMessage:m=>{state.message=m;},
    axiosAPI:{post:async(url,body)=>{assert(url.endsWith("/getFillData"));return {status:200,data:body.PIPE_NO==="A"?[{TBP_BATCH_NO:"A",TBP_NO_MATNR:"DB",LOM_MS_PIECE_ACTL:12}]:[]};}},
  };
  // Initialise existing form state referenced by the actual fill function.
  for(const m of ui.matchAll(/const \[(\w+),/g)) if(!(m[1] in state))state[m[1]]="";
  state.selectedResult={};state.pipeno=null;state.rmBatchId=null;
  const fill=vm.createContext(state);
  vm.runInContext(ui.slice(s,e)+"\nthis.run=bindAppData;",fill);
  await fill.run();
  assert.equal(state.error,undefined);assert.equal(state.rows.length,1);
  assert.equal(state.rows[0].MATERIAL,"DB");assert.equal(state.rows[0].REMARKS,"Default");assert(state.message.includes("MISSING"));
  const goodRow = {...state.rows[0], INSP_NAME:"Excel inspector", A1:0, FB12:25};
  state.axiosAPI.post=async()=>({status:200,data:[{TBP_BATCH_NO:"A"},{TBP_BATCH_NO:"A"}]});
  await fill.run();
  assert(state.error.includes("Multiple records"));assert.equal(state.rows.length,0);
  state.error=undefined;
  state.axiosAPI.post=async()=>{throw new Error("Lookup failed");};
  await fill.run();
  assert(state.error.includes("Lookup failed"));assert.equal(state.rows.length,0);
  // Run the real save path and verify Excel inspector/zero/flow values reach the API.
  state.selectedAppTable={getSelectedRows:()=>[{getData:()=>goodRow,_row:{data:goodRow}}]};
  state.inspectorname="Screen inspector";
  state.showErrorAlert=()=>{};
  let saved;
  state.axiosAPI.post=async(url,body)=>{assert(url.endsWith("/insertTempData"));saved=body.selectedRowsData;return {statusText:"OK",data:{successCount:0,failedCount:1}};};
  const saveStart=ui.indexOf("    const updateData =");
  const saveEnd=ui.indexOf("    const getTataDate =",saveStart);
  vm.runInContext(ui.slice(saveStart,saveEnd)+"\nthis.save=updateData;",fill);
  await fill.save();
  assert.equal(saved[0].INSP_NAME,"Excel inspector");
  assert.equal(saved[0].EPGUN_1_110,0);assert.equal(saved[0].FLWRATE_24_110,25);
  saved=undefined;goodRow.INSP_NAME="";
  await fill.save();assert.equal(saved,undefined);
  console.log("PASS: parsing, precision/zero preservation, duplicates, identity whitelist, required values, bound queries, actual multi-pipe fill and skipped rows");
})().catch(e=>{console.error(e);process.exitCode=1;});
