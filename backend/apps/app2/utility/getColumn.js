// const createColumnDefs = (data) => {
//     if (!data?.length) return [];
  
//     // Merge keys from ALL rows, not just data[0]
//     const allKeys = [...new Set(data.flatMap((row) => Object.keys(row)))];
  
//     return allKeys.map((key) => ({
//       headerName: key,
//       field: key,
//     }));
// };

const createColumnDefs = (data) => {
    if (!data?.length) return [];
  
    // 1. Count occurrences to find the "most used" fields
    const keyCounts = {};
    data.forEach((row) => {
      Object.keys(row).forEach((key) => {
        keyCounts[key] = (keyCounts[key] || 0) + 1;
      });
    });
  
    const allKeys = Object.keys(keyCounts);
  
    const baseKeys = [];
    const groupedKeysMap = {};
  
    // 2. Separate standard fields from grouped fields
    allKeys.forEach((key) => {
      // Regex looks for a prefix with a number (e.g., "WIP_1", "กล่องชั้นนอก-1") 
      // followed by "_erp", "_name", or "_quantity"
      const match = key.match(/^(.*[-_]\d+)_(erp|name|quantity)$/);
  
      if (match) {
        const prefix = match[1]; // e.g., "WIP_1"
        const suffix = match[2]; // e.g., "erp"
        
        if (!groupedKeysMap[prefix]) groupedKeysMap[prefix] = [];
        groupedKeysMap[prefix].push({ key, suffix });
      } else {
        // Put standard fields like fg_erp, status, product_reg_id here
        baseKeys.push(key);
      }
    });
  
    // 3. Sort Base Keys: Most frequent first (appears in the most rows)
    baseKeys.sort((a, b) => keyCounts[b] - keyCounts[a]);
  
    // 4. Sort and flatten Grouped Keys
    const suffixOrder = { 'erp': 1, 'name': 2, 'quantity': 3 };
    const sortedGroupedKeys = [];
  
    // Sort the group names logically (e.g., WIP_1 comes before WIP_2)
    const sortedPrefixes = Object.keys(groupedKeysMap).sort((a, b) => 
      a.localeCompare(b, undefined, { numeric: true })
    );
  
    sortedPrefixes.forEach((prefix) => {
      // Sort items within the group: _erp -> _name -> _quantity
      groupedKeysMap[prefix].sort((a, b) => suffixOrder[a.suffix] - suffixOrder[b.suffix]);
      
      // Add the sorted group to our final array
      groupedKeysMap[prefix].forEach((item) => sortedGroupedKeys.push(item.key));
    });
  
    // 5. Combine and map to AG-Grid / Table column definition format
    return [...baseKeys, ...sortedGroupedKeys].map((key) => ({
      headerName: key,
      field: key,
    }));
  };

const reorderAuto = (array) => {
    return array.map(item => {
        const textKeys = [];
        const numericKeys = [];

        Object.keys(item).forEach(key => {
            // Separate numeric/ID string keys (e.g., '542', '640') from text keys
            if (/^\d+$/.test(key)) {
                numericKeys.push(key);
            } else {
                textKeys.push(key);
            }
        });

        const reordered = {};
        
        // Put standard text keys first
        textKeys.forEach(k => reordered[k] = item[k]);
        
        // Put dynamic numeric keys last
        numericKeys.forEach(k => reordered[k] = item[k]);

        return reordered;
    });
};
const sortColumnDefs = (columnDefs, standardFields = []) => {
    return columnDefs.sort((a, b) => {
        const isADynamic = !standardFields.includes(a.field);
        const isBDynamic = !standardFields.includes(b.field);

        // 1. Move standard fields upfront and dynamic fields to the end
        if (!isADynamic && isBDynamic) return -1;
        if (isADynamic && !isBDynamic) return 1;

        // 2. If BOTH fields are dynamic, sort them alphabetically by field name
        if (isADynamic && isBDynamic) {
            return a.field.localeCompare(b.field, undefined, { numeric: true });
        }

        // 3. If BOTH fields are standard, sort them exactly by the order defined in `standardFields`
        return standardFields.indexOf(a.field) - standardFields.indexOf(b.field);
    });
};
module.exports = {
    createColumnDefs,
    reorderAuto,
    sortColumnDefs
};