import { Button, IconButton } from '@mui/material';
import React from 'react';
import Modal from '../modal/Modal';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TransactionForm from '../transaction/TransactionForm';

export interface AddTransactionButtonProps {
    categories: any[];
    onAddTransaction: Function;
    sx?: any;
}

const AddTransactionButton: React.FC<AddTransactionButtonProps> = ({
    categories=[],
    onAddTransaction,
    sx={}
}) => {

    const [openAddForm, setOpenAddForm] = React.useState(false);
    const handleOpen = () => {
        setOpenAddForm(true);
    };
    const handleClose = () => {
        setOpenAddForm(false);
    }; 
    const handleAddTransactionSucess = (transaction: any) => {
        if(onAddTransaction) {
            return onAddTransaction(transaction, () => {
                setOpenAddForm(false);
            });
        }
    }
    return ( 
        <>
            <Button sx={sx} 
                variant='contained' 
                color='success'
                onClick={handleOpen}
                startIcon={<AddIcon/>}
                >Add</Button>
            {/* <Modal width={'large'} className='transaction-modal' title='Add Transaction' show={openAddForm} closeOnClickOutside onClose={handleClose}>
                <TransactionForm onAddTransaction={handleAddTransactionSucess} categories={categories} />
            </Modal> */}
            <Dialog onClose={handleClose} open={openAddForm} maxWidth="lg">
                <DialogTitle>
                    Add Transaction
                    {handleClose && <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                        >
                        <CloseIcon />
                    </IconButton>}
                </DialogTitle>
                <DialogContent>
                    <TransactionForm onAddTransaction={handleAddTransactionSucess} categories={categories} />
                </DialogContent>
            </Dialog>
        </>
    );
}
 
export default AddTransactionButton;