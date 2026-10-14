// Run from the rough repository root with Node 24+:
// node LDPIS/tests/oct14-screen-changes.cjs
// Exercises actual controllers, repository queries, and UI handlers with mocked dependencies.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { stripTypeScriptTypes } = require('node:module');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const noop = () => {};
const quiet = { log: noop, error: noop };
function ts(file, context) {
  vm.createContext(context);
  vm.runInContext(stripTypeScriptTypes(read(file).replace(/^import .*;\n/gm, '').replace(/export const /g, 'var ')), context);
  return context;
}
function response() { return {status(n) {this.code=n;return this;},json(data) {this.body=data;return this;}}; }
function handler(source, name, ctx) {
  const start=source.indexOf(`const ${name} =`);
  assert.ok(start >= 0, name);
  const indent=source.slice(source.lastIndexOf('\n',start)+1,start);
  const match=source.slice(start).match(new RegExp('\\n'+indent+'};'));
  assert.ok(match, name);
  vm.runInContext(source.slice(start,start+match.index+match[0].length).replace(`const ${name}`,`var ${name}`), ctx);
}
function ui(screen, responseData, dataRows=[]) {
  const source=read(`LDPIS-Frontend/src/views/${screen}`);
  const ctx={console:quiet,Date,Set,document:{getElementById:()=>({value:new Date().toISOString()})},
    errors:[],successes:[],calls:[],deleted:[],rows:dataRows,GetAuthorization:async()=>({accessToken:'test'}),
    alertify:{error:m=>ctx.errors.push(m),success:m=>ctx.successes.push(m)},showErrorAlert:m=>ctx.errors.push(m),
    formatDateTimeForSave:()=>'',formatDateForTable:()=>'',handleAllBelow:noop,fetchDetails:noop,
  };
  for(const m of source.matchAll(/const\s*\[\s*(\w+)\s*,\s*(\w+)\s*\]\s*=/g)){
    ctx[m[1]]='';ctx[m[2]]=value=>ctx[m[1]]=value;
  }
  ctx.axiosAPI={post:async(url,data)=>{ctx.calls.push({url,data});return {status:200,statusText:'OK',data:responseData};}};
  const components=dataRows.map(data=>({_row:{data},getData:()=>data,delete:async()=>ctx.deleted.push(data.PIPE_NO)}));
  const table={getSelectedRows:()=>components,getRows:()=>components};
  Object.assign(ctx,{selectedLPETable:table,selectedBlastAppTable:table,selectedThickTable:table,getThickTable:dataRows,
    SHIFT_DATE:'14-OCT-2026',selectedShift:{value:'A'},rmBatchId:null,
    handleClearAll:()=>{ctx.showSaveMsgSuccess=false;ctx.saveMsg='';},handleClearMain:()=>{ctx.showSaveMsgSuccess=false;ctx.saveMsg='';},
  });
  vm.createContext(ctx);return {ctx,source};
}
async function flush() {for(let i=0;i<20;i++) await Promise.resolve();}
(async()=>{
  // Actual backend save flow: all success, each failure path, empty request and cleanup failure.
  for(const num of [14,15,16]){
    const name=`LD${num}S001`;
    const scenarios=['all','procedure','zero-insert','exception',...(num===16?['scrap','lab','field']:['cleanup'])];
    for(const scenario of scenarios){
      const proc=[],writes=[];
      const proto={
        deleteTempData:async d=>{writes.push(d.BATCH_NO);if(scenario==='cleanup'&&proc.includes(d.BATCH_NO))throw Error('cleanup');},
        insertTempData:async d=>{if(scenario==='exception'&&d.BATCH_NO==='P2')throw Error('DB');return {rowsAffected:scenario==='zero-insert'&&d.BATCH_NO==='P2'?0:1};},
        insertScrapTempData:async d=>({rowsAffected:scenario==='scrap'&&d.BATCH_NO==='P2'?0:1}),
        insertLAB:async batch=>({rowsAffected:scenario==='lab'&&batch==='P2'?0:1}),
        insertField:async batch=>({rowsAffected:scenario==='field'&&batch==='P2'?0:1}),
        [num===16?'callproc120':`callproc${num*10}`]:async d=>{proc.push(d.BATCH_NO);return [scenario==='procedure'&&d.BATCH_NO==='P2'?'N-Rejected':'Y-Saved'];},
      };
      const ctx=ts(`LDPIS-Backend/src/controllers/${name}Controller.ts`,{console:quiet,[name]:{prototype:proto}});
      const selectedRowsData=['P1','P2','P3'].map(BATCH_NO=>({BATCH_NO,TBP_FIELDNO_INT_160:' INT-'+BATCH_NO+' ',BATCH_SCRAP_WEIGHT:1,LAB_TST:'L1',FLD_TEST:'F1'}));
      const res=response();await ctx.insertTempData({body:{selectedRowsData}},res);
      const all=['all','cleanup'].includes(scenario);
      assert.equal(res.body.successCount,all?3:1,`${name}/${scenario}`);
      assert.equal(res.body.failedCount,all?0:1);assert.equal(res.body.pendingCount,all?0:1);
      assert.deepEqual(Array.from(res.body.successfulPipes),all?['P1','P2','P3']:['P1']);
      if(!all)assert.ok(!writes.includes('P3'));
      if(['zero-insert','scrap','lab','field'].includes(scenario))assert.deepEqual(proc,['P1']);
      if(num===16)assert.equal(selectedRowsData[0].TBP_FIELDNO_INT_160,'INT-P1');
      const empty=response();await ctx.insertTempData({body:{selectedRowsData:[]}},empty);assert.equal(empty.code,400);
    }
  }
  for(const missing of ['',null,undefined,'   ']){
    let writes=0;const ctx=ts('LDPIS-Backend/src/controllers/LD16S001Controller.ts',{console:quiet,LD16S001:{prototype:{deleteTempData:async()=>writes++}}});
    const res=response();await ctx.insertTempData({body:{selectedRowsData:[{BATCH_NO:'P1',TBP_FIELDNO_INT_160:'A'},{BATCH_NO:'P2',TBP_FIELDNO_INT_160:missing}]}},res);
    assert.equal(res.code,400);assert.equal(writes,0);assert.match(res.body.message,/P2/);
  }
  // Save UI: retain failed/pending rows, remove ONLY confirmed successes; display server counts.
  for(const num of [14,15,16]){
    const rows=['P1','P2','P3'].map(PIPE_NO=>({PIPE_NO,RESULT:'OK',PARENT_BATCH:'RM',INT_FIELD_NO:' F-'+PIPE_NO+' ',COAT_WT:0,TBP_WEIGHT:0,PIPE_WEIGHT:0,LOM_MS_PIECE_ACTL:0}));
    for(const partial of [false,true]){
      const outcome=partial?{successCount:1,failedCount:1,pendingCount:1,successfulPipes:['P1'],message:'Successfully saved 1 pipe(s). Failed: 1. Not processed: 1.'}:{successCount:3,failedCount:0,successfulPipes:['P1','P2','P3'],message:'Successfully saved 3 pipe(s).'};
      const {ctx,source}=ui(`Mill/LD${num}S001.jsx`,outcome,rows);
      handler(source,'updateData',ctx);await ctx.updateData();await flush();
      assert.equal(ctx.calls.length,1);
      if(partial){assert.deepEqual(ctx.deleted,['P1']);assert.match(ctx.errors[0],/saved 1/);assert.equal(ctx.successes.length,0);}
      else{assert.match(ctx.successes[0],/saved 3/);if(num!==14){assert.equal(ctx.showSaveMsgSuccess,true);assert.match(ctx.saveMsg,/saved 3/);}}
      if(num===16)assert.equal(ctx.calls[0].data.selectedRowsData[0].TBP_FIELDNO_INT_160,'F-P1');
    }
  }
  // UI validates all selected rows before posting and doesn't substitute Field No on Save.
  for(const blank of ['',null,undefined,'   ']){
    const {ctx,source}=ui('Mill/LD16S001.jsx',{},[{PIPE_NO:'P1',RESULT:'OK',PARENT_BATCH:'RM',INT_FIELD_NO:'I1'},{PIPE_NO:'P2',FIELD_NO:'F2',INT_FIELD_NO:blank}]);
    handler(source,'updateData',ctx);await ctx.updateData();assert.equal(ctx.calls.length,0);assert.match(ctx.errors[0],/P2/);
  }
  // Fill Data assigns a different default for every pipe, including empty and zero-valued fields.
  {
    const input=[{TBP_BATCH_NO:'P1',TBP_FLD_NO_130:'EXT1'},{TBP_BATCH_NO:'P2',TBP_FLD_NO_130:'EXT2'},{TBP_BATCH_NO:'P3',TBP_FLD_NO_130:null},{TBP_BATCH_NO:'P4',TBP_FLD_NO_130:0}];
    const {ctx,source}=ui('Mill/LD16S001.jsx',input);
    Object.assign(ctx,{nxtproc2:'H',pipeno:null,ordNo:'O1',ordItem:'10',selectedResult:{value:'OK'},remarks:'ok',inspectorname:'Inspector'});
    ctx.document.getElementById=id=>({value:new Date(Date.now()-(id==='prodStartDate'?3600000:60000)).toISOString()});
    handler(source,'bindThickData',ctx);await ctx.bindThickData();assert.equal(ctx.errors.length,0);
    assert.deepEqual(Array.from(ctx.getThickTable,r=>r.INT_FIELD_NO),['EXT1','EXT2','',0]);
  }
  for(const [name,status] of [['LDLTS006','EQ'],['LDLTS010','HQ']]){
    const ctx=ts(`LDPIS-Backend/src/repository/${name}Query.ts`,{console:quiet,query:{executeQuery:async(sql,binds)=>({sql,binds})},Error:{InternalServerErrorMsg:Error}});
    for(const filters of [{},{ordNo:' O1 '},{ordItem:' 10 '},{ordNo:"O'1",ordItem:'10'},{batchId:'P1',mBatch:'M1',ordNo:'O1',ordItem:'10'}]){
      const {sql,binds}=await ctx.getCoils({plant:'0780',...filters});assert.equal(binds.status,status);assert.equal(binds.plant,'0780');
      for(const [key,value]of Object.entries(filters))assert.equal(binds[key],value.trim());
      assert.ok(!sql.includes("O'1"));assert.match(sql,/AS ASL_NO/);assert.match(sql,/AS FIELD_NO/);assert.match(sql,/TBP_CD_PROC = 'E'/);
      assert.match(sql,/f.TBP_PLANT_CD = LOM_CD_EPA/);
    }
    const {ctx:front,source}=ui(`Quality/${name}.jsx`,[]);front.selectedPlant={value:'0780'};front.ordNo=' O1 ';front.ordItem=' 10 ';
    handler(source,'getCoilData',front);await front.getCoilData('token');assert.equal(front.calls[0].data.ordNo,'O1');assert.equal(front.calls[0].data.ordItem,'10');
    handler(source,'handleClearAll',front);front.handleClearAll();assert.equal(front.ordNo,'');assert.equal(front.ordItem,'');
    const cols=source.slice(source.indexOf('const tableCol ='),source.indexOf('const downloadTableData'));
    assert.ok(cols.indexOf('field: "ASL_NO"')<cols.indexOf('field: "FIELD_NO"'));
  }
  console.log('PASS: LD14-16 counts/failures/retries, LD16 fill defaults and UI/server validation, decision filters and bound queries.');
})().catch(error=>{console.error(error);process.exitCode=1;});
