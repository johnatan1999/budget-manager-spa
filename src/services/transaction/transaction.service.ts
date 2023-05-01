import BasicService from "../basic.service";
import Config from "../../config/api.config.json";
import DateUtil from "../../utils/date.util";
import { Transaction } from "../../models/api.model";
import { TransactionGroupedByCategory } from "../../models/page.model";

export default class TransactionService extends BasicService {

    static groupTransactionByDate = (transactions: any[]) => {
        const copy = [...transactions]
        copy.sort(DateUtil.compareTransactionDateDesc);
        return copy.reduce((group, t) => {
            group[t.date] = group[t.date] ?? [];
            group[t.date].push(t);
            return group;
        }, {});
    }

    static getAllTransactionGroupedByDate = () => {
        return BasicService.fetchData(Config.Transaction.FindAll)
        .then((res) => {
            return TransactionService.groupTransactionByDate(res.data);
        })
        .catch((err) => {throw err});
    }

    static getAllTransaction = () => {
        return BasicService.fetchData(Config.Transaction.FindAll)
        .then((res) => {
            return (res.data);
        })
        .catch((err) => {throw err});
    }

    static saveTransaction = (transaction: any) => {
        return BasicService.postData(Config.Transaction.Add, transaction)
        .then((res) => res.data)
        .catch((err) => { throw err });
    }
    
    static updateTransaction = (transaction: any) => {
        return BasicService.putData(`${Config.Transaction.Update}${transaction.id}`, transaction)
        .then((res) => res.data)
        .catch((err) => { throw err });
    }

    static deleteTransaction = (transaction: any) => {
        return BasicService.deleteData(Config.Transaction.Delete + transaction.id, transaction.id)
        .then((res) => res.data)
        .catch((err) => { throw err });
    }

    static deleteTransactionFromList = (transactions, transactionToRemove: Transaction) => {
        let res = {};
        Object.keys(transactions).forEach(key => {
            res[key] = transactions[key]?.filter((t) => t.id !== transactionToRemove.id);
        });
        return res;
    }

    static pushNewTransactionInGroupedList = (transactions, newTransaction) => {
        if(transactions[newTransaction.date]) {
            transactions[newTransaction.date] = [...transactions[newTransaction.date], newTransaction];
            transactions[newTransaction.date].sort(DateUtil.compareTransactionDateDesc).reverse();
        } else transactions[newTransaction.date] = [newTransaction];
        // Order new Transaction 
        const tmp = {};
        const dates = Object.keys(transactions).sort().reverse();
        dates.forEach((date) => tmp[date] = transactions[date]);
        return tmp;
    }
    
    static updateUpdatedTransactionInGroupedList = (transactions, updatedTransaction) => {
        const dates = Object.keys(transactions).sort().reverse();
        // Remove old transaction
        dates.forEach((date) => {
            transactions[date] = transactions[date].filter((t) => updatedTransaction.id !== t.id);
        });
        // update transaction order
        return this.pushNewTransactionInGroupedList(transactions, updatedTransaction);
    }

    static searchTransaction = (transactions, criteria) => {
        let res = {};
        Object.keys(transactions).forEach((date) => {
            res[date] = transactions[date].filter((t) => {
                return t.category.name?.toLowerCase().includes(criteria.toLocaleLowerCase)
                    || t.description?.toLowerCase()?.includes(criteria.toLocaleLowerCase()) 
            });
        });
        return res;
    }
    
    static searchTransactionByCategories = (transactions, categories: any[]) => {
        let tmp = {};
        Object.keys(transactions).forEach((date) => {
            tmp[date] = transactions[date].filter((t) => {
                return categories.includes(t.category?.id);
            });
        });
        return tmp;
    } 

    static getTransactionBetweenDate = (transactions: any [], startDate: Date, endDate: Date) => {
        return transactions.filter((t) => {
            const currentDate = new Date(t.date);
            return currentDate.getTime() >= startDate.getTime() && currentDate.getTime() < endDate.getTime();
        })
    }
    
    static getTransactionBetweenDateGroupedByDate = (transactions, startDate: Date, endDate: Date) => {
        let dates = Object.keys(transactions).filter((date) => {
            const currentDate = new Date(date);
            return currentDate.getTime() >= startDate.getTime() && currentDate.getTime() < endDate.getTime(); 
        });
        let res = {};
        dates.forEach((date) => {
            res[date] = transactions[date];
        })
        return res;
    }

    static searchIncomeTransactions = (transactions) => {
        let res = {};
        Object.keys(transactions).forEach(key => {
            res[key] = transactions[key]?.filter((t) => t.amount > 0) 
        });
        return res;
    }

    static searchExpenseTransactions = (transactions) => {
        let res = {};
        Object.keys(transactions).forEach(key => {
            res[key] = transactions[key]?.filter((t) => t.amount < 0) 
        });
        return res;
    }

    static import = (data) => {
        return BasicService.postData(Config.Transaction.Import, data)
        .then((res) => res.data)
        .catch((err) => { throw err });
    }

    static getIncomesGroupedByCategory = (transactions: any[]): TransactionGroupedByCategory[] => {
        let res = {}
        transactions.filter(t => t.amount > 0)
        .forEach((t) => {
            const tmp = res[t.category.name];
            if(!tmp) {
                res[t.category.name] = { category: t.category, transactions: [] }
            }
            res[t.category.name].transactions.push(t);
        })
        return Object.values(res);
    }

    static getExpensesGroupedByCategory = (transactions: any[]): TransactionGroupedByCategory[] => {
        let res = {}
        transactions.filter(t => t.amount < 0)
        .forEach((t) => {
            const tmp = res[t.category.name];
            if(!tmp) {
                res[t.category.name] = { category: t.category, transactions: [] }
            }
            res[t.category.name].transactions.push(t);
        })
        return Object.values(res);
    }
}