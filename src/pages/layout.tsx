import React from 'react';
import { useDispatch } from 'react-redux';
import Header from '../components/header/Header';
import { Outlet } from 'react-router-dom';
import TransactionService from '../services/transaction/transaction.service';
import CategoryService from '../services/category/category.service';
import { setTransactions } from '../slices/transaction.slice';
import { setCategories } from '../slices/category.slice';

const Layout = () => {

    const dispatch = useDispatch();

    React.useEffect(() => {
        const transactionPromise = TransactionService.getAllTransaction();
        const categoriePromise = CategoryService.getAll();
        Promise.all([transactionPromise, categoriePromise])
        .then(([transactions, categories]) => {
            dispatch(setTransactions(transactions));
            dispatch(setCategories(categories));
        })
    }, []);

    return (
        <>
            <Header/>
            <Outlet/>
        </>
    )
}

export default Layout;