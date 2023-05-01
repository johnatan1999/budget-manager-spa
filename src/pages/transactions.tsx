import React, { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import TransactionSideBar from '../components/transaction/TransactionSideBar';
import TransactionService from '../services/transaction/transaction.service';
import CategoryService from '../services/category/category.service';
import TransactionContext from '../components/context/TransactionContext';
import TransactionList from '../components/transaction/TransactionList';
import { TransactionFilterType } from '../components/transaction/TransactionFilter';
import { TransactionPageProps } from '../models/page.model';
import AppContext from '../components/context/AppContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Box } from '@mui/material';
import { addTransaction, deleteTransaction, selectTransactions, updateTransaction } from '../slices/transaction.slice';
import { selectCategories } from '../slices/category.slice';

const TransactionPage: React.FC = () => {

    const initialTransactions = useSelector(selectTransactions);
    const dispatch = useDispatch();

    const categories = useSelector(selectCategories);  
    // const [transactions, setTransactions] = useState({});
    const [allTransaction, setAllTransaction] = useState({});
    const Context = useContext(AppContext);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(undefined);
    const [filter, setFilter] = useState({
        transactionType: undefined,
        searchCriteria: undefined,
        transactionCategories: []
    });

    React.useEffect(() => {
        const tmp = TransactionService.groupTransactionByDate(initialTransactions);
        setAllTransaction(tmp);
    }, [initialTransactions]);

    const { displayedTransaction } = React.useMemo(() => {
        let transactionBetweenDate = initialTransactions;
        if(endDate)
            transactionBetweenDate = TransactionService.getTransactionBetweenDate(initialTransactions, startDate, endDate);
        let displayedTransaction = TransactionService.groupTransactionByDate(transactionBetweenDate);
        if(filter.searchCriteria) {
            displayedTransaction = TransactionService.searchTransaction(displayedTransaction, filter.searchCriteria);
        }
        if(filter.transactionType) {
            switch(filter.transactionType) {
                case 'income':
                    displayedTransaction = TransactionService.searchIncomeTransactions(displayedTransaction);
                    break;
                case 'expense':
                    displayedTransaction = TransactionService.searchExpenseTransactions(displayedTransaction);
                    break;
                default:
                    break;
            }
        }
        if(filter.transactionCategories.length > 0) {
            displayedTransaction = TransactionService.searchTransactionByCategories(displayedTransaction, filter.transactionCategories);
        }
        return {
            displayedTransaction
        }
    }, [initialTransactions, filter, endDate]);

    const handleAddTransaction = (transaction: any, cb) => {
        Context.showLoader(true);
        TransactionService.saveTransaction(transaction)
        .then((newTransaction) => {
            dispatch(addTransaction(newTransaction));
        })
        .catch((err) => {
            Context.displayErrorMessage(err.message)
            console.error(err);
        }).finally(() => {
            Context.showLoader(false);
            if(cb) cb();
        } );
    }
    
    const handleEditTransaction = (transaction: any, cb) => {
        Context.showLoader(true);
        TransactionService.updateTransaction(transaction)
        .then((updatedTransaction) => {
            dispatch(updateTransaction(updatedTransaction));
        })
        .catch((err) => {
            Context.displayErrorMessage(err.message)
            console.error(err);
        }).finally(() => {
            Context.showLoader(false);
            if(cb) cb();
        } );
    }

    const handleDeleteTransaction = (transaction, onSuccess) => {
        Context.showLoader(true);
        TransactionService.deleteTransaction(transaction)
        .then((res) => {           
            dispatch(deleteTransaction(transaction));
            if(onSuccess) {
                onSuccess();
            }
        })
        .catch((err)=>{
            console.log(err);
            Context.displayErrorMessage(err.message);
        })
        .finally(() => {
            Context.showLoader(false);
        });
    }
    
    const filterTransactionByCategories = (filterValues=[]) => {
        setFilter({...filter, transactionCategories: filterValues})    
    }

    const searchTransaction = (criteria: string) => {
        const tmp = TransactionService.searchTransaction(allTransaction, criteria);
        setFilter({ ...filter, searchCriteria: criteria });
    }

    const filterTransactionByType = (transactionTypes) => {
        if(transactionTypes.length == 1)
            setFilter({ ...filter, transactionType: transactionTypes[0] });
        else setFilter({ ...filter, transactionType: undefined });
    }

    const handleTransactionFilter = (filterType, filterValues) => {
        if(filterType === TransactionFilterType.TRANSACTION_TYPE) {
            filterTransactionByType(filterValues)
        } else if(filterType === TransactionFilterType.CATEGORIE) {
            filterTransactionByCategories(filterValues);
        } else if(filterType === 'search') {
            searchTransaction(filterValues);
        }
    }

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
        // const tmp: any = Object.values(allTransaction).reduce((acc: any, current) => acc.concat(current), []);
        // setDisplayedTransaction({...TransactionService.groupTransactionByDate(TransactionService.getTransactionBetweenDate(tmp, start, end))});
    }

    return ( 
        <TransactionContext.Provider value={{ categories: categories, currency: 'MGA' }}>
            <Wrapper className='transaction-page'>
                <TransactionSideBar 
                    onFilterTransaction={handleTransactionFilter} 
                    onAddTransaction={handleAddTransaction} 
                />
                <Box sx={{ width: '100%' }}>
                    <div className='tool-bar'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={dayjs(startDate)} 
                                onChange={handleDateChange} 
                                label={'"month" and "year"'} views={['month', 'year']} />
                        </LocalizationProvider>
                    </div>
                    <TransactionList 
                        onUpdateTransaction={handleEditTransaction} 
                        onRemoveTransaction={handleDeleteTransaction} 
                        transactions={displayedTransaction} />
                </Box>
            </Wrapper>
        </TransactionContext.Provider>
    );
}

const Wrapper = styled.div`
    &.transaction-page {
        display: flex;
        justify-content: space-around;
        flex-direction: row;
        padding: 50px 80px;
        background-color: var(--light-gray);
        min-height: 93vh; 
    }

    .transaction-side-bar {
        width: 30%;
        @media(max-width: 600px) {
            display: none;
        }
    }

    .tool-bar {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-bottom: 20px;
    }
`;

export default TransactionPage;