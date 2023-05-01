import React, { useMemo, useState, useEffect } from 'react';
import CategoryService from '../services/category/category.service';
import styled from 'styled-components';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    LineElement,
    Title,
    Tooltip,
    BarElement,
    Legend,
    Filler,
  } from 'chart.js';
import TransactionLineChart from '../components/chart/TransactionLineChart';
import TransactionService from '../services/transaction/transaction.service';
import DashboardService from '../services/dashboard/dashboard.service';
import TransactionVerticalBarChart from '../components/chart/TransactionVerticalBarChart';
import TransactionByCategoryDoughnutChart from '../components/chart/TransactionByCategoryDoughnutChart';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import InformationDialog from '../components/modal/InformationDialog';
import TransactionList from '../components/transaction/TransactionList';
import TransactionContext from '../components/context/TransactionContext';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../slices/transaction.slice';
import { selectCategories } from '../slices/category.slice';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

const DashboardPage: React.FC = () => {

    const initialTransactions = useSelector(selectTransactions);

    const categories = useSelector(selectCategories);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showTransactionsModal, setShowTransactionsModal] = useState(false);
    const [transactionList, setTransactionList] = useState({});
    const [displayedTransactions, setDisplayedTransactions] = useState(initialTransactions);

    useEffect(() => {
        const date = new Date();
        date.setDate(1);
        setStartDate(date);
        const endDate = new Date();
        endDate.setDate(1);
        endDate.setMonth(date.getMonth()+1);
        setEndDate(endDate);
        handleDateChange(startDate);
    }, [initialTransactions])
    
    const { 
        lineChartData, 
        totalIncomeGroupedByCategory, 
        totalExpenseGroupedByCategory,
        totalExpense,
        totalIncome 
    } = useMemo(() => {
        const lineChartDataExpenses = DashboardService.getTotalExpenseGroupByDate(displayedTransactions);
        const lineChartDataIncomes = DashboardService.getTotalIncomeGroupByDate(displayedTransactions);
        return {
            lineChartData: { 
                expenses: Object.values(lineChartDataExpenses).reverse() || [],
                incomes: Object.values(lineChartDataIncomes).reverse() || [],
                labels: Object.keys(lineChartDataIncomes).reverse()
            },
            totalIncomeGroupedByCategory: DashboardService.getTotalIncomeGroupedByCategory(displayedTransactions), 
            totalExpenseGroupedByCategory: DashboardService.getTotalExpenseGroupedByCategory(displayedTransactions),
            totalExpense: DashboardService.getTotalExpense(displayedTransactions),
            totalIncome: DashboardService.getTotalIncome(displayedTransactions)
        }
    }, [displayedTransactions])

    const handleDateChange = (date) => {
        const start = new Date(date);
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        start.setDate(1)
        setStartDate(start);

        const end = new Date(date);
        end.setHours(0);
        end.setMinutes(0);
        end.setSeconds(0);
        end.setDate(1)
        end.setMonth(end.getMonth()+1)
        setEndDate(end);
        setDisplayedTransactions([...TransactionService.getTransactionBetweenDate(initialTransactions, start, end)]);
    }

    const handleDoughnutChartClick = (data) => {
        setTransactionList(TransactionService.groupTransactionByDate(displayedTransactions.filter((t) => t.category.id === data.category.id)));
        setShowTransactionsModal(true);
    }

    const handleLineChartClick = (data) => {
        if(data) {
            setTransactionList({
                [data.date]: TransactionService.groupTransactionByDate(displayedTransactions)[data.date].filter((t) => {
                    if(data.value < 0) return t.amount < 0;
                    else return t.amount > 0;
                })
            });
            setShowTransactionsModal(true);
        }
    }

    return (
        <TransactionContext.Provider value={{ currency: 'MGA', categories }}>
            <Wrapper className='dashboard-page'>
                <div className='tool-bar'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={dayjs(startDate)} 
                            onChange={handleDateChange} 
                            label={'"month" and "year"'} views={['month', 'year']} />
                    </LocalizationProvider>
                </div>
                <div className='chart-section'>
                    <TransactionLineChart
                        expenseData={lineChartData.expenses}
                        incomeData={lineChartData.incomes}
                        labels={lineChartData.labels}
                        onSelectPoint={handleLineChartClick}
                    />
                    <TransactionVerticalBarChart
                        expenseData={lineChartData.expenses}
                        incomeData={lineChartData.incomes}
                        labels={lineChartData.labels}
                    />
                    <TransactionByCategoryDoughnutChart
                        title={`Expense`}
                        total={totalExpense}
                        onSelectCategory={handleDoughnutChartClick}
                        transactionData={totalExpenseGroupedByCategory}
                        />
                    <TransactionByCategoryDoughnutChart
                        title={`Income`}
                        onSelectCategory={handleDoughnutChartClick}
                        total={totalIncome}
                        transactionData={totalIncomeGroupedByCategory}
                    />
                    {/* <IncomeExpenseBarChart totalExpense={totalExpense} totalIncome={totalIncome} /> */}
                    <TransactionLineChart/>
                    <TransactionLineChart/>
                    <InformationDialog 
                        title='Transactions'
                        open={showTransactionsModal} 
                        handleClose={() => setShowTransactionsModal(false)}>
                        <TransactionList transactions={transactionList} />
                    </InformationDialog>
                </div>
            </Wrapper>
        </TransactionContext.Provider>
    );
}

const Wrapper = styled.div`
    &.dashboard-page {
        padding: 50px 50px;
        min-height: calc(100vh - 70px);
        background-color: var(--light-gray);
    }
    .tool-bar {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-bottom: 20px;
    }
    .chart-section {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        > div {
            margin: auto;
            margin-bottom: 20px;
            min-width: 600px;
            min-height: 360px;
        }
    }
`;

export const getServerSideProps: any = async (ctx) => {
    const cs = new CategoryService();
    const ts = new TransactionService();
    const categories = await CategoryService.getAll();
    const transactions = await TransactionService.getAllTransaction();
    return {
        props:{
            categories: categories || [],
            transactions
        }
    }
}
 
export default DashboardPage;