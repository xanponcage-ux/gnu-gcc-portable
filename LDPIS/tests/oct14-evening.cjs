// Run: node LDPIS/tests/oct14-evening.cjs (Node 22.6+).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
const root = path.resolve(__dirname, '..');
const frontend = fs.readFileSync(path.join(root, 'LDPIS-Frontend/src/views/Mill/LD12S001.jsx'), 'utf8');
const helpers = frontend.slice(frontend.indexOf('  const samplingDateKey'), frontend.indexOf('  const isRowEditable'));
const logic = frontend.slice(frontend.indexOf('      const alreadyExists = rowNoOfRec > 0;'), frontend.indexOf('      const actualPipeWeight', frontend.indexOf('      const alreadyExists = rowNoOfRec > 0;')));
const context = vm.createContext({ isRowEditable: cell => Number(cell.getRow().getData().NO_OF_REC || 0) === 0 });
vm.runInContext(helpers + '\nthis.dateKey = samplingDateKey; this.editable = isSamplingEditable; this.locked = (row, SHIFT_DATE, rowNoOfRec) => {' + logic + ' return samplingLocked; };', context);
for (const [prod, shift, tag, records, expected] of [
  ['2026-10-14T00:00:00.000Z', '14-OCT-2026', 'YES', 0, true],
  ['2026-10-14', '2026-10-14', 'NO', 0, true],
  ['2026-10-14', '14-OCT-26', 'YES', 0, true],
  ['2026-10-13T23:59:59Z', '14-OCT-2026', 'YES', 0, false],
  ['2026-10-14', '14-OCT-2026', null, 0, false],
  ['2026-10-14', '14-OCT-2026', undefined, 0, false],
  ['2026-10-14', '14-OCT-2026', 'YES', 1, false],
  ['', '', 'YES', 0, false],
]) assert.equal(context.locked({ TBP_PROD_DATE: prod, TBP_SAMPLE_10: tag }, shift, records), expected);
assert.equal(context.locked({ tbp_prod_date: '2026-10-14', TBP_SAMPLE_10: 'YES' }, '14-OCT-2026', 0), true);
const columnsStart = frontend.indexOf('    title: "TAG",');
const columnsEnd = frontend.indexOf('      title: "Coat WT(MTS)",', columnsStart);
const columnsText = '[{' + frontend.slice(columnsStart, columnsEnd).replace(/\{\s*$/, '') + ']';
Object.assign(context, { simpleCheckboxMultiSelectEditor() {}, labTestOptions: [], fieldTestOptions: [], formatMultiSelectLabels: v => v });
const columns = vm.runInContext(columnsText, context);
for (const locked of [true, false]) {
  let edits = 0;
  const cell = { getRow: () => ({ getData: () => ({ NO_OF_REC: 0, SAMPLING_LOCKED: locked, TAG: 'YES' }) }), edit: () => edits++ };
  for (const col of columns) { assert.equal(col.editable(cell), !locked); if (col.cellClick) col.cellClick(null, cell); }
  assert.equal(edits, locked ? 0 : 2);
}
const source = fs.readFileSync(path.join(root, 'LDPIS-Backend/src/repository/LDSM012Query.ts'), 'utf8');
const moduleText = stripTypeScriptTypes(source.slice(source.indexOf('export const getInventoryData'), source.indexOf('export const getMergedInv')).replace('export const', 'const'));
const calls = [];
const db = vm.createContext({ query: { executeQuery: async (sql, binds) => { calls.push({ sql, binds }); return { rows: [[1]] }; } }, Error, console });
vm.runInContext(moduleText + '\nthis.run = getInventoryData;', db);
(async () => {
  const args = ['01-OCT-2026', '14-OCT-2026', '01-OCT-2026', '14-OCT-2026', 'B1', 'C1', '1', 'MAT', 'MB', 'O1', 'OT', 'PL', 'D', 'ST', 1, 2, 3, 4, '', 'M1'];
  for (const stock of ['', null, undefined, '  ', 'RM(without Inspection)', 'RM', 'FG', 'WIP', 'SCRAP']) {
    calls.length = 0; args[18] = stock;
    const result = await db.run(...args);
    assert.equal(calls.length, 1); assert.deepEqual(result.rows, [[1]]);
    const { sql, binds } = calls[0];
    const all = stock == null || stock.trim() === '';
    assert.equal(/\bUNION\b/.test(sql), all);
    assert.equal(/\bFROM\s+V_INPUT_COIL\b/i.test(sql), all || stock === 'RM(without Inspection)');
    assert.equal(/\bFROM\s+V_LDP_PRODN\b/i.test(sql), all || stock !== 'RM(without Inspection)');
    assert.equal((sql.match(/ORDER BY/g) || []).length, 1);
    const names = new Set([...sql.replace(/'[^']*'/g, '').matchAll(/:(\w+)/g)].map(m => m[1]));
    assert.deepEqual([...names].sort(), Object.keys(binds).sort());
    assert.equal(binds.batch, 'B1'); assert.equal(binds.widthTo, 4);
  }
  console.log('PASS: sampling date/lock/edit callbacks; inventory selections, union, filters and bind coverage');
})().catch(e => { console.error(e); process.exitCode = 1; });
