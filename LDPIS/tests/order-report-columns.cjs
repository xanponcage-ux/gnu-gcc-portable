// Run with Node 22.6+: node LDPIS/tests/order-report-columns.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
const root = path.resolve(__dirname, '..');
const mapping = [["Order Qty.(Sales Unit)","ENC_SALES_QTY"],["Sales Unit","ENC_SALES_QTY_UOM"],["Incot","ENC_INCOT"],["Sold Cust. City","ENC_SOLD_CUST_CITY"],["Ship Cust. City","ENC_SHIP_CUST_CITY"],["Ship Cust. Name","ENC_SHIP_CUST_NAME"],["Division","ENC_DIVISION"],["Sales Org.","ENC_SAL_ORG"],["Ref. Standard","ENC_REF_STANDARD"],["Ship To Party","ENC_CD_SHIP_TO_PRTY"],["Po No.","ENC_PO_NO"],["Freight Indicator","ENC_FRT_IND"],["Delivery Date","ENC_DT_DELV"],["Billing Block","ENC_BILING_BLOCK"],["Delivery Block","ENC_DELV_BLOCK"]];
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
// Parse only the outer SELECT list; nested scalar queries must not create columns.
function projection(sql) {
  sql = sql.replace(/--[^\n]*/g, '');
  let depth = 0, quote = false, start = sql.search(/select\b/i) + 6;
  const columns = [];
  for (let i = start; i < sql.length; i++) {
    const ch = sql[i];
    if (ch === "'") { if (quote && sql[i+1] === "'") { i++; continue; } quote = !quote; }
    if (quote) continue;
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (!depth && ch === ',') { columns.push(sql.slice(start,i).trim()); start=i+1; }
    if (!depth && /^from\b/i.test(sql.slice(i))) { columns.push(sql.slice(start,i).trim()); break; }
  }
  return columns.map(expr => ({expr, alias: expr.match(/([a-z0-9_]+)\s*$/i)[1].toUpperCase()}));
}
(async () => {
  for (const [screen, functions] of [['LDSM007',['GetOrderDT','GetOrderDT_Tubes']],['LDSM020',['getTubePlanData']]]) {
    const source = read('LDPIS-Backend/src/repository/'+screen+'Query.ts');
    const ui = read('LDPIS-Frontend/src/views/Reports/'+screen+'.jsx').replace(/\/\/[^\n]*/g,'');
    for (const name of functions) {
      const start=source.indexOf('export const '+name+' =');
      const next=source.indexOf('export const ',start+1);
      const code=source.slice(start,next<0?undefined:next).replace('export const','const');
      let captured;
      const ctx=vm.createContext({query:{executeQuery:async(sql,binds)=>{captured={sql,binds};return {};}},console:{log(){}},Error});
      vm.runInContext(stripTypeScriptTypes(code)+'\nthis.run = '+name+';',ctx);
      const args=Array(screen==='LDSM007'?(name==='GetOrderDT'?15:18):10).fill('');
      args[screen==='LDSM007'?10:0]='0780';
      await ctx.run(...args);
      const cols=projection(captured.sql);
      assert.equal(new Set(cols.map(c=>c.alias)).size,cols.length,'duplicate SQL output name');
      for (const [title, dbField] of mapping) {
        const alias=screen==='LDSM007'?({ENC_SALES_QTY:'SALES_QTY',ENC_SALES_QTY_UOM:'SALES_QTY_UOM',ENC_CD_SHIP_TO_PRTY:'SHIPTOPARTYID',ENC_DT_DELV:'DELIVERYDATE'}[dbField]||dbField):dbField;
        const col=cols.find(c=>c.alias===alias);
        assert(col,screen+' missing SQL '+alias);
        assert(new RegExp('\\b'+dbField+'\\b','i').test(col.expr),title+' wrong source');
        const matches=[...ui.matchAll(/title:\s*"([^"]+)",\s*field:\s*"([^"]+)"/g)].filter(m=>m[1]===title);
        assert.equal(matches.length,1,screen+' duplicate/missing '+title);
        assert.equal(matches[0][2],alias);
      }
      const delivery=cols.find(c=>c.alias===(screen==='LDSM007'?'DELIVERYDATE':'ENC_DT_DELV'));
      assert(/TO_CHAR\(enc_dt_delv, 'DD-MON-YYYY'\)/i.test(delivery.expr));
      assert.equal(captured.binds[screen==='LDSM007'?'Plant':'plant'],'0780');
      console.log('PASS '+screen+' '+name+': all 15 mappings, unique output/grid columns, delivery date and plant bind');
    }
  }
})().catch(e=>{console.error(e);process.exitCode=1;});

