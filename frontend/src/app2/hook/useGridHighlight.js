import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { highlightGridRows } from "../utility/navigationHighlight";

const useGridHighlight = (
  gridApi
) => {
  const location = useLocation();

  useEffect(() => {
    if (!gridApi) return;

    const highlight =
      location.state?.highlight;

    if (!highlight) return;

    const {
      ids = [],
      idField = "id",
    } = highlight;

    if (!ids.length) return;

    const timer = setTimeout(() => {
      highlightGridRows({
        gridApi,
        ids,
        idField,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [gridApi, location.state]);
};

export default useGridHighlight;