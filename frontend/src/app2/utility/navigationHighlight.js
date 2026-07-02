// Navigate ไปหน้า list พร้อมส่ง id ที่ต้อง highlight

export const navigateWithHighlight = ({
  navigate,
  path,
  ids = [],
  idField = "id",
}) => {
  navigate(path, {
    state: {
      highlight: {
        ids,
        idField,
      },
    },
  });
};

// Highlight row หลังกลับมาหน้า parent

export const highlightGridRows = ({
  gridApi,
  ids = [],
  idField = "id",
}) => {
  if (!gridApi || !ids.length) return;

  gridApi.forEachNode((node) => {
    const rowId = node.data?.[idField];

    if (ids.includes(rowId)) {
      node.setSelected(true);
      gridApi.ensureNodeVisible(node, "middle");
    }
  });
};