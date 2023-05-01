export interface Transaction {
    id?: string;
    amount: number;
    description?: string;
    date: any;
    time: any;
    state?: number | 0;
    category?: any;
    label?: any;
    source?: any;
}

export interface Category {
    id?: string;
    name: string;
    type?: string;
}