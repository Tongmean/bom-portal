export const pivotPackagingData = (
  data,
  groupFields
) => {
  const grouped = {};

  const formatValue = (value) => {
    return value === null || value === undefined || value === ""
      ? "-"
      : value;
  };

  data.forEach((row) => {
    const groupKey = groupFields.map((f) => row[f]).join("|");

    if (!grouped[groupKey]) {
      grouped[groupKey] = {};

      groupFields.forEach((field) => {
        grouped[groupKey][field] = formatValue(row[field]);
      });
    }

    const component = row.component;

    grouped[groupKey][`${component}_erp`] = formatValue(row.erp);
    grouped[groupKey][`${component}_name`] = formatValue(row.name);
    grouped[groupKey][`${component}_id`] = formatValue(row.id);
    grouped[groupKey][`${component}_quantity`] = formatValue(row.quantity);
  });

  return Object.values(grouped);
};

export const createColumnDefs = (data) => {
  if (!data?.length) return [];

  // Merge keys from ALL rows, not just data[0]
  const allKeys = [...new Set(data.flatMap((row) => Object.keys(row)))];

  return allKeys.map((key) => ({
    headerName: key,
    field: key,
  }));
};
