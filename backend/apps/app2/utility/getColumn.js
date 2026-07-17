const createColumnDefs = (data) => {
    if (!data?.length) return [];
  
    // Merge keys from ALL rows, not just data[0]
    const allKeys = [...new Set(data.flatMap((row) => Object.keys(row)))];
  
    return allKeys.map((key) => ({
      headerName: key,
      field: key,
    }));
  };
module.exports = {
    createColumnDefs
};