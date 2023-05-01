import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useMemo, useContext } from 'react';
import styled from 'styled-components';
import { ITransactionList } from './ITransaction';
import Currency from '../currency/Currency';
import { AppBar, Checkbox, FormControlLabel, IconButton, ListItem, Menu, MenuItem, Toolbar } from '@mui/material';
import TransactionContext from '../context/TransactionContext';
import ConfirmAction from '../button/ConfirmAction';
import InformationDialog from '../modal/InformationDialog';
import TransactionForm from './TransactionForm';

const TransactionList: React.FC<ITransactionList> = ({
    className='',
    transactions={},
    withAppBar = true,
    onRemoveTransaction,
    onUpdateTransaction
}) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedTransaction, setSelectedTransaction] = React.useState(null);
    const [openEditForm, setOpenEditForm] = React.useState(false);
    const Context = useContext(TransactionContext);

    const handleMenu = (event: React.MouseEvent<HTMLElement>, transaction) => {
        setSelectedTransaction(transaction);
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleCloseEditForm = () => {
        setOpenEditForm(false);
    }

    const handleTransactionSelection = (transaction) => {
        setSelectedTransaction(transaction);
        setOpenEditForm(true);
    }

    const { totalAmount, totalAmountGroupedByDay } = useMemo(() => {
        let tmp = {};
        const dates = Object.keys(transactions);
        dates.forEach((date) => {
            tmp[date] = transactions[date].map((transaction) => transaction.amount).reduce((acc, amount) => acc + amount, 0)
        });
        return {
            totalAmount: ([].concat(...Object.values(transactions))).map((transaction) => transaction.amount).reduce((acc, amount) => acc + amount, 0),
            totalAmountGroupedByDay: tmp
        }
    }, [transactions]); 

    const TransactionInfos = ({transaction}) => {
        return <span className='transaction-infos'>
            {/* <span>{transaction.time}</span> */}
            <span>{transaction.description}</span>
            <Currency value={transaction.amount} currency={Context.currency}/>
        </span>;
    }

    return ( 
        <Wrapper className={['transaction-list', className].join(' ')}>
            {withAppBar &&
                <AppBar position='sticky' color='default' sx={{ paddingRight: '24px', paddingLeft: '2px' }}>
                    <Toolbar sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingLeft: '0',
                    }} variant='dense'>
                        <FormControlLabel control={<Checkbox size='small' />} label="Select All" />
                        <Currency value={totalAmount} currency={Context.currency} />
                    </Toolbar>
                </AppBar>
            }
            <List
                sx={{
                    minWidth: '100%',
                    maxWidth: 'auto',
                    backgroundColor: 'none',
                }}
                >
                {Object.keys(transactions).map((date) => {
                    return (
                        <div key={date}>
                            <ListItem component="div" >
                                <ListItemText
                                    primary={new Date(date).toUTCString()}
                                    secondary={<Currency color='var(--dark-gray)' value={totalAmountGroupedByDay[date]} currency={Context.currency}/>}
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
                            </ListItem>
                            {transactions[date].map((t, index) => {
                                return (
                                    <ListItem 
                                        key={index}
                                        sx={{
                                            backgroundColor: 'white'
                                        }}
                                        secondaryAction={
                                            <IconButton sx={{left: '4px'}}
                                                size="small"
                                                aria-label="account of current user"
                                                aria-controls="menu-appbar"
                                                aria-haspopup="true"
                                                onClick={(e) => handleMenu(e, t)}
                                                color="inherit"
                                            >
                                                <MoreVertIcon />
                                            </IconButton> 
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton sx={{paddingRight: '64px'}} onClick={()=>{handleTransactionSelection(t)}}>
                                            <Checkbox size='small'/>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <ImageIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText sx={{
                                                display: "flex",
                                                justifyContent: 'space-between'
                                            }} primary={t.category?.name} secondary={<TransactionInfos transaction={t}/>} />
                                            {/* <ListItemText
                                                primary={t.time}
                                            /> */}
                                        </ListItemButton>
                                    </ListItem>
                                )
                            })}
                        </div>
                    )
                })}
                
            </List>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={()=>{ handleTransactionSelection(selectedTransaction) }} >Edit</MenuItem>
                <ConfirmAction 
                    onConfirm={(onSuccess) => {
                        onRemoveTransaction(selectedTransaction, onSuccess)
                        handleCloseMenu();
                    }}
                    onAbort={() =>  handleCloseMenu()}
                    Component={MenuItem} 
                    content='Do you realy want to remove this transaction?' >Delete</ConfirmAction>
            </Menu>
            <InformationDialog open={openEditForm} title='Edit transaction' handleClose={handleCloseEditForm} >
                <TransactionForm 
                    onUpdateTransaction={(transaction) => { 
                        onUpdateTransaction(transaction, ()=>{
                            setOpenEditForm(false);
                        });
                    }} 
                    categories={Context.categories} 
                    defaultTransaction={selectedTransaction} />
            </InformationDialog>
            {!transactions && <div className='no-result'>No Result</div>}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    &.transaction-list {
        width: 100%;
        padding-left: 25px;
    }
    .transaction-infos {
        display: flex;
        min-width: 400px;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 3px;
        span:first-child {
            max-width: 300px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 1px;
        }
    }
    .no-result {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vh;
        font-size: 30px; 
        font-weight: 600;
    }
`;
 
export default TransactionList;