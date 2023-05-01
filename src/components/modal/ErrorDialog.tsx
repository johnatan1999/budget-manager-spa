import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';

const ErrorDialog = ({
    errorMessage,
    open
}) => {

    const [show, setShow] = useState(open);

    const handleClose = () => {
        setShow(false);
    }

    useEffect(() => {
      setShow(open);
    }, [open]);
    

    return (
        <Dialog
            fullWidth
            open={show}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
        <DialogTitle id="responsive-dialog-title">
          Error
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
} 

export default ErrorDialog;