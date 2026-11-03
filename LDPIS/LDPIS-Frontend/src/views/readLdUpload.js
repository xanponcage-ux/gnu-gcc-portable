import * as XLSX from "xlsx";

export async function readUpload(file, keys, fields, aliases = {}) {
  const book = XLSX.read(await file.arrayBuffer(), {type:"array"});
  const sheet = book.Sheets[book.SheetNames[0]];
  if (!sheet) throw new Error("No worksheet found.");
  const [head = [], ...rows] = XLSX.utils.sheet_to_json(sheet, {header:1, raw:false, defval:""});
  const names = head.map(h => String(h).trim().toUpperCase()).map(h => aliases[h] || h);
  if (keys.some(k => !names.includes(k)) || names.some(n => !fields.includes(n)) || new Set(names).size !== names.length)
    throw new Error("Expected headers: " + fields.join(", "));
  const seen = new Set(), result = [];
  rows.forEach((cells,i) => {
    if (!cells.some(v => String(v).trim())) return;
    const row = Object.fromEntries(names.map((n,j) => [n,String(cells[j] ?? "").trim()]));
    const key = JSON.stringify(keys.map(k => row[k]));
    if (keys.some(k => !row[k]) || seen.has(key)) throw new Error("Missing or duplicate identifier at Excel row " + (i+2));
    seen.add(key); result.push(row);
  });
  if (!result.length) throw new Error("No data rows.");
  return result;
}
export function downloadTemplate(name, headers) {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet([headers]),"Upload");
  XLSX.writeFile(book,name + ".xlsx");
}
