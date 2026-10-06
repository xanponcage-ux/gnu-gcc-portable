// Run with Node 24+: node LDPIS/tests/ld150-rework.cjs
// Exercises actual screen handlers with mocked UI/API dependencies; Oracle is not executed.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { stripTypeScriptTypes } = require('node:module');
const front = fs.readFileSync(path.join(__dirname, '../LDPIS-Frontend/src/views/Mill/LD15S001.jsx'), 'utf8');
const back = fs.readFileSync(path.join(__dirname, '../LDPIS-Backend/src/repository/LD15S001Query.ts'), 'utf8');
const noop = () => {};
const backend = vm.createContext({console:{log:noop}, query:{executeQuery:async(sql,binds)=>({sql,binds})}, oracledb:{}, Error:{InternalServerErrorMsg:Error}});
vm.runInContext(stripTypeScriptTypes(back.replace(/^import .*;\n/gm, '').replace(/export const /g, 'var ')), backend);
function ui(overrides = {}, rows = []) {
  const ctx = {console:{log:noop,error:noop}, Date, errors:[], rows:[], calls:[],
    alertify:{error:m=>ctx.errors.push(m),success:noop},
    document:{getElementById:id=>({value:ctx.dates[id] || ''})}, dates:{},
    GetAuthorization:async()=>({accessToken:'test'}),
    axiosAPI:{post:async(url,data)=>{ctx.calls.push({url,data}); return {status:200,statusText:'OK',data:url.includes('getFillData')?rows:{}};}},
    handleClearAll:noop,handleClearMain:noop,fetchDetails:noop,showErrorAlert:noop,
    formatDateToDDMMYYYY:()=>'',nxtproc2:'G',selectedResult:{value:'OK'},
  };
  for (const m of front.matchAll(/const\s*\[\s*(\w+)\s*,\s*(\w+)\s*\]\s*=/g)) {
    ctx[m[1]] = '';ctx[m[2]]=noop;
  }
  Object.assign(ctx,{nxtproc2:'G',selectedResult:{value:'OK'},setBlastAppTable:r=>{ctx.rows=r;},...overrides});
  vm.createContext(ctx);
  vm.runInContext(front.slice(front.indexOf('  const bindBlastAppData ='), front.indexOf('const updateData =')).replace('const bindBlastAppData','var bindBlastAppData'),ctx);
  const saveStart=front.indexOf('const updateData =');
  const saveEnd=front.indexOf('const showErrorAlert',saveStart);
  vm.runInContext(front.slice(saveStart,saveEnd).replace('const updateData','var updateData'),ctx);
  const colStart=front.indexOf('  const isRowEditable =');
  const colEnd=front.indexOf('\n  ];',front.indexOf('  const BlastAppColumns ='))+6;
  vm.runInContext(front.slice(colStart,colEnd).replace('const BlastAppColumns','var BlastAppColumns'),ctx);
  return ctx;
}
(async()=>{
  const previous={NO_OF_REC:1,TBP_BATCH_NO:'P1',LOM_ID_PAR_COIL_NO:'RM1',TBP_PROD_DATE:'05-OCT-2026',TBP_SHIFT_DN:'A',TBP_INSP_NAME:'Old inspector',TBP_REMARK:'Old remarks',TBP_WFT_F1_150:0,TBP_WFT_F4_150:14,TBP_WFT_T4_150:24,TBP_DEW_TEMP_100:0,TBP_RMUSE1_150:'Old material',TBP_SAMPLE_10:'YES',TBP_SAMPL_TAG:'sample',ORDER_NO:'O1',ITEM:'10'};
  const existing=ui({pipeno:{value:'P1',NO_OF_REC:1},tbpWftF1150:999,tbpWftF4150:999,tbpBaseManufacturer:'New material'},[previous]);
  await existing.bindBlastAppData();
  assert.deepEqual(existing.errors,[]);
  assert.equal(existing.rows.length,1);
  const row=existing.rows[0];
  assert.equal(row.TBP_WFT_F1_150,0);assert.equal(row.TBP_WFT_F4_150,14);assert.equal(row.TBP_WFT_T4_150,24);
  assert.equal(row.TBP_RMUSE1_150,'Old material');assert.equal(row.INSPECT_NAME,'Old inspector');assert.equal(row.HOLD_REASON,'Old remarks');
  assert.equal(row.RESULT,'OK');assert.equal(row.DATE,'05-OCT-2026');
  for(const col of existing.BlastAppColumns.filter(c=>c.editor)) {
    const editable=typeof col.editable==='function'?col.editable({getRow:()=>({getData:()=>row})}):col.editable;
    assert.equal(Boolean(editable),col.field==='RESULT',col.field);
  }
  row.RESULT='HOLD';
  assert.equal(existing.BlastAppColumns.find(c=>c.field==='HOLD_REASON').editable({getRow:()=>({getData:()=>row})}),true);
  existing.selectedBlastAppTable={getSelectedRows:()=>[{_row:{data:row}}]};
  await existing.updateData();
  const saved=existing.calls.find(c=>c.url.includes('insertTempData')).data.selectedRowsData[0];
  assert.equal(saved.PROD_DATE,'05-OCT-2026');assert.equal(saved.TBP_SAMPL_TAG,'sample');
  assert.match(saved.START_DT,/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);assert.equal(saved.START_DT,saved.END_DT);
  const inserted=await backend.insertTempData(saved);
  assert.equal(inserted.binds.TBP_WFT_F1_150,0);assert.equal(inserted.binds.TBP_DEW_TMP_100,0);
  assert.equal(inserted.binds.TBP_WFT_F4_150,14);assert.equal(inserted.binds.TBP_WFT_T4_150,24);
  assert.equal(inserted.binds.TBP_INSP_NAME,'Old inspector');
  for(const override of [{pipeno:{value:'P1',NO_OF_REC:0}}, {pipeno:null,ordNo:'O1',ordItem:'10'}]){
    const ctx=ui(override,[previous]);await ctx.bindBlastAppData();assert.equal(ctx.calls.length,0);assert.ok(ctx.errors.length);
  }
  const noDecision=ui({pipeno:{value:'P1',NO_OF_REC:1},selectedResult:null},[previous]);await noDecision.bindBlastAppData();assert.equal(noDecision.calls.length,0);
  const stale=ui({pipeno:{value:'P1',NO_OF_REC:1}},[{...previous,NO_OF_REC:0}]);await stale.bindBlastAppData();assert.equal(stale.rows.length,0);assert.match(stale.errors[0],/status has changed/);
  const normalFields={pipeno:{value:'P2',NO_OF_REC:0},SHIFT_DATE:'06-OCT-2026',selectedShift:{value:'B'},tbpVisualInsp80:'New inspector',inspectorRemarks:'New remarks'};
  for(const end of ['F','T'])for(let i=1;i<=4;i++)normalFields[`tbpWft${end}${i}150`]=100+i;
  const normal=ui(normalFields,[{...previous,NO_OF_REC:0}]);
  normal.dates={prodStartDate:new Date(Date.now()-3600000).toISOString(),prodEndDate:new Date(Date.now()-60000).toISOString()};
  await normal.bindBlastAppData();assert.deepEqual(normal.errors,[]);assert.equal(normal.rows[0].TBP_WFT_F4_150,104);assert.equal(normal.rows[0].DATE,'06-OCT-2026');
  const mixed=ui({...normalFields,pipeno:null,ordNo:'O1',ordItem:'10'},[previous,{...previous,NO_OF_REC:0}]);mixed.dates=normal.dates;
  await mixed.bindBlastAppData();assert.deepEqual(mixed.errors,[]);assert.equal(mixed.rows[0].TBP_WFT_F4_150,14);assert.equal(mixed.rows[1].TBP_WFT_F4_150,104);
  for(const params of [{PIPE_NO:"P'1"},{RM_BATCH:'RM1'},{ORDNO:'O1',ORDITEM:'10'},{}]){
    const {sql,binds}=await backend.getFillData({...params,STATUS:'GC'});
    assert.ok(sql.includes("d150.TBP_CD_PROC = 'G'"));assert.ok(sql.includes("NVL(t.TBP_RBT_10, 'N') = 'Y'"));
    assert.ok(!sql.includes("P'1"));
    const placeholders=[...new Set([...sql.matchAll(/(?<!\w):([a-zA-Z]\w*)/g)].map(m=>m[1]))].filter(x=>x!=='MI');
    assert.deepEqual(placeholders.sort(),Object.keys(binds).sort());
    if(!Object.keys(params).length)assert.ok(sql.includes('AND 1=0'));
  }
  const pipes=await backend.getPipeNoList('RM1','GC');assert.equal(pipes.binds.rmBatch,'RM1');assert.ok(pipes.sql.includes('AS NO_OF_REC'));
  console.log('PASS: existing/new/mixed/stale Fill Data, mandatory inputs, row editing, restored Save payload and zero binds, SQL filter binds.');
})().catch(e=>{console.error(e);process.exitCode=1;});
