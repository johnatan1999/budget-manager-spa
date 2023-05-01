import { Box, Button, Stack } from '@mui/material';
import React, { useContext } from 'react';
import CategoryService from '../services/category/category.service';
import CategoryData from '../data/category.data.json';
import TransactionData from '../data/transaction.data.json';
import TransactionService from '../services/transaction/transaction.service';
import AppContext from '../components/context/AppContext';
import DateUtil from '../utils/date.util';

const ControlPanelPage = () => {

    const Context = useContext(AppContext);

    const handleCategoryImport = () => {
        const data = CategoryData.categories.map((elt) => {
            return {
                id: null,
                properties: JSON.stringify(elt)
            }
        });
        CategoryService.import(data).then((res) => {
            alert(JSON.stringify(res));
        }).catch(err => {
            console.error(err);
            Context.displayErrorMessage(err)
        });
    }
    
    const handleTransactionImport = () => {
        const data = TransactionData.map((elt) => {
            const date = new Date(elt.date);
            return {
                ...elt,
                id: null,
                amount: (elt.amount),
                time: DateUtil.getTimeOfDay(date) 
            }
        })//.filter((elt, index) => index < 3);
        TransactionService.import(data)
        .then((res) => {
            alert(JSON.stringify(res));
        })
        .catch((err) => {
            console.error(err);
            Context.displayErrorMessage(err)
        })
    }

    return ( 
        <Box>
            <Stack>
                <Button 
                    variant='contained'
                    onClick={handleCategoryImport}>
                    Import Categories
                </Button>
                <Button 
                    variant='contained'
                    onClick={handleTransactionImport}>
                    Import Transactions
                </Button>
            </Stack>
        </Box>
    );
}
 
export default ControlPanelPage;