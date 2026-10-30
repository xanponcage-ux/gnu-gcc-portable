export const inspectionFields = ["REMARKS", "PIPE_TEMP_BEFORE_CHROMATE", "VISUAL_CHROMATE_APP", "SOLUTION_C_TEMP", "PIPTMP_AFCRM_110", "PIPTMP_BEFBE_110", "ADHESIVE_FILM_TEMP", "PEPP_FILM_TEMP", "WATER_TEMP_BEFORE_QUENCHING", "WATER_TEMP_AFTER_QUENCHING", "LINE_SPEED", "DEW_POINT_EPOXY", "EPOXYGUN", "ADHESIVE_SCREW_RPM", "PEPP_RPM1", "PEPP_RPM2", "RESULT", "CHROM_MANUFACT", "CHROMATE_GRADE", "CHROMATE_BATCH", "EPOXY_MANUFACT", "EPOXY_GRADE", "EPOXY_BATCH", "ADHENSIVE_MANUFACT", "ADHESIVE_GRADE", "ADHESIVE_BATCH", "PEPP_MANUFACT", "PEPP_GRADE", "PEPP_BATCH", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "FA1", "FA2", "FA3", "FA4", "FA5", "FA6", "FA7", "FA8", "FA9", "FA10", "FA11", "FA12", "FB1", "FB2", "FB3", "FB4", "FB5", "FB6", "FB7", "FB8", "FB9", "FB10", "FB11", "FB12", "INSP_NAME"];
export const inspectionHeaders = ["Pipe_No", ...inspectionFields];

export function parseInspectionRows(rows) {
  const headers = (rows[0] || []).map(value => String(value ?? "").trim().toUpperCase());
  if (!headers.includes("PIPE_NO")) throw new Error("Excel requires a Pipe_No column.");
  if (new Set(headers).size !== headers.length) throw new Error("Duplicate Excel headers are not allowed.");
  const unknown = headers.filter(h => h && h !== "PIPE_NO" && !inspectionFields.includes(h));
  if (unknown.length) throw new Error("Unknown Excel columns: " + unknown.join(", ") + ". Use the template.");
  const result = [];
  const seen = new Set();
  rows.slice(1).forEach((row, index) => {
    if (!row.some(v => String(v ?? "").trim())) return;
    const pipe = row[headers.indexOf("PIPE_NO")];
    if (typeof pipe !== "string" || !pipe.trim()) throw new Error(`Row ${index + 2}: Pipe_No must be Text and nonempty.`);
    const pipeNo = pipe.trim();
    if (seen.has(pipeNo)) throw new Error("Duplicate Pipe_No: " + pipeNo);
    seen.add(pipeNo);
    const values = {};
    inspectionFields.forEach(field => {
      const value = row[headers.indexOf(field)];
      if (value != null && String(value).trim() !== "") values[field] = typeof value === "string" ? value.trim() : value;
    });
    if (values.RESULT != null) values.RESULT = String(values.RESULT).toUpperCase();
    result.push({ pipeNo, values });
  });
  if (!result.length) throw new Error("The workbook contains no data rows.");
  return result;
}

export function mergeInspectionRow(base, uploaded) {
  const merged = { ...base };
  // Whitelist editable inspection values; never replace database identity/routing.
  inspectionFields.forEach(field => {
    if (uploaded && uploaded[field] != null && String(uploaded[field]).trim() !== "") merged[field] = uploaded[field];
  });
  return merged;
}

export function validateInspectionRow(row) {
  const missing = ["REMARKS", "INSP_NAME", "RESULT"]
    .filter(field => row[field] == null || String(row[field]).trim() === "");
  if (missing.length) return "Pipe " + row.PIPE_NO + ": required " + missing.join(", ");
  if (!["OK", "NOT OK"].includes(String(row.RESULT).trim().toUpperCase())) return "Pipe " + row.PIPE_NO + ": Result must be OK or NOT OK.";
  return "";
}
