export const getBatchAgeBand = (value) => {
  if (value == null || String(value).trim() === "") return "";
  const days = Number(value);
  if (!Number.isFinite(days) || days < 0) return "";
  if (days <= 30) return "0-30 days";
  if (days <= 60) return "30-60 days";
  if (days <= 90) return "60-90 days";
  return "Above 90 days";
};

export const getFreeStockCategory = (grade, description) => {
  if (/NON[\s_-]*ISI\b/i.test(String(grade ?? ""))) return "Non IS";
  if (/DWG|RGD/i.test(String(description ?? ""))) return "Downgrade";
  return "ETO/Free Stock";
};
