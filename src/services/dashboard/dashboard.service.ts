import BasicService from "../basic.service";
import API from "../../config/api.config.json";
import { TransactionGroupedByCategory } from "../../models/page.model";
import TransactionService from "../transaction/transaction.service";

export default class DashboardService {
    
    /**
     * Return transactions object grouped by date { 'dd-mm-yyyy': [...transactions] }
     * @param transactions 
     * @returns 
     */
    static getTransactionGroupedByDate = (transactions: any []) => {
        let res = {}
        transactions.forEach((transaction) => {
            const t = { ...transaction };
            t.date = t.date.substring(0, 10); // DD-MM-YYYY (10 char) remove time value
            const tmp = res[t.date];
            if(!tmp) {
                res[t.date] = []
            }
            res[t.date].push(t);
        })
        return res;
    }
    
    /**
     * return expense total grouped by date { 'dd-mm-yyyy': totalAmount }
     * @param transactions 
     * @returns 
     */
    static getTotalExpenseGroupByDate = (transactions: any[]) => {
        let res = this.getTransactionGroupedByDate(transactions);
        const dates = Object.keys(res);
        dates.forEach((date) => {
            res[date] = res[date].filter((t) => t.amount < 0).map((t) => t.amount).reduce((acc, amount) => acc - amount, 0)
        });
        return res;
    } 

    /**
     * Return income total grouped by date { 'dd-mm-yyyy': totalAmount }
     * @param transactions 
     * @returns 
     */
    static getTotalIncomeGroupByDate = (transactions: any[]) => {
        let res = this.getTransactionGroupedByDate(transactions);
        const dates = Object.keys(res);
        dates.forEach((date) => {
            res[date] = res[date].filter((t) => t.amount > 0).map((t) => t.amount).reduce((acc, amount) => acc + amount, 0)
        });
        return res;
    } 

    /**
     * Return tranasction grouped by category
     * @returns 
     */
    static getTotalTransactionGroupedByCategory = () => {
        return BasicService.fetchData(API.Dashboard.TotalTransactionGroupedByCategory)
        .then((res) => res.data)
        .catch(err => { throw err });
    }

    /**
     * Return total amount grouped by category [ { 'category': category, 'totalAmount': totalAmount } ]
     * @param transactions 
     * @returns 
     */
    static getTotalAmountGroupedByCategory = (transactions: TransactionGroupedByCategory[]) => {
        return transactions.map((elt) => {
            return {
                category: elt.category,
                totalAmount: elt.transactions.map((t) => t.amount).reduce((acc, current) => acc + current)
            }
        })
    }

    /**
     * return total income grouped by category
     * @param transactions 
     * @returns 
     */
    static getTotalIncomeGroupedByCategory = (transactions: any[]) => {
        const tmp = TransactionService.getIncomesGroupedByCategory(transactions);
        return this.getTotalAmountGroupedByCategory(tmp);
    }

    /**
     * Return total expense grouped by category
     * @param transactions 
     * @returns 
     */
    static getTotalExpenseGroupedByCategory = (transactions: any[]) => {
        const tmp = TransactionService.getExpensesGroupedByCategory(transactions);
        return this.getTotalAmountGroupedByCategory(tmp);
    }

    static getTotalIncome = (transactions: any[]): number => {
        return transactions.filter(t => t.amount > 0).map(t => t.amount).reduce((acc, current) => acc + current, 0);
    }

    static getTotalExpense = (transactions: any[]): number => {
        return transactions.filter(t => t.amount < 0).map(t => t.amount).reduce((acc, current) => acc + current, 0);
    }
}