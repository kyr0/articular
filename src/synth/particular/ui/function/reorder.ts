export const reorder = (list: Array<any>, startIndex: number, endIndex: number): Array<any> => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
