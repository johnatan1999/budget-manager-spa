import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export interface ConfirmActionProps {
    Component?: any;
    content?: any;
    title?: string;
    children?: any;
    icon?:any;
    onConfirm?: Function;
    onAbort?: Function;
    onClick?: Function;
}

const ConfirmAction: React.FC<ConfirmActionProps> = ({
    Component=undefined,
    content='',
    title='Confirmation',
    children,
    onAbort,
    onConfirm,
    onClick,
    icon
}) => {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (e) => {
        setOpen(true);
        if(onClick) onClick();
    };

    const handleClose = () => {
        if(onAbort) onAbort();
        setOpen(false);
    };

    const handleConfirmation = () => {
        if(onConfirm) {
            onConfirm(()=>setOpen(false));
        }
    }

    return ( 
        <>
            {!Component ? <Button onClick={handleClickOpen}>{children}</Button>
            : <Component onClick={handleClickOpen}>{children}</Component>}
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {content}        
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleConfirmation}>Yes</Button>
                </DialogActions>
            </Dialog> 
        </>
    );
}
 
export default ConfirmAction;