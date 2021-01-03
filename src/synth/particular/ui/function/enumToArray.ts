const isNumber = (value: any) => isNaN(Number(value)) === false;

export const enumToArray = (e: any): Array<string> =>
    Object.keys(e)
        .filter(isNumber)
        .map((key) => e[key] || key);
