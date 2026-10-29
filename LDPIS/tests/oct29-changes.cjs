// Run with Node 22.6+: node LDPIS/tests/oct29-changes.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { stripTypeScriptTypes } = require("node:module");
const root = path.resolve(__dirname, "..");
const read = p => fs.readFileSync(path.join(root, p), "utf8");
const context = vm.createContext({});
vm.runInContext(read("LDPIS-Frontend/src/views/Reports/inventoryCategories.js").replace(/export const /g, "const ") +
  "\nthis.band = getBatchAgeBand; this.category = getFreeStockCategory;", context);
for (const [value, expected] of [[0,"0-30 days"],[30,"0-30 days"],[31,"30-60 days"],[60,"30-60 days"],[61,"60-90 days"],[90,"60-90 days"],[91,"Above 90 days"],["45","30-60 days"],[null,""],["",""],[-1,""],["invalid",""]]) {
  assert.equal(context.band(value), expected);
}
for (const [grade, desc, expected] of [
  ["NON ISI", "DWG tube", "Non IS"], ["non-isi", "", "Non IS"],
  ["NON_ISI", "RGD", "Non IS"], ["IS123", "tube dwg", "Downgrade"],
  ["IS123", "RGD pipe", "Downgrade"], [null, null, "ETO/Free Stock"],
  ["IS123", "normal", "ETO/Free Stock"],
]) assert.equal(context.category(grade, desc), expected);

function loadFunction(screen, name, query) {
  const source = read("LDPIS-Backend/src/repository/" + screen + "Query.ts");
  const start = source.indexOf("export const " + name + " =");
  const end = source.indexOf("export const ", start + 1);
  const code = source.slice(start, end < 0 ? undefined : end).replace("export const", "const");
  const ctx = vm.createContext({ query, console: {log(){}}, Error: {InternalServerErrorMsg: Error},
    oracledb: {STRING: 1, BIND_OUT: 2} });
  vm.runInContext(stripTypeScriptTypes(code) + "\nthis.run = " + name + ";", ctx);
  return ctx.run;
}
(async () => {
  for (const screen of ["LDLTS006", "LDLTS010"]) {
    let sql;
    await loadFunction(screen, "getCoils", {executeQuery: async s => {sql=s;return {};}})({plant:"0780",batchId:"B1"});
    assert(sql.includes("AS FIELD_NO"));
    assert(sql.includes("ORDER BY FIELD_NO ASC NULLS LAST, LOM_ID_BATCH ASC"));
  }
  let sql;
  await loadFunction("LD14S001", "getFillData", {executeQuery:async s=>{sql=s;return {};}})({PIPE_NO:"B1",STATUS:"FC"});
  assert(sql.includes("AS TBP_FLD_NO_130"));
  assert(sql.includes("f130.TBP_CD_PROC = 'E'"));
  assert(sql.includes("f130.TBP_PLANT_CD = LOM_CD_EPA"));
  assert(sql.includes("ORDER BY TBP_FLD_NO_130 ASC NULLS LAST, TBP_BATCH_NO ASC"));
  let writes = 0;
  const save = loadFunction("LD16S001", "insertTempData", {executeQuery:async()=>{writes++;return {};}});
  for (const data of [{}, {TBP_DFT_F1_160:" ",TBP_DFT_T1_160:5}, {TBP_DFT_F1_160:5,TBP_DFT_T1_160:null}]) {
    await assert.rejects(() => save(data), /DFT F1 and DFT T1 are required/);
  }
  assert.equal(writes,0);
  await save({TBP_DFT_F1_160:100,TBP_DFT_T1_160:110});
  assert.equal(writes,1);
  console.log("PASS: age boundaries, category priority/case/nulls, field-number queries and sorting, DFT backend rejection before writes");
})().catch(error=>{console.error(error);process.exitCode=1;});
