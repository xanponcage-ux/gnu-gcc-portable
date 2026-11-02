const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');

const baseline = 'f6b43ea69c1de47a7c5f5557fc5311f34a262a6655bac2efe96241b1ff2ca0f7';
const previous = '8977fb044b0a3b179b0e60726576e08dd70975e8db4e614b09083ed7f5f31b5a';
const digest = text => crypto.createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex');
const marker = '// Agrico office configuration — explicit profiles';

module.exports = function officeEnv(current, template) {
  if (current.startsWith(marker)) return current;
  let original = current;
  if (digest(current) !== baseline) {
    if (digest(current) !== previous) throw new Error('Local env.ts has other edits. Keep it and merge the Agrico configuration manually.');
    const temp = os.tmpdir();
    const backups = process.env.AGRICO_PREVIOUS_ENV ? [process.env.AGRICO_PREVIOUS_ENV] :
      fs.readdirSync(temp).filter(name => name.startsWith('agrico-')).map(name =>
        path.join(temp, name, 'backup', 'Agrico_NODE', 'src', 'env.ts'));
    original = '';
    for (const file of backups) {
      if (!fs.existsSync(file)) continue;
      const text = fs.readFileSync(file, 'utf8');
      if (digest(text) === baseline) { original = text; break; }
    }
    if (!original) throw new Error('Set AGRICO_PREVIOUS_ENV to the original office env.ts backup, then run check again.');
  }
  const output = template.replace(/const (local|devAgrico|prdAgrico) = \{[\s\S]*?\n\};/g, (block, name) => {
    const oldName = {local:'local', devAgrico:'devkhapoli', prdAgrico:'prd'}[name];
    const old = original.match(new RegExp('^const ' + oldName + ' = \\{([\\s\\S]*?)^\\};', 'm'))[1];
    let result = block.replace(/^(\s*)(CHAVE_JWT|API_KEY|REFRESH_KEY|SCREEN_AUTH_KEY|ORACLE|JWT_KEY|SOAP_URL|pythonURL): process\.env\.(\w+)!,/gm,
      (_, spaces, field, variable) => {
        const match = old.match(new RegExp('^\\s*' + field + ':\\s*("(?:[^"\\\\]|\\\\.)*")', 'm'));
        if (!match) throw new Error('Cannot recover ' + field + ' in ' + oldName);
        return spaces + field + ': ' + (process.env[variable] ? JSON.stringify(process.env[variable]) : match[1]) + ',';
      });
    if (name !== 'prdAgrico') {
      const host = process.env.AGRINXT_DB_HOST;
      const descriptor = process.env.AGRINXT_DB_CONNECT_STRING || (host ?
        '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=' + host + ')(PORT=1521))(CONNECT_DATA=(SERVER=dedicated)(SERVICE_NAME=EPATEST)))' : 'EPATEST');
      result = result.replace('process.env.AGRINXT_DB_CONNECT_STRING || "EPATEST"', () => JSON.stringify(descriptor))
        .replace('process.env.AGRINXT_DB_HOST || ""', () => JSON.stringify(host || ''));
      if (process.env.AGRINXT_UI_ORIGIN) result = result.replace('process.env.AGRINXT_UI_ORIGIN!', () => JSON.stringify(process.env.AGRINXT_UI_ORIGIN));
    }
    return result;
  });
  return marker + '\n' + output;
};
