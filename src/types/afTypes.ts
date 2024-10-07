export type AFNTableType = {
    initialState: string;
    finalState: string;
    data: {
        [k: string]: {
            [k: string]: string[];
        };
    };
};

export type AFDTableType = {
    initialState: string;
    finalState: string;
    data: {
        [k: string]: {
            [k: string]: string;
        };
    };
};
