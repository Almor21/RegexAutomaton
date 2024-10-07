export type TableType = {
    [k: string]: {
        [k: string]: string[];
    };
}

export type AFNTableType = {
    initialState: string;
    finalState: string;
    data: TableType;
};

export type AFDTableType = {
    initialState: string;
    finalState: string;
    data: TableType
};
