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

module.exports = {
    pivotData
};

// /**
//  * Generically pivots an array of objects.
//  * * @param {Array} data - The flat array of data.
//  * @param {Object} config - Configuration for the pivot.
//  * @param {Array<string>} config.groupBy - The keys to group by.
//  * @param {string} config.pivotColumnKey - The key whose value becomes the new column name.
//  * @param {string} config.pivotValueKey - The key whose value is assigned to the new column.
//  * @returns {Array} - The pivoted array of objects.
//  */