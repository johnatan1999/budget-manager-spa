import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { IGroupedTransaction } from './ITransaction';
import TransactionList from './TransactionList';
import { AppBar } from '@mui/material';
import Currency from '../currency/Currency';

interface TabPanelProps {
    children?: any;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <>{children}</>
        )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const GroupedTransaction: React.FC<IGroupedTransaction> = ({
    transactions=[]
}) => {

    const [currentTab, setCurrentTab] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const { totalIncome, totalExpense } = useMemo(() => {
        let totalIncome_ = transactions
        .map((transaction) => transaction.amount)
        .reduce((previousValue, amount) => {
            if(amount > 0) return previousValue + amount;
            return previousValue;
        }) ;
        let totalExpense_ = transactions
        .map((transaction) => transaction.amount)
        .reduce((previousValue, amount) => {
            if(amount < 0) return previousValue + amount;
            return previousValue;
        }) ;
        return {
            totalIncome: totalIncome_,
            totalExpense: totalExpense_
        }
    }, [transactions]);

    const { allTransaction, incomes, expenses } = useMemo(() => {
        const incomes = transactions.filter(transaction => transaction.amount > 0);
        const expenses = transactions.filter(transaction => transaction.amount < 0);
        return {
            allTransaction: transactions,
            incomes, 
            expenses
        }

    }, [transactions]);

    const TabLabel = ({name, totalAmount}) => {
        return (
            <>
                <label>{name}</label>
                <Currency value={totalAmount} />
            </>
        )
    }

    return ( 
        <Box sx={{ width: '60%' }}>
            <AppBar position='static' color='default'>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab {...a11yProps(0)} label={<TabLabel name="All" totalAmount={(totalIncome+totalExpense)} />}/>
                    <Tab  {...a11yProps(1)} label={<TabLabel name="Income" totalAmount={totalIncome} />} />
                    <Tab {...a11yProps(2)} label={<TabLabel name="Expense" totalAmount={totalExpense} />} />
                </Tabs>
            </AppBar>
            <TabPanel value={currentTab} index={0}>
                <TransactionList transactions={allTransaction} />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
                <TransactionList transactions={incomes} />
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
                <TransactionList transactions={expenses} />
            </TabPanel>
        </Box>
    );
}
 
export default GroupedTransaction;