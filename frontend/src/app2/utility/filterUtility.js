/**
 * Generic Data Filter
 *
 * filters = {
 *   compact_no: ["IZ009"],
 *   status: ["Wait", "Approve"]
 * }
 */

export const filterData = (data = [], filters = {}) => {
    return data.filter((row) => {

        return Object.entries(filters).every(([field, values]) => {

            if (
                !values ||
                values.length === 0
            ) {
                return true;
            }

            const rowValue = String(
                row[field] ?? ""
            ).toLowerCase();

            return values.some((value) =>
                rowValue.includes(
                    String(value).toLowerCase()
                )
            );
        });

    });
};



export const generateFilterOptions = (
    data,
    fields
) => {

    const result = {};

    fields.forEach((field) => {

        result[field] = [
            ...new Set(
                data
                    .map(row => row[field])
                    .filter(Boolean)
            )
        ]
            .sort()
            .map(value => ({
                label: String(value),
                value: String(value)
            }));

    });

    return result;
};