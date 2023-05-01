import React, { useState, useMemo } from 'react';
import CategoryService from '../services/category/category.service';
import styled from 'styled-components';
import TransactionService from '../services/transaction/transaction.service';
import { Category, Transaction } from '../models/api.model';
import TransactionContext from '../components/context/TransactionContext';
import TransactionSideBar from '../components/transaction/TransactionSideBar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Box, Paper, Tab, Tabs } from '@mui/material';
import AmountPerCategory from '../components/statistics/AmountPerCategoryList';
import StatisticsService from '../services/statistics/statistics.service';
import TransactionLineChart from '../components/chart/TransactionLineChart';
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
import { selectTransactions } from '../slices/transaction.slice';
import { selectCategories } from '../slices/category.slice';
import { useSelector } from 'react-redux';

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

const TabPanel = ({
    children, 
    value, 
    index
}) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {value === index && (
            children
        )}
      </div>
    );
}

interface StatisticsPageProps {
    categories: Category[];
    transactions: Transaction[];
}

const StatisticsPage: React.FC = () => {

    const initialTransactions = useSelector(selectTransactions);
    const categories = useSelector(selectCategories);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [currentTab, setCurrentTab] = useState(0);
    const [displayedTransaction, setDisplayedTransaction] = useState(initialTransactions);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

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
        const tmp: any[] = initialTransactions.reduce((acc, current) => acc.concat(current), []);
        setDisplayedTransaction(TransactionService.getTransactionBetweenDate(tmp, start, end));
    }

    const getTransactionByCategory = (category_id) => {
        return displayedTransaction.filter((t) => t.category.id === category_id);
    }

    const { amountPerCategory } = useMemo(() => {
        return {
            amountPerCategory: {
                incomeData: StatisticsService.getIncomeAmountPerCategory(displayedTransaction),
                expenseData: StatisticsService.getExpenseAmountPerCategory(displayedTransaction)
            }
        }
    }, [displayedTransaction]);

    const a11yProps = (index: number) => {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <TransactionContext.Provider value={{ categories: categories, currency: 'MGA' }}>
            <Wrapper className='statistics-page'>
                <TransactionSideBar 
                    onFilterTransaction={()=>{}} 
                    withAddButton={false}
                />
                <Paper sx={{ 
                    width: '100%', 
                    marginLeft: '25px', padding: '20px' 
                    }}>
                    <div className='tool-bar'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={dayjs(startDate)} 
                                onChange={handleDateChange} 
                                label={'"month" and "year"'} views={['month', 'year']} />
                        </LocalizationProvider>
                    </div>
                    <div className='content'>
                    <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab label="Report" {...a11yProps(0)} />
                        <Tab label="Income" {...a11yProps(1)} />
                        <Tab label="Expense" {...a11yProps(2)} />
                    </Tabs>
                    <TabPanel value={currentTab} index={0}>
                        <AmountPerCategory getTransactionPerCategory={getTransactionByCategory}  data={amountPerCategory.incomeData} />
                        <AmountPerCategory getTransactionPerCategory={getTransactionByCategory}  data={amountPerCategory.expenseData} />
                    </TabPanel>
                    <TabPanel value={currentTab} index={1}>
                        <TransactionLineChart 
                            elevation={0}
                            labels={amountPerCategory.incomeData.map((t)=>t.category.name)} 
                            incomeData={amountPerCategory.incomeData.map((t)=>t.totalAmount)} 
                            />
                    </TabPanel>
                    <TabPanel value={currentTab} index={2}>
                        <TransactionLineChart 
                            elevation={0}
                            labels={amountPerCategory.expenseData.map((t)=>t.category.name)} 
                            expenseData={amountPerCategory.expenseData.map((t)=>t.totalAmount)} />
                    </TabPanel>
                    </div>
                </Paper>
            </Wrapper>
        </TransactionContext.Provider>
    );
}

const Wrapper = styled.div`
    &.statistics-page {
        display: flex;
        justify-content: space-around;
        padding: 50px 80px;
        background-color: var(--light-gray);
        min-height: 93vh; 

    }
    .transaction-side-bar {
        width: 30%;
    }
    .tool-bar {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-bottom: 20px;
    }
`;

 
export default StatisticsPage;