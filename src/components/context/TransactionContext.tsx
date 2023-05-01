import React from 'react';

export interface TransactionContextInterface {
    categories: any[];
    currency?: string;
    transactions?: [];
}

const TransactionContext = React.createContext<TransactionContextInterface>({
    categories: []
});


export default TransactionContext;