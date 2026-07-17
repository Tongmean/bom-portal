function leftJoin(left, right, leftKey, rightKey) {

    return left.map(leftRow => {

        // Find matching row
        const rightRow = right.find(
            rightRow =>
                rightRow[rightKey] === leftRow[leftKey]
        );

        // Merge objects
        return {
            ...leftRow,
            ...rightRow
        };
    });
}
module.exports = {
    leftJoin
};