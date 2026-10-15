// Run with Node 22.6+: node LDPIS/tests/ldlts011.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
const root = path.resolve(__dirname, '..');
function load(file, globals, names) {
  const source = fs.readFileSync(path.join(root, file), 'utf8').replace(/^import .*;\r?$/gm, '').replace(/export const /g, 'const ');
  const ctx = vm.createContext({ console, ...globals });
  vm.runInContext(stripTypeScriptTypes(source) + '\nthis.api = {' + names.join(',') + '};', ctx);
  return ctx.api;
}
(async () => {
  const calls = [];
  const repository = load('LDPIS-Backend/src/repository/LDLTS011Query.ts', {
    query: { executeQuery: async (sql, binds) => { calls.push({sql, binds}); return {rowsAffected: 1}; } }, Error,
  }, ['getCoils', 'saveData']);
  await repository.getCoils({plant: '9999', batchId: "A'B", mBatch: 'MB', ordNo: 'IGNORED'});
  let q = calls.pop();
  assert.equal(q.binds.plant, '0780');
  assert.equal(q.binds.batchId, "A'B");
  assert(!q.sql.includes("A'B"));
  assert(q.sql.includes("LOM_CD_STATUS IN ('2F', '8F')"));
  assert(!q.sql.includes(':ordNo'));
  await repository.saveData({batchId: 'B1'});
  q = calls.pop();
  assert.equal(q.binds.TBP_BATCH_NO, 'B1');
  for (const condition of ["LOM_CD_STATUS    = 'RC'", 'LOM_REC_UPD_USR  = USER', "LOM_CD_EPA = '0780'", "LOM_CD_STATUS IN ('2F', '8F')", 'F_GET_NEXTPROC', "LOM_PASSED_PROC || SUBSTR(LOM_CD_STATUS,1,1)"]) assert(q.sql.includes(condition));
  const saved = [];
  const controller = load('LDPIS-Backend/src/controllers/LDLTS011Controller.ts', {
    LDLTS011: { prototype: { saveData: async ({batchId}) => { saved.push(batchId); if (batchId === 'ERROR') throw new Error('simulated'); return {rowsAffected: batchId === 'STALE' ? 0 : 1}; } } },
    console: { error() {} },
  }, ['saveData']);
  const res = { status(n) { this.code = n; return this; }, json(body) { this.body = body; return this; } };
  for (const selectedData of [null, [], [{}], [{batchId: ' '}], [{batchId: 123}]]) {
    await controller.saveData({body: {selectedData}}, res); assert.equal(res.code,400);
  }
  assert.equal(saved.length,0);
  await controller.saveData({body: {selectedData: [{batchId:'B1'}, {batchId:' B1 '}, {batchId:'B2'}]}},res);
  assert(res.body.startsWith('Y-')); assert(res.body.includes('2/2')); assert.deepEqual(saved,['B1','B2']);
  await controller.saveData({body: {selectedData: [{batchId:'B3'}, {batchId:'STALE'}, {batchId:'ERROR'}]}},res);
  assert(res.body.startsWith('N-')); assert(res.body.includes('1/3')); assert(res.body.includes('Saved: B3')); assert(res.body.includes('STALE')); assert(res.body.includes('ERROR'));
  const ui = fs.readFileSync(path.join(root,'LDPIS-Frontend/src/views/Quality/LDLTS011.jsx'),'utf8');
  assert(ui.includes('pageName = "LDLTS011"')); assert(ui.includes('api/LDLTS011/saveData'));
  assert(!ui.includes('LDLTB005')); assert(!ui.includes('Please select Decision'));
  assert(ui.includes('{/* Order and Item filters are not needed.'));
  for (const [file,text] of [['LDPIS-Backend/src/app.ts','this.app.use("/api/LDLTS011/", LDLTS011Route)'],['LDPIS-Frontend/src/routes.js','component: <LDLTS011 />']]) assert(fs.readFileSync(path.join(root,file),'utf8').includes(text));
  console.log('PASS: fixed plant/status, bound filters and update, invalid/duplicate selections, stale rows, partial failures, screen registration');
})().catch(error => { console.error(error); process.exitCode=1; });
