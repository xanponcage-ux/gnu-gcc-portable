// Run with Node 22.6+: node LDPIS/tests/fg-material-upload.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const helper = read('LDPIS-Frontend/src/views/Mill/fgMaterialUpload.js').replace('export function', 'function');
const ctx = vm.createContext({});
vm.runInContext(helper + '\nthis.parse = parseFgMaterialRows;', ctx);
const header = ['Batch', 'Final Material Number'];
const mat = '000000000123456789';
assert.equal(ctx.parse([header, [' A1 ', mat]])[0].matnr, mat);
assert.equal(ctx.parse([header, ['A1', mat], ['A1', mat], ['', '']]).length, 1);
assert.equal(ctx.parse([['Batch_Id', 'Material No'], ['A1', mat]])[0].batchId, 'A1');
for (const rows of [[], [header], [header, ['', mat]], [header, ['A1', '123']],
  [header, ['A1', 123456789012345678]], [header, [123, mat]],
  [header, ['A1', mat], ['A1', '000000000987654321']]]) assert.throws(() => ctx.parse(rows));

(async () => {
  const source = read('LDPIS-Backend/src/repository/LD0RS002Query.ts');
  const fn = source.slice(source.indexOf('export const getMatTabData'), source.indexOf('export const validateData')).replace('export const', 'const');
  const queries = [];
  const db = vm.createContext({ query: { executeQuery: async (sql, binds) => { queries.push({sql,binds}); return {}; } }, console,
    Error: { InternalServerErrorMsg: Error } });
  vm.runInContext(stripTypeScriptTypes(fn) + '\nthis.run = getMatTabData;', db);
  await db.run({batchId: "B'1"});
  assert.equal(queries[0].binds.batchId, "B'1");
  assert(!queries[0].sql.includes("B'1"));
  assert(queries[0].sql.includes('LOM_ID_BATCH = :batchId'));
  assert(queries[0].sql.includes("lom_cd_status in ('WF' )"));
  assert(queries[0].sql.includes("LOM_SE_UPD_FL = 'Y'"));
  await db.run({}); assert(!queries[1].sql.includes(':batchId'));

  const ui = read('LDPIS-Frontend/src/views/Mill/LD0RS002.jsx');
  const start = ui.indexOf('  const handleMaterialUpload =');
  const end = ui.indexOf('\n  const tableCol =', start);
  let data, message, busy;
  let failValidation = false;
  const calls = [];
  const upload = vm.createContext({
    parseFgMaterialRows: ctx.parse, materialLoadId: {current: 0}, materialFileRef: {current: {value: 'file'}},
    setMaterialUploadBusy: v => busy = v, setMaterialUploadMessage: v => message = v,
    setTableData: v => data = v, alertify: {success() {}, error() {}},
    XLSX: {read: () => ({SheetNames:['Sheet1'], Sheets: {Sheet1:{}}}), utils: {
      sheet_to_json: () => [header, ['A1',mat], ['MISSING',mat]],
    }},
    GetAuthorization: async () => ({accessToken:'test'}),
    axiosAPI: {post: async (url, body) => {
      calls.push({url,body});
      if (url.endsWith('getMatTabData')) return {data: body.batchId === 'A1' ? [{BATCHID:'A1',THK:3,LENGTH:10,SUR_FIN:'S'}] : []};
      if (failValidation) throw new Error('Validation unavailable');
      return {data:[{RESULT:'NN-Comment needed'}]};
    }},
  });
  vm.runInContext(ui.slice(start,end) + '\nthis.run = handleMaterialUpload;', upload);
  await upload.run({target:{files:[{arrayBuffer:async()=>new ArrayBuffer(0)}]}});
  assert.equal(data.length,1); assert.equal(data[0].MAT_NO,mat); assert.equal(data[0].THK,3);
  assert.equal(data[0].VALIDATE,'NN-Comment needed'); assert(message.includes('MISSING')); assert.equal(busy,false);
  assert(!calls.some(c => c.url.endsWith('/saveData')));
  failValidation = true;
  await upload.run({target:{files:[{arrayBuffer:async()=>new ArrayBuffer(0)}]}});
  assert.equal(data.length,0); assert(message.includes('Validation unavailable')); assert.equal(busy,false);
  console.log('PASS: Excel headers/text/precision/duplicates; eligible bound lookup; per-batch validation and merge; skipped batches; failure clears rows; no automatic save');
})().catch(error => { console.error(error); process.exitCode = 1; });
