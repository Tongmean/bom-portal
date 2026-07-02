export function deleteIndices(arr, indicesToDelete) {
    if (!Array.isArray(arr) || !Array.isArray(indicesToDelete)) return arr;

    // Sort indices from largest to smallest so shifting doesn't ruin the order
    const sortedIndices = [...indicesToDelete].sort((a, b) => b - a);

    sortedIndices.forEach(index => {
        if (index >= 0 && index < arr.length) {
            arr.splice(index, 1); // Removes 1 item at the specified index
        }
    });

    return arr;
}
export function addElementAtIndex(arr, index, newItem) {
    if (!Array.isArray(arr)) return arr;

    // Use splice: (target_index, 0 elements to delete, item_to_insert)
    arr.splice(index, 0, newItem);
    
    return arr;
}

// --- Your Data ---
// const columnDefs = [
//     { "headerName": "customer_id", "field": "customer_id" }, // Index 0
//     { "headerName": "erp", "field": "erp" },                 // Index 1
//     { "headerName": "name", "field": "name" },               // Index 2
//     { "headerName": "nick_name", "field": "nick_name" },     // Index 3
//     { "headerName": "zone", "field": "zone" },               // Index 4
//     { "headerName": "country", "field": "country" },         // Index 5
//     { "headerName": "continent", "field": "continent" }      // Index 6
// ];

// const newEntity = { "headerName": "รหัส Entity", "field": "entity_id" };

// // Example: Insert the new entity at Index 1 (making it the second item)
// const updatedList = addElementAtIndex(columnDefs, 1, newEntity);
// console.log(updatedList);
export function updateHeaderName(columns, field, newHeaderName) {
  return columns.map(col =>
    col.field === field
      ? { ...col, headerName: newHeaderName }
      : col
  );
}
// const columns = [
//   { headerName: "customer_id", field: "customer_id" },
//   { headerName: "entity_id", field: "entity_id" },
//   { headerName: "nick_name", field: "nick_name" },
//   { headerName: "zone", field: "zone" },
//   { headerName: "country", field: "country" },
//   { headerName: "continent", field: "continent" }
// ];

// const updatedColumns = updateHeaderName(columns, "nick_name", "Nickname");

// console.log(updatedColumns);

export const createColumnDefs = (data) => {
  if (!data?.length) return [];

  // Merge keys from ALL rows, not just data[0]
  const allKeys = [...new Set(data.flatMap((row) => Object.keys(row)))];

  return allKeys.map((key) => ({
    headerName: key,
    field: key,
  }));
};