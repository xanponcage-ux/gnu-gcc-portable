const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');

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
      fs.writeFileSync(staged, before);
      const patch = (...flags) => {
        const result = spawnSync('git', ['apply', '-p2', '--ignore-space-change', ...flags, path.join(bundle, Patch)], {cwd:stage, encoding:'utf8'});
        if (result.error) throw result.error;
        return result;
      };
      if (patch('--reverse', '--check').status === 0) {
        console.log('Already applied:', dest);
        continue;
      }
      const result = patch();
      if (result.status !== 0) throw new Error(dest + '\n' + result.stderr);
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
