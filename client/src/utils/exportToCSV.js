export function exportToCSV(items) {
  const replacer = (key, value) => (value === null ? "" : value);
  const header = ["name", "quantity", "department"];
  let csv = items.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(",")
  );
  csv.unshift(header.join(","));
  return csv.join("\r\n");
}