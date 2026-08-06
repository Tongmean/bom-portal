const pivotData = (data, { groupBy, pivotColumnKey, pivotValueKey }) => {
    const grouped = data.reduce((acc, row) => {
      // 1. Create a unique identifier for the group
      const groupKey = groupBy.map(key => row[key]).join('|');
  
      // 2. Initialize the group if it doesn't exist yet using Object.fromEntries
      acc[groupKey] ??= Object.fromEntries(
        groupBy.map(key => [key, row[key]])
      );
  
      // 3. Assign the new dynamic column and its corresponding value
      const dynamicColumn = row[pivotColumnKey];
      if (dynamicColumn !== undefined && dynamicColumn !== null) {
        acc[groupKey][dynamicColumn] = row[pivotValueKey];
      }
  
      return acc;
    }, {});
  
    // 4. Return just the values as an array
    return Object.values(grouped);
};

const pivotERPData = (data, groupFields) => {
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

    // Guard clause in case row.component is missing
    if (component) {
      grouped[groupKey][`${component}_erp`] = formatValue(row.erp);
      grouped[groupKey][`${component}_name`] = formatValue(row.name);
      grouped[groupKey][`${component}_quantity`] = formatValue(row.quantity);
    }
  });

  return Object.values(grouped);
};

module.exports = {
    pivotData,
    pivotERPData
};

