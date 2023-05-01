import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const InformationDialog = ({
    open=false,
    children,
    context='',
    title='',
    handleClose
}) => {

    return (
        <Dialog
            maxWidth='md'
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
            <DialogContentText>
                {context}
            </DialogContentText>
            {children}
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>
                Close
            </Button>
            </DialogActions>
        </Dialog>
    );
}

export default InformationDialog