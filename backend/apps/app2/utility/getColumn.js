const createColumnDefs = (data) => {
    if (!data?.length) return [];
  
    // Merge keys from ALL rows, not just data[0]
    const allKeys = [...new Set(data.flatMap((row) => Object.keys(row)))];
  
    return allKeys.map((key) => ({
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