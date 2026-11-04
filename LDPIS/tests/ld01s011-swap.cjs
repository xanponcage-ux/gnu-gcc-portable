const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const src=fs.readFileSync('LDPIS/LDPIS-Backend/src/repository/LD01S011Query.ts','utf8').replace(/^import .*;$/gm,'').replace(/export async/g,'async');
const rows=['1','2','3','4','5','A','B','C'].map((id,i)=>({BATCH1:id,ORD:i<3?'O'+id:'X',ITEM:'10'}));let calls=[],fail=false,commits=0,rolls=0;
function asResult(records) {return {metaData:Object.keys(records[0]).map(name=>({name})),rows:records.map(Object.values)};}
const conn={execute:async(sql,b)=>sql.startsWith('BEGIN')?(calls.push([b.b,b.o,b.op]),{outBinds:{flag:fail?'N':'Y'}}):asResult(sql.includes('FROM V_END_CUST_ORD_EPA')?[{ORD:'X',ITEM:'10'}]:rows),commit:async()=>commits++,rollback:async()=>rolls++,close:async()=>{}};
const strip=require('node:module').stripTypeScriptTypes;
const helper=fs.readFileSync('LDPIS/LDPIS-Backend/src/infrastructure/database/querys.ts','utf8').split('async function withTransaction')[1].split('export default')[0];
const driver={getPool:()=>({getConnection:async()=>conn})};
const withTransaction=vm.runInNewContext(strip('async function withTransaction'+helper)+';withTransaction',{oracledb:driver,getValue:()=>''});
const api=vm.runInNewContext(strip(src)+';({batches:getBatches,order:getOrder,swap})',{query:{executeQuery:conn.execute,withTransaction},oracledb:driver});
const fn=(action,body)=>api[action](body);
(async()=>{assert.deepEqual(Array.from(await fn("batches",{ids:["1","missing","3"]}), r=>r.BATCH1),["1","3"]);assert.equal((await fn("batches",{ids:["missing"]})).length,0);let body={ids:['1','2','3','4','5'],order:'X',item:'10'};let p=await fn('order',body);assert.equal(p.skipped,2);body.snapshot=p.snapshot;await fn('swap',body);assert.equal(commits,1);assert.equal(calls.length,12);assert.deepEqual(calls.slice(0,4),[['1','O1','DELINK'],['1','X','LINK'],['A','X','DELINK'],['A','O1','LINK']]);fail=true;await assert.rejects(fn('swap',body));assert.equal(rolls,1);await assert.rejects(fn('swap',{...body,snapshot:'old'}));await assert.rejects(fn('order',{...body,ids:['1']}));console.log('PASS overlap, sequence, counts, stale preview, rollback');})()
