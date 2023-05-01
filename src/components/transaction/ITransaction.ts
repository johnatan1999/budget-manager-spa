export interface ITransaction {
    id?: String;
    amount: number;
    description?: string;
    date: any;
    time: any;
    state?: number | 0;
    category?: any;
    label?: any;
    source?: any;
}

export interface ITransactionList {
    transactions?: any;
    className?: String;
    withAppBar?: Boolean;
    onRemoveTransaction?: Function;
    onUpdateTransaction?: Function;
}

export interface IGroupedTransaction {
    transactions: ITransaction[];
}