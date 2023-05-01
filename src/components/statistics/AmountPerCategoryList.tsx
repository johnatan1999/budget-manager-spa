import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import React, { useMemo, useContext } from 'react';
import styled from 'styled-components';
import Currency from '../currency/Currency';
import { AppBar, Toolbar } from '@mui/material';
import TransactionContext from '../context/TransactionContext';
import AmountPerCategoryItem from './AmountPerCategoryItem';

export interface AmountPerCategory {
    category: any;
    totalAmount: number;
}

export interface AmountPerCategoryProps {
    className?: string;
    title?: string;
    data?: AmountPerCategory[];
    getTransactionPerCategory?: Function;
}

const AmountPerCategory: React.FC<AmountPerCategoryProps> = ({
    className='',
    title='Total',
    data=[],
    getTransactionPerCategory
}) => {

    const Context = useContext(TransactionContext);

    const { totalAmount } = useMemo(() => {
        return {
            totalAmount: data.map(elt => elt.totalAmount).reduce((acc, current)=>acc+current, 0),
        }
    }, [data]);

    return ( 
        <Wrapper className={['amount-per-category', className].join(' ')}>
            <AppBar elevation={1} position='sticky' color='default' sx={{ paddingRight: '24px', paddingLeft: '2px' }}>
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingLeft: '0',
                }} variant='dense'>
                    <span>{title}</span>
                    <Currency value={totalAmount} currency={Context.currency} />
                </Toolbar>
            </AppBar>
            <List
                sx={{
                    minWidth: '100%',
                    maxWidth: 'auto',
                    backgroundColor: 'none',
                }}
                >
                {data.map((row, index) => {
                    return (
                        <AmountPerCategoryItem key={index} 
                            details={getTransactionPerCategory(row.category.id)} 
                            categoryName={row.category?.name} 
                            totalAmount={row.totalAmount} />
                    )
                })}
            </List>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    &.amount-per-category {
        width: 100%;
    }
`;
 
export default AmountPerCategory;