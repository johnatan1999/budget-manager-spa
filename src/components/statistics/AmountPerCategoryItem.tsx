import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import React, { useMemo, useContext } from 'react';
import styled from 'styled-components';
import Currency from '../currency/Currency';
import { AppBar, Collapse, IconButton, ListItem, Toolbar } from '@mui/material';
import TransactionContext from '../context/TransactionContext';

export interface AmountPerCategoryItem {
    category: any;
    totalAmount: number;
}
export interface AmountPerCategoryItemProps {
    className?: string;
    categoryName: String;
    totalAmount: number;
    details?: any[];
}

const AmountPerCategoryItem: React.FC<AmountPerCategoryItemProps> = ({
    className='',
    categoryName,
    totalAmount,
    details
}) => {
    const [open, setOpen] = React.useState(false);
    const Context = useContext(TransactionContext);

    const handleClick = () => {
        setOpen(!open);
    };

    return ( 
        <>
            <ListItem  
                sx={{
                    backgroundColor: 'white'
                }}
                disablePadding
                component="div" >
                <ListItemButton onClick={handleClick}>
                    <ListItemText
                        primary={categoryName}
                        secondary={<Currency color='var(--dark-gray)' value={totalAmount} currency={Context.currency}/>}
                        primaryTypographyProps={{
                            fontWeight: 'medium',
                            variant: 'body2',
                        }}
                        sx={{
                            display: "flex",
                            justifyContent: 'space-between',
                            paddingRight: '32px'
                        }}
                    />
                </ListItemButton>
            </ListItem> 
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {details && details.map((transaction, index) => {
                        return (
                            <ListItemButton key={index} sx={{ pl: 4 }}>
                                <ListItemText
                                    primary={transaction.description}
                                    secondary={<Currency color='var(--dark-gray)' value={transaction.amount} currency={Context.currency}/>}
                                    primaryTypographyProps={{
                                        fontWeight: 'medium',
                                        variant: 'body2',
                                    }}
                                    sx={{
                                        display: "flex",
                                        justifyContent: 'space-between',
                                        paddingRight: '32px'
                                    }}
                                />
                            </ListItemButton>
                        )
                    })}
                </List>
            </Collapse>                           
        </>
    );
}

 
export default AmountPerCategoryItem;