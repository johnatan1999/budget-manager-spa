import { Category, Transaction } from "./api.model";

export interface TransactionPageProps {
    initialTransactions: Object;
    categories: Category[];
}

export interface TransactionGroupedByCategory {
    category: any;
    transactions: any[]
}