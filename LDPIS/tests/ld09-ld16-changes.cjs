// Node 24+: node LDPIS/tests/ld09-ld16-changes.cjs
// Tests the actual handlers with database calls mocked; does not execute Oracle.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { stripTypeScriptTypes } = require('node:module');
const base = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(base, p), 'utf8');
const quiet = { log() {}, error() {} };
function loadTS(file, context) {
  vm.createContext(context);
  vm.runInContext(stripTypeScriptTypes(read(file).replace(/^import .*;\n/gm, '').replace(/export const /g, 'var ')), context);
  return context;
}
function response() { return { statusCode: 0, status(n) { this.statusCode = n; return this; }, json(data) { this.body = data; return this; } }; }
(async () => {
  for (const n of [9, 10, 11]) {
    const model = `LD${String(n).padStart(2, '0')}S001`;
    for (const scenario of ['all', 'mixed', 'zero-insert', 'exception', 'cleanup']) {
      let procCalls = [];
      const proto = {
        deleteTempData: async d => { if (scenario === 'cleanup' && procCalls.includes(d.BATCH_NO)) throw Error('cleanup'); },
        insertTempData: async d => {
          if (scenario === 'exception' && d.BATCH_NO === 'P2') throw Error('database');
          return { rowsAffected: scenario === 'zero-insert' && d.BATCH_NO === 'P2' ? 0 : 1 };
        },
        [`callproc${n * 10}`]: async d => { procCalls.push(d.BATCH_NO); return [scenario === 'mixed' && d.BATCH_NO === 'P2' ? 'N-Rejected' : 'Y-Saved']; },
      };
      const ctx = loadTS(`LDPIS-Backend/src/controllers/${model}Controller.ts`, { console: quiet, [model]: { prototype: proto } });
      const res = response();
      await ctx.insertTempData({ body: { selectedRowsData: ['P1','P2','P3'].map(BATCH_NO => ({ BATCH_NO })) } }, res);
      assert.equal(res.body.successCount, ['all','cleanup'].includes(scenario) ? 3 : 1, `${model} ${scenario}`);
      assert.equal(res.body.failedCount, ['all','cleanup'].includes(scenario) ? 0 : 1);
      assert.match(res.body.message, /Successfully saved \d pipe\(s\)/);
      if (scenario === 'zero-insert') assert.deepEqual(procCalls, ['P1']);
      const empty = response(); await ctx.insertTempData({body:{selectedRowsData:[]}}, empty); assert.equal(empty.statusCode,400);
    }
  }
  let writes = 0;
  const c130 = loadTS('LDPIS-Backend/src/controllers/LD13S001Controller.ts', {console:quiet,LD13S001:{prototype:{deleteTempData:async()=>{writes++;}}}});
  const invalid = response();
  await c130.insertTempData({body:{selectedRowsData:[{BATCH_NO:'P1',FIELD_NO:'F1'},{BATCH_NO:'P2',FIELD_NO:'  '}]}},invalid);
  assert.equal(invalid.statusCode,400); assert.match(invalid.body.message,/P2/); assert.equal(writes,0);
  const receive = loadTS('LDPIS-Backend/src/repository/LD09S002Query.ts',{console:quiet,query:{executeQuery:async(sql,binds)=>({sql,binds})},Error:{InternalServerErrorMsg:Error}});
  for (const input of [{plant:'0780',batchId:"P'1",ordNo:'ignored',ordItem:'10'}, {plant:'0780',ordNo:'O1',ordItem:'10'}, {plant:'0780',ordNo:'O1'}, {plant:'0780'}, {batchId:'P1'}]) {
    const {sql,binds} = await receive.getCoils(input);
    if (input.plant && input.batchId) {assert.equal(binds.pipeNo,"P'1");assert.equal(binds.orderNo,undefined);assert.ok(!sql.includes("P'1"));}
    else if(input.plant && input.ordItem) {assert.equal(binds.orderNo,'O1');assert.equal(binds.orderItem,'10');}
    else assert.ok(sql.includes('AND 1=0'));
    assert.match(sql,/LOM_CD_STATUS = 'KC'/);
  }
  const options=await receive.getPipeNoList('0780');assert.equal(options.binds.plant,'0780');assert.match(options.sql,/LOM_ID_ORDER_CUS/);
  // Exercise actual receive-screen filter handlers and request construction.
  const front=read('LDPIS-Frontend/src/views/Mill/LD09S002.jsx');
  const ui={batchId:'',ordNo:'',ordItem:'',mBatch:'',thick:'',odia:'',selectedPlant:{value:'0780'},calls:[],errors:[],console:quiet,
    setBatchId:v=>ui.batchId=v,setOrdNo:v=>ui.ordNo=v,setOrdItem:v=>ui.ordItem=v,setTableData:()=>{},
    alertify:{error:m=>ui.errors.push(m)},axiosAPI:{post:async(url,data)=>{ui.calls.push(data);return {statusText:'OK',data:[]};}}};
  vm.createContext(ui);
  vm.runInContext(front.slice(front.indexOf('  const handlePipeNoChange'),front.indexOf('  const fetchTableData')).replace(/const (handle\w+) =/g,'var $1 ='),ui);
  vm.runInContext(front.slice(front.indexOf('  const getCoilData'),front.indexOf('  const saveData')).replace('const getCoilData','var getCoilData'),ui);
  ui.handlePipeNoChange({value:'P1',orderNo:'O1',orderItem:10});await ui.getCoilData('token');assert.equal(ui.calls[0].batchId,'P1');assert.equal(ui.calls[0].ordNo,'');
  ui.handleOrderNoChange({target:{value:'O2'}});assert.equal(ui.batchId,'');assert.equal(ui.ordItem,'');await ui.getCoilData('token');assert.equal(ui.calls.length,1);
  ui.handleOrderItemChange({target:{value:'20'}});await ui.getCoilData('token');assert.equal(ui.calls[1].ordNo,'O2');assert.equal(ui.calls[1].ordItem,'20');
  // LD120 preserves earlier successes if a later pipe throws.
  const c120=loadTS('LDPIS-Backend/src/controllers/LD12S001Controller.ts',{console:quiet,LD12S001:{prototype:{
    verifyProdDateRepetition:async d=>{if(d.BATCH_NO==='P2')throw Error('DB failure');return 'NO';},
    deleteTempData:async()=>({}),insertTempData:async()=>({rowsAffected:1}),callproc120:async()=>['Y'],
  }}});
  const r120=response();await c120.insertTempData({body:{selectedRowsData:[{BATCH_NO:'P1'},{BATCH_NO:'P2'}]}},r120);assert.equal(r120.statusCode,400);assert.equal(r120.body.successCount,1);
  for(const n of [14,15,16]){
    const repo=loadTS(`LDPIS-Backend/src/repository/LD${n}S001Query.ts`,{console:quiet,query:{executeQuery:async(sql,binds)=>({sql,binds})},Error:{InternalServerErrorMsg:Error}});
    const {sql}=await repo.getFillData({PIPE_NO:'P1',STATUS:'FC'});assert.match(sql,/f.TBP_CD_PROC = 'E'/);assert.match(sql,/f.TBP_PLANT_CD = (LOM_CD_EPA|b.TBP_PLANT_CD)/);
  }
  console.log('PASS: per-pipe save counts, partial failures, zero inserts, exceptions, cleanup, LD130 prevalidation, receive filter switching/binds, LD120 exception counts, downstream Field No SQL.');
})().catch(e=>{console.error(e);process.exitCode=1;});
