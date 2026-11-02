const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
// Apply the bundled unified text patches to a copy in memory.
function readHunks(patch) {
  const hunks = [];
  let hunk;
  for (const line of patch.replace(/\r\n/g, '\n').split('\n')) {
    const header = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
    if (header) {
      hunk = { oldStart: Number(header[1]), newStart: Number(header[2]), before: [], after: [] };
      hunks.push(hunk);
    } else if (hunk && line.startsWith('\\ No newline')) {
      for (const side of hunk.last) side[side.length - 1] = side.at(-1).slice(0, -1);
    } else if (hunk && /^[ +\-]/.test(line)) {
      hunk.last = [];
      if (line[0] !== '+') hunk.last.push(hunk.before);
      if (line[0] !== '-') hunk.last.push(hunk.after);
      for (const side of hunk.last) side.push(line.slice(1) + '\n');
    }
  }
  if (!hunks.length) throw new Error('Empty transfer patch');
  return hunks;
}

function applyHunks(source, hunks, reverse) {
  const eol = source.includes('\r\n') ? '\r\n' : '\n';
  const lines = source.replace(/\r\n/g, '\n').match(/[^\n]*\n|[^\n]+$/g) || [];
  let offset = 0;
  let minimum = 0;
  for (const hunk of hunks) {
    const from = reverse ? hunk.after : hunk.before;
    const to = reverse ? hunk.before : hunk.after;
    const start = Math.max(0, (reverse ? hunk.newStart : hunk.oldStart) - 1);
    const matches = i => i >= minimum && i + from.length <= lines.length && from.every((line, j) => lines[i + j] === line);
    let index = start + offset;
    if (!matches(index)) {
      const candidates = [];
      for (let i = minimum; i <= lines.length - from.length; i++) {
        if (matches(i)) candidates.push(i);
        if (candidates.length > 1) break;
      }
      if (candidates.length !== 1) return null;
      index = candidates[0];
    }
    lines.splice(index, from.length, ...to);
    minimum = index + to.length;
    offset = index - start + to.length - from.length;
  }
  return lines.join('').replace(/\n/g, eol);
}


function run() {
  const [mode, target = 'D:\\AGRICO', ...extra] = process.argv.slice(2);
  if (!['check', 'apply'].includes(mode) || extra.length) {
    throw new Error('Usage: Apply-AGRINXT-To-Office.cmd check|apply [office-folder]');
  }
  const bundle = path.join(__dirname, '2026-11-02-agrinxt');
  const jobs = JSON.parse(fs.readFileSync(path.join(bundle, 'manifest.json'), 'utf8'));
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agrico-'));
  const changes = [];
  const written = [];
  let keepBackup = false;
  try {
    for (const {Project, File, Patch} of jobs) {
      const dest = path.resolve(target, Project, File);
      const before = fs.readFileSync(dest);
      const stage = path.join(temp, 'stage', Project);
      const staged = path.join(stage, File);
      fs.mkdirSync(path.dirname(staged), {recursive:true});
      const hunks = readHunks(fs.readFileSync(path.join(bundle, Patch), 'utf8'));
      const source = before.toString('utf8');
      if (applyHunks(source, hunks, true) !== null) {
        console.log('Already applied:', dest);
        continue;
      }
      const result = applyHunks(source, hunks, false);
      if (result === null) throw new Error('Office edits conflict with transfer: ' + dest);
      fs.writeFileSync(staged, result);
      changes.push({dest, before, staged, backup:path.join(temp,'backup',Project,File)});
    }
    console.log(changes.length, 'files ready for', mode, 'in', path.resolve(target));
    if (mode === 'check' || !changes.length) return;
    for (const item of changes) {
      if (!fs.readFileSync(item.dest).equals(item.before)) throw new Error('Changed during check: ' + item.dest);
      fs.mkdirSync(path.dirname(item.backup), {recursive:true});
      fs.writeFileSync(item.backup, item.before);
    }
    keepBackup = true;
    for (const item of changes) {
      if (!fs.readFileSync(item.dest).equals(item.before)) throw new Error('Changed before copy: ' + item.dest);
      written.push(item);
      fs.copyFileSync(item.staged, item.dest);
      if (!fs.readFileSync(item.dest).equals(fs.readFileSync(item.staged))) throw new Error('Copy failed: ' + item.dest);
    }
  } catch (error) {
    for (const item of written.reverse()) {
      try { fs.copyFileSync(item.backup, item.dest); } catch (e) { console.error('Restore failed:', e.message); }
    }
    throw error;
  } finally {
    if (keepBackup) console.log('Original files:', path.join(temp, 'backup'));
    else fs.rmSync(temp, {recursive:true,force:true});
  }
}
try { run(); } catch (error) { console.error(error.message); process.exitCode = 1; }
