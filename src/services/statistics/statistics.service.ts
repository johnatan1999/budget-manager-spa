import { Transaction } from "../../models/api.model";
import BasicService from "../basic.service";

export default class StatisticsService extends BasicService {

    static getAmountPerCategory(transactions: Transaction[]) {
        let res = {};
        transactions.forEach((t) => {
            if(!res[t.category?.name]) {
                res[t.category?.name] = {
                    category: t.category,
                    totalAmount: t.amount
                }
            } else {
                res[t.category?.name] = {
                    ...res[t.category?.name],
                    totalAmount: res[t.category?.name].totalAmount + t.amount
                }
            }
        });
        return Object.values(res);
    }

    static getIncomeAmountPerCategory(transactions: Transaction[]): any[] {
        return this.getAmountPerCategory(transactions.filter((t)=> t.amount > 0));
    }

    static getExpenseAmountPerCategory(transactions: Transaction[]): any[] {
        return this.getAmountPerCategory(transactions.filter((t)=> t.amount < 0));
    }
}