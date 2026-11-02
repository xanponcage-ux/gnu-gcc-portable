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
  const [mode, ...args] = process.argv.slice(2);
  const flag = args.indexOf('--change-set');
  let changeSet = '2026-11-02-agrico-env';
  if (flag !== -1) {
    changeSet = args.splice(flag, 2)[1];
    if (!changeSet || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}[-a-z0-9]*$/.test(changeSet)) {
      throw new Error('Supply a dated bundle name after --change-set');
    }
  }
  if (!['check', 'apply'].includes(mode) || args.length > 1 || args[0]?.startsWith('--')) {
    throw new Error('Usage: Apply-AGRINXT-To-Office.cmd check|apply [office-folder] [--change-set name]');
  }
  const target = args[0] || 'D:\\AGRICO';
  const bundle = path.join(__dirname, changeSet);
  console.log('Selected change set:', changeSet);
  const jobs = JSON.parse(fs.readFileSync(path.join(bundle, 'manifest.json'), 'utf8'));
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agrico-'));
  const changes = [];
  const written = [];
  let keepBackup = false;
  try {
    const read = file => fs.existsSync(file) ? fs.readFileSync(file) : null;
    const normal = bytes => bytes?.toString('utf8').replace(/\r\n/g, '\n');
    const same = (a, b) => a === null ? b === null : b !== null && a.equals(b);
    const queue = (dest, before, after) => changes.push({dest, before, after,
      backup: path.join(temp, 'backup', path.relative(path.resolve(target), dest))});
    for (const job of jobs) {
      const dest = path.resolve(target, job.Project, job.File);
      const current = read(dest);
      const original = job.From ? path.resolve(target, job.Project, job.From) : dest;
      const before = job.From ? read(original) : current;
      const hunks = job.Patch && readHunks(fs.readFileSync(path.join(bundle, job.Patch), 'utf8'));
      if (job.From && current !== null) {
        if (before === null && (!hunks || applyHunks(normal(current), hunks, true) !== null)) continue;
        throw new Error('Conflicting rename: ' + original + ' -> ' + dest);
      }
      let after;
      if (job.Content) {
        after = fs.readFileSync(path.join(bundle, job.Content));
        if (current && normal(current) === normal(after)) continue;
        if (job.BeforeHash) {
          const hash = before && require('node:crypto').createHash('sha256').update(normal(before)).digest('hex');
          if (hash !== job.BeforeHash) throw new Error('Office configuration differs: ' + original);
        } else if (current !== null) throw new Error('New file already exists: ' + dest);
        if (before?.includes(Buffer.from('\r\n'))) after = Buffer.from(normal(after).replace(/\n/g, '\r\n'));
      } else {
        if (before === null) throw new Error('Missing office file: ' + original);
        after = before;
        if (hunks) {
          const source = before.toString('utf8');
          if (!job.From && applyHunks(source, hunks, true) !== null) continue;
          const result = applyHunks(source, hunks, false);
          if (result === null) throw new Error('Office edits conflict with transfer: ' + original);
          after = Buffer.from(result);
        }
      }
      queue(dest, current, after);
      if (job.From) queue(original, before, null);
    }
    console.log(changes.length, 'file operations ready for', mode, 'in', path.resolve(target));
    if (mode === 'check' || !changes.length) return;
    for (const item of changes) {
      if (!same(read(item.dest), item.before)) throw new Error('Changed during check: ' + item.dest);
      if (item.before !== null) {
        fs.mkdirSync(path.dirname(item.backup), {recursive:true});
        fs.writeFileSync(item.backup, item.before);
      }
    }
    keepBackup = true;
    for (const item of changes) {
      if (!same(read(item.dest), item.before)) throw new Error('Changed before copy: ' + item.dest);
      written.push(item);
      if (item.after === null) fs.unlinkSync(item.dest);
      else {
        fs.mkdirSync(path.dirname(item.dest), {recursive:true});
        fs.writeFileSync(item.dest, item.after);
      }
      if (!same(read(item.dest), item.after)) throw new Error('Write failed: ' + item.dest);
    }
  } catch (error) {
    for (const item of written.reverse()) {
      try {
        if (item.before === null) fs.rmSync(item.dest, {force:true});
        else fs.copyFileSync(item.backup, item.dest);
      } catch (e) { console.error('Restore failed:', e.message); }
    }
    throw error;
  } finally {
    if (keepBackup) console.log('Original files:', path.join(temp, 'backup'));
    else fs.rmSync(temp, {recursive:true,force:true});
  }
}
try { run(); } catch (error) { console.error(error.message); process.exitCode = 1; }
