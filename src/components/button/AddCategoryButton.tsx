import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DialogContentText from '@mui/material/DialogContentText';

export interface AddCategoryButtonProps {
    Component?: any;
    children?: any;
    onSave?: Function;
    onCancel?: Function;
    icon?: any;
}

const AddCategoryButton: React.FC<AddCategoryButtonProps> = ({
    Component=undefined,
    children,
    onCancel,
    onSave,
    icon
}) => {

    const [open, setOpen] = React.useState(false);
    const [category, setCategory] = React.useState('');

    const handleClickOpen = (e) => {
        setOpen(true);
    };

    const handleClose = () => {
        if(onCancel) onCancel();
        setOpen(false);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    }

    const handleConfirmation = () => {
        if(onSave) {
            onSave(category, ()=>setOpen(false))
        }
    }

    return ( 
        <>
            {!Component ? <Button startIcon={icon} onClick={handleClickOpen}>{children}</Button>
            : <Component onClick={handleClickOpen}>{children}</Component>}
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Add category</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="category-name"
                        label="Category name"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleCategoryChange}
                    />    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirmation}>Save</Button>
                </DialogActions>
            </Dialog> 
        </>
    );
}
 
export default AddCategoryButton;