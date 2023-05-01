import React, { useContext } from 'react';
import Paper from '@mui/material/Paper';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import TransactionContext from '../context/TransactionContext';
import { InputAdornment, TextField, Box } from '@mui/material';
import AddTransactionButton from '../button/AddTransactionButton';
import TransactionFilter, { TransactionFilterType } from './TransactionFilter';

export interface TransactionSideBarProps {
    className?: string;
    onAddTransaction?: Function;
    onFilterTransaction: Function;
    // categories?: any[];
    withAddButton?: boolean;
}

const TransactionSideBar: React.FC<TransactionSideBarProps> = ({
    className='',
    onAddTransaction=()=>{},
    onFilterTransaction,
    // categories=[],
    withAddButton=true
}) => {
    const Context = useContext(TransactionContext);

    return ( 
        <Wrapper className={['transaction-side-bar', className].join(' ')}>
            <Paper sx={{
                width: '100%',
                minHeight: '300px',
                display: 'flex',
                padding: '5px',
                flexDirection: 'column',
                justifyContent: 'flexStart',
                alignItems: 'center'

            }} >
                <Typography sx={{ fontSize: '20px', padding: '10px', marginBottom: '10px' }} variant="h4" component="h4">
                    Transactions
                </Typography>
                {withAddButton && <AddTransactionButton 
                    sx={{ marginBottom: '40px', width: '150px'}}
                    categories={Context.categories} 
                    onAddTransaction={onAddTransaction} />}
                <TextField
                    id="outlined-start-adornment"
                    sx={{ m: 1, width: '25ch', marginBottom: '24px' }}
                    size='small'
                    placeholder="Search"
                    onChange={(e) => onFilterTransaction('search', e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
                    }}
                />
                <Box>
                    <TransactionFilter title="Categories" 
                        onFilter={(value: any) => onFilterTransaction(TransactionFilterType.CATEGORIE, value)}
                        data={Context.categories.map((category: any) => { 
                            return { id: category.id, label: category.name }
                        })}
                    />
                    <TransactionFilter title="Transaction types" 
                        onFilter={(value: any) => onFilterTransaction(TransactionFilterType.TRANSACTION_TYPE, value)}
                        data={[
                            {id: 'income', label: 'Income'},
                            {id: 'expense', label: 'Expense'}
                        ]}
                    />
                </Box>
            </Paper>            
        </Wrapper>
    );
}

const Wrapper = styled.div`
    &.transaction-side-bar {
        min-width: 250px;
        min-height: 300px;
        display: flex;
    }

    .transaction-modal {
        .m-body {
            padding: 0;
        }
    }
`;

export default TransactionSideBar;