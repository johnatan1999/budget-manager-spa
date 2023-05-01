import Button from '@mui/material/Button';
import React from 'react';
import styled from 'styled-components';
import Modal from './Modal';

export interface ConfirmDialogProps {
    className?: string;
    show?: Boolean;
    message?: string;
    onConfirm: any;
    onAbort?: any;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    className='',
    show=false,
    message,
    onConfirm=() => {},
    onAbort=() => {}
}) => {

    return (
        <Modal width="small" title={"Confirmation"} show={show} onClose={onAbort}>
            <Wrapper className={[className, 'confirm-dialog'].join(' ')}>
                <p className="confirm-message">{ message }</p>
                <div className="actions">
                    <Button onClick={onAbort} variant="contained" disableElevation>No</Button>
                    <Button onClick={onConfirm} variant="contained" color="primary" disableElevation>
                        Yes
                    </Button>
                </div>
            </Wrapper>
        </Modal>
    )
}

const Wrapper = styled.div`
    &.confirm-dialog {
        padding: 10px;
    }
    .confirm-message {
        font-size: 18px;
        font-weight: 400;
        margin-bottom: 30px;
    }
    .actions {
        display: flex;
        justify-content: flex-end;
        button:first-child {
            margin-right: 15px;
        }
    }
`;

export default ConfirmDialog;